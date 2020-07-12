import { existsSync, copyFileSync, mkdirSync, readFileSync } from 'fs';
import { dirname, join } from 'path';

const safeCopy = (source: string, destination: string): void => {
  mkdirSync(dirname(destination), { recursive: true });
  copyFileSync(source, destination);
};

type SynchronizeConfiguration = Readonly<Record<string, Readonly<Record<string, string>>>>;

const synchronize = (): void => {
  const synchronizeConfigurationPath = join('configuration', 'sync-configuration.json');
  if (!existsSync(synchronizeConfigurationPath)) {
    return;
  }
  const synchronizeConfiguration: SynchronizeConfiguration = JSON.parse(
    readFileSync(synchronizeConfigurationPath).toString()
  );

  Object.entries(synchronizeConfiguration).forEach(([repositoryName, synchronizeFileMappings]) => {
    Object.entries(synchronizeFileMappings).forEach(([source, destination]) => {
      safeCopy(source, join('..', repositoryName, destination));
    });
  });
};

export default synchronize;
