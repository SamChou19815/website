/* eslint-disable no-console */

import { Commands } from 'react-console-emulator';

const commands: Commands = {
  echo: { fn: (...inputs: string[]) => inputs.join(' ') },
  'dev-sam': {
    fn: () => `Copyright (C) 2015–${new Date().getFullYear()} Developer Sam. All rights reserved.`
  }
};

export default commands;
