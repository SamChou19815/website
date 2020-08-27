type GitHubActionsPushTriggerCondition = {
  readonly triggerPaths: readonly string[];
  readonly masterBranchOnly: boolean;
};

export type GitHubActionJobStep =
  | {
      readonly type: 'use-action';
      readonly actionName: string;
      readonly actionArguments: Readonly<Record<string, string>>;
    }
  | {
      readonly type: 'run';
      readonly stepName: string;
      readonly command: string;
    };

type GitHubActionJob = {
  readonly jobName: string;
  readonly jobSteps: readonly GitHubActionJobStep[];
};

export type GitHubActionsWorkflow = {
  readonly workflowName: string;
  readonly workflowtrigger: GitHubActionsPushTriggerCondition;
  readonly workflowSecrets?: readonly string[];
  readonly workflowJobs: readonly GitHubActionJob[];
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
      const header = `      - uses: ${step.actionName}\n`;
      if (Object.keys(step.actionArguments).length === 0) {
        return header;
      }
      const withArguments = Object.entries(step.actionArguments)
        .map(([key, value]) => {
          const lines = value.split('\n');
          if (lines.length === 1) {
            return `          ${key}: ${lines[0]}`;
          }
          return `          ${key}: |\n${lines.map((line) => `            ${line}`).join('\n')}`;
        })
        .join('\n');
      return `${header}        with:\n${withArguments}\n`;
    }
    case 'run': {
      const header = `      - name: ${step.stepName}\n`;
      const lines = step.command.split('\n');
      if (lines.length === 1) {
        return `${header}        run: ${lines[0]}\n`;
      }
      return `${header}        run: |\n${lines.map((line) => `          ${line}\n`).join('')}`;
    }
    default:
      throw new Error();
  }
};

const githubActionJobToString = ({ jobName, jobSteps }: GitHubActionJob): string => {
  return `  ${jobName}:
    runs-on: ubuntu-latest
    steps:
${jobSteps.map(githubActionJobStepToString).join('')}`;
};

export const githubActionWorkflowToString = ({
  workflowName,
  workflowtrigger: { triggerPaths, masterBranchOnly },
  workflowSecrets = [],
  workflowJobs,
}: GitHubActionsWorkflow): string => {
  const header = `# @generated

name: ${workflowName}
on:
  push:
    paths:
${triggerPaths.map((path) => `      - '${path}'\n`).join('')}${
    masterBranchOnly
      ? `    branches:
      - master
`
      : ''
  }${
    workflowSecrets.length > 0
      ? `env:
${workflowSecrets.map((secret) => `  ${secret}: \${{ secrets.${secret} }}`).join('\n')}
`
      : ''
  }
jobs:
${workflowJobs.map(githubActionJobToString).join('')}`;
  return header;
};
