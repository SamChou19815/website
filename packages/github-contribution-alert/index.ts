import dotEnv from 'dotenv';
import { GraphQLClient } from 'graphql-request';

dotEnv.config();

const graphQLClient = new GraphQLClient('https://api.github.com/graphql', {
  headers: { authorization: `Bearer ${process.env.GITHUB_TOKEN ?? 'INVALID_TOKEN'}` },
});

const numberOfContributionToday = async (githubUser: string): Promise<number> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 0, 0);

  const contributionDays: readonly {
    readonly date: string;
    readonly contributionCount: number;
  }[] = await graphQLClient
    .request(
      `query {
  user(login: "${githubUser}") {
    contributionsCollection(from: "${today.toISOString()}", to: "${todayEnd.toISOString()}") {
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
    contributionDays.find(({ date }) => today.toISOString().substring(0, 10) === date)
      ?.contributionCount ?? 0
  );
};

(async () => {
  const results = await Promise.all([
    numberOfContributionToday('SamChou19815'),
    numberOfContributionToday('meganyin13'),
  ]);
  // eslint-disable-next-line no-console
  console.log('Sam', results[0], 'Megan', results[1]);
})();
