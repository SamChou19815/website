#!/usr/bin/env node

import { existsSync, lstatSync } from 'fs';
import { dirname, join, normalize } from 'path';

import chokidar from 'chokidar';
import express from 'express';

import getIgnorePatterns from './ignore-patterns';

const DEV_SAM_MAGIC_PORT_CONSTANT = 19815;

const gitignoreAbsolutePath = (() => {
  let directory = process.cwd();
  while (directory !== '/') {
    const fullPath = join(directory, '.gitignore');
    if (existsSync(fullPath) && lstatSync(fullPath).isFile()) {
      return fullPath;
    }
    directory = dirname(directory);
  }
  throw new Error('No .gitignore found. Abort!');
})();
const projectRoot = dirname(gitignoreAbsolutePath);

const watcher = chokidar.watch('.', {
  persistent: true,
  cwd: projectRoot,
  ignored: getIgnorePatterns(projectRoot),
});
const server = express();

type FilesystemEvent = {
  readonly time: number;
  readonly filename: string;
  readonly type: 'changed' | 'deleted';
};

const events: FilesystemEvent[] = [];

watcher.on('all', (eventName, path) => {
  switch (eventName) {
    case 'add':
    case 'change':
      events.push({ time: new Date().getTime(), filename: path, type: 'changed' });
      break;
    case 'unlink':
      events.push({ time: new Date().getTime(), filename: path, type: 'deleted' });
      break;
    case 'addDir':
    case 'unlinkDir':
      break;
  }
});

server.get('/', (request, response) => {
  const rawSince = request.query.since;
  const rawPathPrefix = request.query.pathPrefix ?? '.';
  if (typeof rawSince !== 'string' || typeof rawPathPrefix !== 'string') throw new Error();
  const since = parseInt(rawSince, 10);
  let pathPrefix = normalize(rawPathPrefix);
  if (pathPrefix === '.') pathPrefix = '';
  const eventsToReport: FilesystemEvent[] = [];
  const mentionedFilenames = new Set<string>();
  for (let i = events.length - 1; i >= 0; i -= 1) {
    const event = events[i];
    if (event.time < since) {
      break;
    }
    if (event.filename.startsWith(pathPrefix) && !mentionedFilenames.has(event.filename)) {
      mentionedFilenames.add(event.filename);
      eventsToReport.push(event);
    }
  }
  response.json(eventsToReport.reverse());
});

server.listen(DEV_SAM_MAGIC_PORT_CONSTANT, () =>
  // eslint-disable-next-line no-console
  console.log(
    `[✓] \`@dev-sam/watcher-server\` is running on port ${DEV_SAM_MAGIC_PORT_CONSTANT}...`
  )
);
