import * as path from "path";
import * as fs from "fs/promises";
import defineCommand from "../lib/define-command";

export default defineCommand(
  { directory: { short: "d", kind: "string" }, keepOld: { short: "k", kind: "boolean" } },
  async ({ spec: { directory, keepOld }, positionals }) => {
    const renameFn = eval(positionals[0] || "(s) => s");
    await Promise.all(
      (await fs.readdir(directory)).map((basename) => {
        const oldPath = path.join(directory, basename);
        const newPath = path.join(directory, renameFn(basename));
        return keepOld ? fs.copyFile(oldPath, newPath) : fs.rename(oldPath, newPath);
      }),
    );
  },
);
