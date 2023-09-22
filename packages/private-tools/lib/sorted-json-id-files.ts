import * as fs from "fs/promises";

/**
 * For the given directory, scan all files with `<number-id>.json` filename format, and returns a
 * sorted list of those ids.
 */
export default async function sortedJSONIdFiles(
  prefix: string,
  directory: string,
): Promise<ReadonlyArray<number>> {
  const ids: Array<number> = [];

  for (let basename of await fs.readdir(directory)) {
    if (basename.startsWith(prefix)) {
      basename = basename.slice(prefix.length);
    } else {
      continue;
    }
    if (!basename.match(/^[0-9]+\.json$/)) {
      continue;
    }
    const id = parseInt(basename.substring(0, basename.length - 5));
    if (Number.isNaN(id)) {
      continue;
    }
    ids.push(id);
  }
  ids.sort((a, b) => a - b);

  return ids;
}
