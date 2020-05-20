import React, { ReactElement, useRef } from 'react';

import renderer from 'react-test-renderer';

import StatelessTerminal from './StatelessTerminal';
import { TerminalHistory } from './types';

const Wrapper = ({ history }: { readonly history: readonly TerminalHistory[] }): ReactElement => {
  const terminalRoot = useRef<HTMLDivElement>(null);
  const terminalInput = useRef<HTMLInputElement>(null);
  const ignore = () => {};
  return (
    <StatelessTerminal
      history={history}
      terminalRoot={terminalRoot}
      terminalInput={terminalInput}
      focusTerminal={ignore}
      onArrow={() => null}
      processCommand={ignore}
    />
  );
};

it(`StatelessTerminal matches snapshot.`, () => {
  const history = [
    { isCommand: true, line: 'foo' },
    { isCommand: false, line: 'bar' },
  ];
  const tree = renderer.create(<Wrapper history={history} />).toJSON();
  expect(tree).toMatchSnapshot();
});
