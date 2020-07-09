import { spawnSync } from 'child_process';
import { readdirSync, readFileSync, lstatSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, extname, relative, dirname, basename } from 'path';

const PRIVATE_DOCS_ROOT = join(__dirname, '..', '..', '..', 'private-monorepo', 'confidential');

const recursiveListMarkdownFiles = (startDirectory: string): readonly string[] => {
  const collector: string[] = [];

  const walk = (currentRelativeDirectory: string, path: string): void => {
    const fullRelativePath = join(currentRelativeDirectory, path);
    if (!lstatSync(fullRelativePath).isDirectory()) {
      if (extname(fullRelativePath) === '.md') {
        collector.push(fullRelativePath);
      }
      return;
    }
    readdirSync(fullRelativePath).forEach((childPath) => walk(fullRelativePath, childPath));
  };

  walk(startDirectory, '.');

  return collector;
};

const processMarkdownDocumentAndReturnId = (path: string): string => {
  const documentRelativePath = relative(PRIVATE_DOCS_ROOT, path);

  const markdownDocsContent = readFileSync(path).toString();
  const baseId = basename(documentRelativePath, '.md');
  const title = markdownDocsContent
    .substring(markdownDocsContent.indexOf('# ') + 1, markdownDocsContent.indexOf('\n'))
    .trim();
  const mainContent = markdownDocsContent.substring(markdownDocsContent.indexOf('\n')).trim();
  const reassembledContent = `---\nid: '${baseId}'\ntitle: '${title}'\n---\n\n${mainContent}\n`;

  const generatedFilePath = join('docs', 'private-docs', documentRelativePath);
  mkdirSync(dirname(generatedFilePath), { recursive: true });
  writeFileSync(generatedFilePath, reassembledContent);

  return join(dirname(documentRelativePath), baseId);
};

const generatePrivateDocs = (): void => {
  if (!existsSync(PRIVATE_DOCS_ROOT)) {
    // eslint-disable-next-line no-console
    console.error('Looks like you are not Developer Sam.');
    return;
  }

  spawnSync('rm', ['-rf', 'docs/private-docs']);
  const markdownFilesAbsolutePath = recursiveListMarkdownFiles(PRIVATE_DOCS_ROOT);
  const documentIds = markdownFilesAbsolutePath.map(processMarkdownDocumentAndReturnId);
  const mergedSideBar = JSON.parse(readFileSync('sidebars.json').toString());
  mergedSideBar.docs.Private = documentIds.map((id) => `private-docs/${id}`);

  writeFileSync(
    join('docs', 'private-docs', 'private-sidebars.json'),
    JSON.stringify(mergedSideBar)
  );
};

generatePrivateDocs();
