/* eslint-disable no-console */

import { Commands } from 'react-console-emulator';

const commands: Commands = {
  echo: { fn: (...inputs: string[]) => inputs.join(' ') },
  haha: { fn: () => 'haha' }
};

export default commands;
