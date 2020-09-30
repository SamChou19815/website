/* eslint-disable no-console */

import dotEnv from 'dotenv';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { GraphQLClient } from 'graphql-request';
import { DateTime } from 'luxon';

dotEnv.config();
admin.initializeApp();

const graphQLClient = new GraphQLClient('https://api.github.com/graphql', {
  headers: { authorization: `Bearer ${process.env.GITHUB_TOKEN ?? 'INVALID_TOKEN'}` },
});

const numberOfContributionToday = async (githubUser: string): Promise<number> => {
  // The system is built for a small set of users in NY, at least in recent future.
  const currentTimeInNewYork = DateTime.local().setZone('America/New_York');
  const todayInNYStart = currentTimeInNewYork.startOf('day');
  const todayInNYEnd = currentTimeInNewYork.endOf('day');

  // Using Sam's PAT, which makes the query timezone in NY.
  const contributionDays: readonly {
    readonly date: string;
    readonly contributionCount: number;
  }[] = await graphQLClient
    .request(
      `query {
  user(login: "${githubUser}") {
    contributionsCollection(from: "${todayInNYStart.toISO()}", to: "${todayInNYEnd.toISO()}") {
      contributionCalendar { weeks { contributionDays { date contributionCount } } }
    }
  }
}`
    )
    .then(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data: any) =>
        data.user.contributionsCollection.contributionCalendar.weeks[0].contributionDays
    );

  return (
    contributionDays.find(({ date }) => currentTimeInNewYork.toISODate() === date)
      ?.contributionCount ?? 0
  );
};

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

    const [sam, megan] = await Promise.all([
      numberOfContributionToday('SamChou19815'),
      numberOfContributionToday('meganyin13'),
    ]);
    console.log('Sam', sam, 'Megan', megan);
  });
