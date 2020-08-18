/**
 * Copyright (c) 2019-present, Developer Sam.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Credit: Adapted from https://github.com/satya164/react-simple-code-editor/blob/master/src/index.js

import React, { ReactElement, KeyboardEvent, useState, useRef, useEffect } from 'react';

import autosize from 'autosize';
import clsx from 'clsx';
import { PrismTheme } from 'prism-react-renderer';

import styles from './PrismCodeEditor.module.css';

import CodeBlock from 'lib-react/PrismCodeBlock';

type Record = {
  readonly value: string;
  readonly selectionStart: number;
  readonly selectionEnd: number;
};

type Props = {
  readonly language: string;
  readonly code: string;
  readonly tabSize?: number;
  readonly theme: PrismTheme;
  readonly onCodeChange: (value: string) => void;
};

const Editor = ({ language, code, tabSize = 2, theme, onCodeChange }: Props): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const inputRef = useRef<HTMLTextAreaElement>(undefined!);
  const [codeBlockHeight, setCodeBlockHeight] = useState(0);

  useEffect(() => {
    const inputElement = inputRef.current;
    autosize(inputElement);
    const listener = () => {
      const heightString = inputRef.current.style.height;
      const height = parseInt(heightString.substring(0, heightString.length - 2), 10) - 16;
      setCodeBlockHeight(height);
    };
    const interval = setInterval(listener, 50);
    return () => clearInterval(interval);
  }, []);

  const getLines = (text: string, position: number) => text.substring(0, position).split('\n');

  const updateInput = (record: Record) => {
    const input = inputRef.current;
    // Update values and selection state
    input.value = record.value;
    input.selectionStart = record.selectionStart;
    input.selectionEnd = record.selectionEnd;
    onCodeChange(record.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      e.currentTarget.blur();
    }
    const { value, selectionStart, selectionEnd } = e.currentTarget;
    const tabCharacter = ' '.repeat(tabSize);

    if (e.key === 'Tab') {
      // Prevent focus change
      e.preventDefault();

      if (e.shiftKey) {
        // Unindent selected lines
        const linesBeforeCaret = getLines(value, selectionStart);
        const startLine = linesBeforeCaret.length - 1;
        const endLine = getLines(value, selectionEnd).length - 1;
        const nextValue = value
          .split('\n')
          .map((line, i) => {
            if (i >= startLine && i <= endLine && line.startsWith(tabCharacter)) {
              return line.substring(tabCharacter.length);
            }

            return line;
          })
          .join('\n');

        if (value !== nextValue) {
          const startLineText = linesBeforeCaret[startLine];

          updateInput({
            value: nextValue,
            // Move the start cursor if first line in selection was modified
            // It was modified only if it started with a tab
            selectionStart: startLineText.startsWith(tabCharacter)
              ? selectionStart - tabCharacter.length
              : selectionStart,
            // Move the end cursor by total number of characters removed
            selectionEnd: selectionEnd - (value.length - nextValue.length),
          });
        }
      } else if (selectionStart !== selectionEnd) {
        // Indent selected lines
        const linesBeforeCaret = getLines(value, selectionStart);
        const startLine = linesBeforeCaret.length - 1;
        const endLine = getLines(value, selectionEnd).length - 1;
        const startLineText = linesBeforeCaret[startLine];

        updateInput({
          value: value
            .split('\n')
            .map((line, i) => {
              if (i >= startLine && i <= endLine) {
                return tabCharacter + line;
              }

              return line;
            })
            .join('\n'),
          // Move the start cursor by number of characters added in first line of selection
          // Don't move it if it there was no text before cursor
          selectionStart: /\S/.test(startLineText)
            ? selectionStart + tabCharacter.length
            : selectionStart,
          // Move the end cursor by total number of characters added
          selectionEnd: selectionEnd + tabCharacter.length * (endLine - startLine + 1),
        });
      } else {
        const updatedSelection = selectionStart + tabCharacter.length;

        updateInput({
          // Insert tab character at caret
          value: value.substring(0, selectionStart) + tabCharacter + value.substring(selectionEnd),
          // Update caret position
          selectionStart: updatedSelection,
          selectionEnd: updatedSelection,
        });
      }
    } else if (e.key === 'Backspace') {
      const hasSelection = selectionStart !== selectionEnd;
      const textBeforeCaret = value.substring(0, selectionStart);

      if (textBeforeCaret.endsWith(tabCharacter) && !hasSelection) {
        // Prevent default delete behaviour
        e.preventDefault();

        const updatedSelection = selectionStart - tabCharacter.length;

        updateInput({
          // Remove tab character at caret
          value:
            value.substring(0, selectionStart - tabCharacter.length) +
            value.substring(selectionEnd),
          // Update caret position
          selectionStart: updatedSelection,
          selectionEnd: updatedSelection,
        });
      }
    } else if (e.key === 'Enter') {
      // Ignore selections
      if (selectionStart === selectionEnd) {
        // Get the current line
        const line = getLines(value, selectionStart).pop() || '';
        const matches = line.match(/^\s+/);

        if (matches && matches[0]) {
          e.preventDefault();

          // Preserve indentation on inserting a new line
          const indent = `\n${matches[0]}`;
          const updatedSelection = selectionStart + indent.length;

          updateInput({
            // Insert indentation character at caret
            value: value.substring(0, selectionStart) + indent + value.substring(selectionEnd),
            // Update caret position
            selectionStart: updatedSelection,
            selectionEnd: updatedSelection,
          });
        }
      }
    } else if (e.key === '(' || e.key === '[' || e.key === "'" || e.key === '`') {
      let chars;

      if (e.key === '(' && e.shiftKey) {
        chars = ['(', ')'];
      } else if (e.key === '[') {
        if (e.shiftKey) {
          chars = ['{', '}'];
        } else {
          chars = ['[', ']'];
        }
      } else if (e.key === "'") {
        if (e.shiftKey) {
          chars = ['"', '"'];
        } else {
          chars = ["'", "'"];
        }
      } else if (e.key === '`' && !e.shiftKey) {
        chars = ['`', '`'];
      }

      // If text is selected, wrap them in the characters
      if (selectionStart !== selectionEnd && chars) {
        e.preventDefault();

        updateInput({
          value:
            value.substring(0, selectionStart) +
            chars[0] +
            value.substring(selectionStart, selectionEnd) +
            chars[1] +
            value.substring(selectionEnd),
          // Update caret position
          selectionStart,
          selectionEnd: selectionEnd + 2,
        });
      }
    }
  };

  return (
    <div className={styles.EditorContainer}>
      <textarea
        ref={inputRef}
        className={clsx(styles.Editor, styles.TextArea)}
        value={code}
        onChange={(event) => onCodeChange(event.currentTarget.value)}
        onKeyDown={handleKeyDown}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        data-gramm={false}
      />
      <CodeBlock
        language={language}
        className={`${styles.Editor} ${styles.CodeBlock}`}
        theme={theme}
        style={{ height: codeBlockHeight + 16 }}
      >
        {code.trim()}
      </CodeBlock>
    </div>
  );
};

export default Editor;
