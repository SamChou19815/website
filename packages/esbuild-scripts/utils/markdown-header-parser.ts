type MarkdownHeader = { readonly level: number; readonly label: string };

const markdownHeaderToString = ({ level, label }: MarkdownHeader): string =>
  `${'#'.repeat(level)} ${label}`;

export const extractMarkdownHeaders = (source: string): readonly MarkdownHeader[] => {
  const headers: MarkdownHeader[] = [];
  let insideCodeBlock = false;
  const linesWithoutCodeBlock = source.split('\n').filter((line) => {
    if (line.startsWith('```')) {
      insideCodeBlock = !insideCodeBlock;
    } else {
      return !insideCodeBlock;
    }
  });
  linesWithoutCodeBlock.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed.startsWith('#')) return;
    let level = 0;
    while (true) {
      if (trimmed[level] === '#') {
        level += 1;
      } else {
        break;
      }
    }
    if (level > 6) throw new Error(`Invalid Header: '${trimmed}'`);
    headers.push({ level, label: trimmed.substring(level).trim() });
  });
  return headers;
};

const extractAndValidateMarkdownHeaders = (source: string): readonly MarkdownHeader[] => {
  const headers = extractMarkdownHeaders(source);
  if (headers[0] == null) throw new Error('Lacking title.');
  if (headers[0].level !== 1) {
    throw new Error(`First heading must be h1, found: ${markdownHeaderToString(headers[0])}`);
  }
  if (headers.filter((it) => it.level === 1).length > 1) {
    throw new Error('More than one h1.');
  }
  return headers;
};

const treeifyMarkdownHeaders = (
  headers: readonly MarkdownHeader[],
  index: number
): { element: MarkdownTablesOfContentsElement; level: number; finishedIndex: number } => {
  const current = headers[index];
  if (current == null) throw new Error();
  const children: MarkdownTablesOfContentsElement[] = [];
  let i = index + 1;
  while (i < headers.length) {
    const { element: child, level: childLevel, finishedIndex } = treeifyMarkdownHeaders(headers, i);
    if (childLevel <= current.level) break;
    if (childLevel > current.level + 1) {
      const headerString = markdownHeaderToString({ level: childLevel, label: child.label });
      throw new Error(`Invalid header: ${headerString}. Expected Level: ${current.level + 1}`);
    }
    i = finishedIndex;
    children.push(child);
  }
  return { element: { label: current.label, children }, level: current.level, finishedIndex: i };
};

const parseMarkdownHeaderTree = (source: string): MarkdownTablesOfContentsElement => {
  const headers = extractAndValidateMarkdownHeaders(source);
  return treeifyMarkdownHeaders(headers, 0).element;
};

export const parseMarkdownTitle = (source: string): string => {
  const header = extractAndValidateMarkdownHeaders(source)[0];
  if (header == null) throw new Error();
  return header.label;
};

export default parseMarkdownHeaderTree;
