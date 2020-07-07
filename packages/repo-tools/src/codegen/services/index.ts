/* eslint-disable no-console */

import { writeFileSync, unlinkSync } from 'fs';

import chalk from 'chalk';
import glob from 'glob';

import githubActionsCodegenService from './codegen-github-actions';
import ignoreFileCodegenService from './codegen-ignore-files';
import staticJsonCodegenService from './codegen-json';

const codegenServices = [
  githubActionsCodegenService,
  ignoreFileCodegenService,
  staticJsonCodegenService,
];

const resolveGlobPatterns = (pattern: string): Promise<readonly string[]> =>
  new Promise((resolve, reject) => {
    glob(pattern, (error, matches) => {
      if (error) {
        reject(error);
      } else {
        resolve(matches);
      }
    });
  });

const executeCodegenServices = async (): Promise<void> => {
  console.log(chalk.cyan('@dev-sam/repo-tools codegen service.\n'));
  // eslint-disable-next-line no-restricted-syntax
  for (const codegenService of codegenServices) {
    const { serviceName, generatedFilenamePattern, generatedCodeContentList } = codegenService;
    console.group(chalk.green(serviceName));

    if (generatedFilenamePattern != null) {
      // eslint-disable-next-line no-await-in-loop
      (await resolveGlobPatterns(generatedFilenamePattern)).map((pathToBeRemoved) =>
        unlinkSync(pathToBeRemoved)
      );
    }

    generatedCodeContentList.forEach(({ pathForGeneratedCode, generatedCode }, index) => {
      console.log(`${index + 1}. ${pathForGeneratedCode}`);
      writeFileSync(pathForGeneratedCode, generatedCode);
    });
    console.groupEnd();
  }
};

export default executeCodegenServices;
