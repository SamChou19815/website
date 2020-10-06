import { readFileSync } from 'fs';
import { join } from 'path';

// Adapted from https://github.com/patrick-steele-idem/ignoring-watcher/blob/master/lib/ignore.js
const normalizeIgnorePatterns = (lines: readonly string[]): readonly string[] =>
  lines
    .map((originalLine) => {
      let line = originalLine.trim();
      if (line.length === 0) return [];

      const slashPos = line.indexOf('/');
      if (slashPos === -1) {
        // something like "*.js" which we need to interpret as [
        //  "**/*.js",
        //  "*.js/**", (in case it is a directory)
        //  "*.js"
        // ]
        return [`**/${line}`, `**/${line}/**`, `${line}/**`];
      }

      // something like "/node_modules" so we need to remove the leading slash
      if (slashPos === 0) line = line.substring(1);

      if (line.charAt(line.length - 1) === '/') {
        return [line.slice(0, -1), `${line}**`];
      } else {
        return [line];
      }
    })
    .flat();

const getIgnorePatterns = (projectRoot: string): readonly string[] => [
  ...normalizeIgnorePatterns(readFileSync(join(projectRoot, '.gitignore')).toString().split('\n')),
  join(projectRoot, '.git/**'),
];

export default getIgnorePatterns;
