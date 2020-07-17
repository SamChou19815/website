import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';

const PATH = join('.monorail', 'incremental-compile.json');

export const getIncrementalCompileLastRunTime = (): number => {
  if (!existsSync(PATH)) {
    return 0;
  }
  return Number(JSON.parse(readFileSync(PATH).toString()).lastRunTime);
};

export const setIncrementalCompileLastRunTime = (): void => {
  mkdirSync(dirname(PATH), { recursive: true });
  writeFileSync(PATH, JSON.stringify({ lastRunTime: new Date().getTime() }, undefined, 2));
};
