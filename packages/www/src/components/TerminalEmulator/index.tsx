import React, { ReactElement } from 'react';
import Terminal from 'react-console-emulator';
import commands from './commands';

export default (): ReactElement => <Terminal commands={commands} />
