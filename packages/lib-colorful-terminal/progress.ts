import { YELLOW } from './colors';

const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

/**
 * Starts a spinner of progress in supported terminal.
 *
 * @returns a timeout that can be used to cancel the progress spinner.
 */
const startSpinnerProgress = (getMessage: (passedTime: string) => string): NodeJS.Timeout => {
  let iteration = 0;
  const startTime = new Date().getTime();
  return setInterval(
    () => {
      const passedTime = `${((new Date().getTime() - startTime) / 1000).toFixed(1)}s`;
      const message = getMessage(passedTime);
      const frame = spinner[iteration % 10];
      process.stderr.write(YELLOW(`${message} ${frame}\r`));
      iteration += 1;
    },
    process.stderr.isTTY ? 40 : 1000
  );
};

export default startSpinnerProgress;
