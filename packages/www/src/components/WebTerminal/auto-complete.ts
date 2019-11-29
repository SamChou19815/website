import { FileSystemState } from '../../filesystem/types';
import { normalize, getParent, getLast, join } from '../../filesystem/path';
import { changeDirectory, listFiles } from '../../filesystem';

/**
 * @param sources a list of strings that can be used to expand the prefix.
 * @param prefix the prefix to expand. No whitespace should be in the string.
 * @returns expanded prefix string, or `null` if autocompletion failed.
 */
export const autoCompleteCommand = (sources: readonly string[], prefix: string): string | null => {
  const matchedPrefix = sources.filter(source => source.startsWith(prefix));
  if (matchedPrefix.length === 0) {
    return null;
  }
  if (matchedPrefix.length === 1) {
    return matchedPrefix[0];
  }
  let bestPrefix = prefix;
  for (let i = prefix.length; ; i += 1) {
    const characterSet = new Set<string>();
    for (let j = 0; j < matchedPrefix.length; j += 1) {
      const source = matchedPrefix[j];
      if (i >= source.length) {
        return bestPrefix;
      }
      characterSet.add(source.charAt(i));
    }
    if (characterSet.size < 1) {
      throw new Error('Impossible!');
    }
    if (characterSet.size > 1) {
      // Choosing either one means loss of generality. We stop here.
      return bestPrefix;
    }
    bestPrefix += Array.from(characterSet.entries())[0][0];
  }
};

/**
 * @param state the current file system state as context for autocompletion.
 * @param prefix the prefix to expand. No whitespace should be in the string.
 * @returns expanded prefix string, or `null` if autocompletion failed.
 */
export const autoCompleteFilename = (state: FileSystemState, prefix: string): string | null => {
  const parent = getParent(prefix);
  const files = (() => {
    try {
      return listFiles(changeDirectory(state, parent), []).split('\n');
    } catch {
      return null;
    }
  })();
  if (files === null) {
    return null;
  }
  const lastExpanded = autoCompleteCommand(files, getLast(prefix));
  if (lastExpanded === null) {
    return null;
  }
  return parent === '.' ? normalize(lastExpanded) : join(parent, lastExpanded);
};

/**
 * @param sources a list of strings that can be used to expand the prefix.
 * @param prefix the line to expand.
 * @returns expanded line.
 */
const autoCompleteCommandLine = (sources: readonly string[], line: string): string => {
  const parts = line.trim().split(' ');
  if (parts.length === 0) {
    return '';
  }
  const result = autoCompleteCommand(sources, parts[parts.length - 1]);
  const finalPart = result === null ? parts[parts.length - 1] : result;
  return [...parts.slice(0, parts.length - 1), finalPart].join(' ').trim();
};

export default autoCompleteCommandLine;
