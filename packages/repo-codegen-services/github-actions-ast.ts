export type GitHubActionJobStep =
  | {
      readonly type: 'use-action';
      readonly actionName: string;
      readonly actionArguments: Readonly<Record<string, string>>;
    }
  | { readonly type: 'run'; readonly stepName: string; readonly command: string };

export type GitHubActionsWorkflow = {
  readonly workflowName: string;
  readonly workflowtrigger: {
    readonly triggerPaths: readonly string[];
    readonly masterBranchOnly: boolean;
  };
  readonly workflowJobs: readonly (readonly [string, readonly GitHubActionJobStep[]])[];
};

export const githubActionJobActionStep = (
  actionName: string,
  actionArguments: Readonly<Record<string, string>> = {}
): GitHubActionJobStep => ({ type: 'use-action', actionName, actionArguments });

export const githubActionJobRunStep = (stepName: string, command: string): GitHubActionJobStep => ({
  type: 'run',
  stepName,
  command,
});

const githubActionJobStepToString = (step: GitHubActionJobStep): string => {
  switch (step.type) {
    case 'use-action': {
      const header = `${' '.repeat(6)}- uses: ${step.actionName}\n`;
      if (Object.keys(step.actionArguments).length === 0) {
        return header;
      }
      const withArguments = Object.entries(step.actionArguments)
        .map(([key, value]) => `${' '.repeat(10)}${key}: "${value}"`)
        .join('\n');
      return `${header}${' '.repeat(8)}with:\n${withArguments}\n`;
    }
    case 'run': {
      return `${' '.repeat(6)}- name: ${step.stepName}\n${' '.repeat(8)}run: ${step.command}\n`;
    }
  }
};

const githubActionJobToString = ([jobName, jobSteps]: readonly [
  string,
  readonly GitHubActionJobStep[]
]): string => {
  return `  ${jobName}:
    runs-on: ubuntu-latest
    steps:
${jobSteps.map(githubActionJobStepToString).join('')}`;
};

export const githubActionWorkflowToString = ({
  workflowName,
  workflowtrigger: { triggerPaths, masterBranchOnly },
  workflowJobs,
}: GitHubActionsWorkflow): string => {
  const header = `# @${'generated'}

name: ${workflowName}
on:
  push:
    paths:
${triggerPaths.map((path) => `      - '${path}'`).join('\n')}
${
  masterBranchOnly
    ? `    branches:
      - master
`
    : ''
}
jobs:
${workflowJobs.map(githubActionJobToString).join('')}`;
  return header;
};
