/* eslint-disable no-console */

import SendGridMail from '@sendgrid/mail';
import dotEnv from 'dotenv';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { GraphQLClient } from 'graphql-request';
import { DateTime } from 'luxon';

dotEnv.config();
admin.initializeApp();
SendGridMail.setApiKey(functions.config().github_contribution_alert.sendgrid_api_key);

const graphQLClient = new GraphQLClient('https://api.github.com/graphql', {
  headers: { authorization: `Bearer ${functions.config().github_contribution_alert.github_token}` },
});

type TotalCount = { readonly totalCount: number };
type ContributionsCollection = {
  readonly issueContributions: TotalCount;
  readonly pullRequestContributions: TotalCount;
  readonly repositoryContributions: TotalCount;
  readonly commitContributionsByRepository: readonly { readonly contributions: TotalCount }[];
};
type GitHubGraphQLResponse = {
  readonly user: { readonly contributionsCollection: ContributionsCollection };
};

const fetchContributionsCollection = async (
  githubUser: string
): Promise<ContributionsCollection> => {
  // The system is built for a small set of users in NY, at least in recent future.
  const currentTimeInNewYork = DateTime.local().setZone('America/New_York');
  const todayInNYStart = currentTimeInNewYork.startOf('day');
  const todayInNYEnd = currentTimeInNewYork.endOf('day');

  // Using Sam's PAT, which makes the query timezone in NY.
  const {
    user: { contributionsCollection },
  } = await graphQLClient.request<GitHubGraphQLResponse>(
    `query {
  user(login: "${githubUser}") {
    contributionsCollection(from: "${todayInNYStart.toISO()}", to: "${todayInNYEnd.toISO()}") {
      issueContributions {
        totalCount
      }
      pullRequestContributions {
        totalCount
      }
      repositoryContributions {
        totalCount
      }
      commitContributionsByRepository {
        repository {
          nameWithOwner
        }
        contributions {
          totalCount
        }
      }
    }
  }
}`
  );
  return contributionsCollection;
};

const sumContributions = ({
  issueContributions,
  pullRequestContributions,
  repositoryContributions,
  commitContributionsByRepository,
}: ContributionsCollection): number =>
  commitContributionsByRepository.reduce(
    (accumulator, current) => accumulator + current.contributions.totalCount,
    issueContributions.totalCount +
      pullRequestContributions.totalCount +
      repositoryContributions.totalCount
  );

// eslint-disable-next-line import/prefer-default-export
export const SendGitHubContributionAlertWhenNecessary = functions.pubsub
  .schedule('0 * * * *')
  .onRun(async () => {
    const currentTime = DateTime.local();
    // Always log time in UTC and NY for debugging.
    // UTC is the hardcoded timezone for Google's datacenter.
    console.log(`Current time in UTC: ${currentTime.toUTC().toISO()}`);
    console.log(`Current time in NY: ${currentTime.setZone('America/New_York').toISO()}`);

    const currentHourInNewYork = currentTime.setZone('America/New_York').hour;
    if (currentHourInNewYork < 20) {
      console.log(
        `The script is only active after 8PM in NY. Current hour: ${currentHourInNewYork}`
      );
      return;
    }

    // Format: user1-github,user1-nickname,user1-email;user2-github,user2-nickname,user2-email
    const usersFromConfig: string = functions.config().github_contribution_alert.users;
    const users = usersFromConfig
      .trim()
      .split(';')
      .map((userInformationCommaSeparated) => {
        const [githubID, name, email] = userInformationCommaSeparated.split(',');
        return { githubID, name, email };
      });

    await Promise.all(
      users.map(async ({ githubID, name, email }) => {
        const contributions = await fetchContributionsCollection(githubID);
        const count = sumContributions(contributions);
        console.log(`${name}'s number of contributions: ${count}.`);
        console.log(`Raw data: ${JSON.stringify(contributions)}`);
        if (count > 0) {
          return null;
        }
        await SendGridMail.send({
          to: email,
          from: 'bot@developersam.com',
          subject: "[github-contribution-alert] You still don't have a contribution for today!",
          text: `Hi ${name}. Looks like you still don't have a **safe** contribution for today :sad-octocat:.
(Reply back if you think it is a false alert.)`,
        });
        console.log(`Sent alert email to ${email} (${name})`);
      })
    );
  });
