/* eslint-disable no-console */
import * as yargs from 'yargs';
import { writeFileSync } from 'fs';
import { validateDependencyChain, getDependencyChain } from './workspace';
import generateWorkflows from './generator';

const main = (): unknown =>
  yargs
    .scriptName('tooling')
    .command('validate-dependencies', 'Validate all dependencies.', {}, () => {
      if (!validateDependencyChain()) {
        process.exit(1);
      }
    })
    .command(
      'dependency-chain',
      'Print the dependency chain of the given workspace.',
      args => args.option('workspace', { demandOption: true }),
      ({ workspace }) => {
        if (typeof workspace !== 'string') {
          console.log('Workspace must be a string!');
          process.exit(1);
          return;
        }
        let chain: readonly string[];
        try {
          chain = getDependencyChain(workspace);
        } catch (e) {
          console.log(e.message);
          process.exit(1);
          return;
        }
        chain.forEach(dependency => console.log(dependency));
      }
    )
    .command(
      'generate-workflows',
      'Generate CI/CD workflows',
      args => args.option('out', { demandOption: true, default: '.github/workflows' }),
      ({ out }) => {
        generateWorkflows().forEach(([workflowFilename, workflowFileContent]) => {
          writeFileSync(`${out}/${workflowFilename}`, workflowFileContent);
        });
      }
    )
    .help().argv;

main();
