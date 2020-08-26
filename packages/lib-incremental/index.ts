import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname } from 'path';

/** Task ID to lastest good run time. */
type MutableLastestKnownGoodRunTime = Record<string, number | undefined>;
export type LastestKnownGoodRunTime = Readonly<MutableLastestKnownGoodRunTime>;

export interface IncrementalTaskSpecification {
  readonly lastestKnownGoodRunTimeFilename: string;
  /**
   * @returns a list of task ID that needs to be rerun.
   * Usually, implementation of this function will consider the set of changed files.
   */
  readonly needRerun: (
    lastestKnownGoodRunTime: LastestKnownGoodRunTime
  ) => Promise<readonly string[]>;
  /** Run the job and returns whether a run is successful. */
  readonly rerun: (
    taskID: string,
    lastestKnownGoodRunTime: LastestKnownGoodRunTime
  ) => Promise<boolean>;
}

/**
 * The incremental task running framework.
 * It doesn't care about which tasks to rerun and how to rerun them. These information is provided by
 * the `specification` object.
 * Instead, it will maintain latest known good run time to help decide rerunning jobs.
 *
 * @param specification
 * @returns task IDs of failed jobs.
 */
const runIncrementalTasks = async (
  specification: IncrementalTaskSpecification
): Promise<readonly string[]> => {
  const lastestKnownGoodRunTime: MutableLastestKnownGoodRunTime = existsSync(
    specification.lastestKnownGoodRunTimeFilename
  )
    ? JSON.parse(readFileSync(specification.lastestKnownGoodRunTimeFilename).toString())
    : ({} as MutableLastestKnownGoodRunTime);

  const tasksToRun = await specification.needRerun(lastestKnownGoodRunTime);
  const statusList = await Promise.all(
    tasksToRun.map(
      async (taskID) =>
        [taskID, await specification.rerun(taskID, lastestKnownGoodRunTime)] as const
    )
  );

  const latestRunTime = new Date().getTime();
  const failed: string[] = [];
  statusList.forEach(([taskID, successful]) => {
    if (successful) {
      lastestKnownGoodRunTime[taskID] = latestRunTime;
    } else {
      failed.push(taskID);
    }
  });

  mkdirSync(dirname(specification.lastestKnownGoodRunTimeFilename), { recursive: true });
  writeFileSync(
    specification.lastestKnownGoodRunTimeFilename,
    JSON.stringify(lastestKnownGoodRunTime, undefined, 2)
  );

  return failed;
};

export default runIncrementalTasks;
