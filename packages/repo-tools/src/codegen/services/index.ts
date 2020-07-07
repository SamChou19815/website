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

const executeCodegenServices = async (): Promise<boolean> => {
  let successful = true;

  console.log(chalk.cyan('@dev-sam/repo-tools codegen service.\n'));
  // eslint-disable-next-line no-restricted-syntax
  for (const codegenService of codegenServices) {
    const { serviceName, generatedFilenamePattern, generatedCodeContentList } = codegenService;
    console.group(chalk.green(serviceName));

    if (generatedFilenamePattern != null) {
      // eslint-disable-next-line no-await-in-loop
      const removeSet = new Set(await resolveGlobPatterns(generatedFilenamePattern));
      // Sanity check
      const badFilesNotInPattern = generatedCodeContentList
        .map(({ pathForGeneratedCode }) => pathForGeneratedCode)
        .filter((path) => !removeSet.has(path));
      if (badFilesNotInPattern.length > 0) {
        console.log(
          chalk.red(
            `Pattern: \`${generatedFilenamePattern}\`.\n` +
              `Generated files not in pattern: ${badFilesNotInPattern.join(', ')}`
          )
        );
        successful = false;
      }
      Array.from(removeSet).map((pathToBeRemoved) => unlinkSync(pathToBeRemoved));
    }

    generatedCodeContentList.forEach(({ pathForGeneratedCode, generatedCode }, index) => {
      console.log(`${index + 1}. ${pathForGeneratedCode}`);
      writeFileSync(pathForGeneratedCode, generatedCode);
    });
    console.groupEnd();
  }
  return successful;
};

export default executeCodegenServices;
