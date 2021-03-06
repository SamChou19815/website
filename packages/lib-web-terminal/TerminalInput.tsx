import React, { ReactElement, KeyboardEvent, RefObject, useState, useEffect } from 'react';

import styles from './Terminal.module.css';
import { useWebTerminalCommands } from './WebTerminalCommandsContext';
import autoComplete from './auto-complete';

type Props = {
  readonly terminalInput: RefObject<HTMLInputElement>;
  readonly onArrow: (arrow: 'up' | 'down') => string | null;
  readonly onSubmit: (line: string) => void;
};

const TerminalInput = ({ terminalInput, onArrow, onSubmit }: Props): ReactElement => {
  const commands = useWebTerminalCommands();
  const [line, setLine] = useState('');
  const [justProcessedArrowKey, setJustProcessedArrowKey] = useState(false);

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Enter':
        setLine('');
        onSubmit(line);
        break;
      case 'ArrowUp':
      case 'ArrowDown': {
        const result = onArrow(event.key === 'ArrowUp' ? 'up' : 'down');
        setJustProcessedArrowKey(true);
        if (result !== null) {
          setLine(result);
        }
        break;
      }
      case 'Tab':
        event.preventDefault();
        setLine((currentLine) => autoComplete(commands, currentLine));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const terminalInputDOMNode = terminalInput?.current;
    if (terminalInputDOMNode != null && justProcessedArrowKey) {
      setJustProcessedArrowKey(false);
      terminalInputDOMNode.selectionStart = line.length;
    }
  }, [terminalInput, line, justProcessedArrowKey]);

  return (
    <div className={styles.TerminalInputArea}>
      <span className={styles.TerminalPromptLabel}>$</span>
      <input
        name="terminal-input"
        ref={terminalInput}
        className={styles.TerminalInput}
        value={line}
        onChange={(event) => setLine(event.currentTarget.value)}
        onKeyDown={onKeyDown}
        type="text"
        autoComplete="off"
      />
    </div>
  );
};

export default TerminalInput;
