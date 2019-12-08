import React, { ReactElement, KeyboardEvent, RefObject, useState } from 'react';
import autoComplete from './auto-complete';
import styles from './Terminal.module.css';

type Props = {
  readonly terminalInput: RefObject<HTMLInputElement>;
  readonly onArrow: (arrow: 'up' | 'down') => string | null;
  readonly onSubmit: (line: string) => void;
};

export default ({ terminalInput, onArrow, onSubmit }: Props): ReactElement => {
  const [line, setLine] = useState('');

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Enter':
        setLine('');
        onSubmit(line);
        break;
      case 'ArrowUp':
      case 'ArrowDown': {
        const result = onArrow(event.key === 'ArrowUp' ? 'up' : 'down');
        if (result !== null) {
          setLine(result);
        }
        break;
      }
      case 'Tab':
        event.preventDefault();
        setLine(currentLine => autoComplete(currentLine));
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.TerminalInputArea}>
      <span className={styles.TerminalPromptLabel}>$</span>
      <input
        name="terminal-input"
        ref={terminalInput}
        className={styles.TerminalInput}
        value={line}
        onChange={event => setLine(event.currentTarget.value)}
        onKeyDown={onKeyDown}
        type="text"
        autoComplete="off"
      />
    </div>
  );
};
