import * as fs from "fs/promises";
import type { JsonAny } from "./any-flavors";

export default async function readJSON(path: string, defaultValue: unknown): Promise<JsonAny> {
  try {
    return JSON.parse((await fs.readFile(path)).toString("utf8"));
  } catch {
    return defaultValue;
  }
}
