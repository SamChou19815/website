// Forked from https://github.com/PrismJS/prism

/* eslint-disable no-prototype-builtins */

/** The expansion of a simple `RegExp` literal to support additional properties. */
interface GrammarToken {
  /** The regular expression of the token. */
  pattern: RegExp;
  /**
   * If `true`, then the first capturing group of `pattern` will (effectively) behave as a lookbehind
   * group meaning that the captured text will not be part of the matched text of the new token.
   * @default false
   */
  lookbehind?: boolean;
  /**
   * Whether the token is greedy.
   * @default false
   */
  greedy?: boolean;
  /** An optional alias or list of aliases. */
  alias?: string | string[];
  /**
   * The nested grammar of this token.
   *
   * The `inside` grammar will be used to tokenize the text value of each token of this kind.
   *
   * This can be used to make nested and even recursive language definitions.
   *
   * Note: This can cause infinite recursion. Be careful when you embed different languages or even
   * the same language into each another.
   */
  inside?: Grammar;
}

type GrammarValue = RegExp | GrammarToken | Array<RegExp | GrammarToken>;
type Grammar = Record<string, GrammarValue>;

/**
 * A token stream is an array of strings and {@link Token Token} objects.
 *
 * Token streams have to fulfill a few properties that are assumed by most functions (mostly internal ones) that process
 * them.
 *
 * 1. No adjacent strings.
 * 2. No empty strings.
 *
 * The only exception here is the token stream that only contains the empty string and nothing else.
 */
type TokenStream = (Token | string)[];

class Token {
  // Copy of the full string this token was created from
  length: number;

  /**
   * @param type The type of the token. This is usually the key of a pattern in a {@link Grammar}.
   * @param content The strings or tokens contained by this token. This will be a token stream if the pattern matched also defined an `inside` grammar.
   * @param alias The alias(es) of the token.
   * @param matchedStr A copy of the full string this token was created from.
   * @class
   * @global
   * @public
   */
  constructor(
    public type: string,
    public content: string | TokenStream,
    public alias: string | string[],
    matchedStr = '',
  ) {
    this.length = matchedStr.length;
  }
}

interface LinkedListNode<T> {
  value: T;
  prev: LinkedListNode<T>;
  next: LinkedListNode<T>;
}

class LinkedList<T> {
  head: LinkedListNode<T>;
  tail: LinkedListNode<T>;
  length = 0;

  constructor() {
    // @ts-expect-error: Unsafe nullability usage
    this.head = { value: null, prev: null, next: null };
    // @ts-expect-error: Unsafe nullability usage
    this.tail = { value: null, prev: this.head, next: null };
    this.head.next = this.tail;
  }
}

function matchPattern(
  pattern: RegExp,
  pos: number,
  text: string,
  lookbehind: boolean,
): RegExpExecArray | null {
  pattern.lastIndex = pos;
  const match = pattern.exec(text);
  if (match && lookbehind && match[1]) {
    // change the match to remove the text matched by the Prism lookbehind group
    const lookbehindLength = match[1].length;
    match.index += lookbehindLength;
    match[0] = match[0].slice(lookbehindLength);
  }
  return match;
}

function matchGrammar(
  text: string,
  tokenList: LinkedList<Token | string>,
  grammar: Grammar,
  startNode: LinkedListNode<Token | string>,
  startPos: number,
  rematch?: { cause: string; reach: number },
): void {
  for (const token in grammar) {
    if (!(grammar.hasOwnProperty(token) && grammar[token])) {
      continue;
    }

    let patterns = grammar[token];
    if (patterns == null) {
      throw new Error();
    }
    patterns = Array.isArray(patterns) ? patterns : [patterns];

    for (let j = 0; j < patterns.length; ++j) {
      if (rematch && rematch.cause === `${token},${j}`) {
        return;
      }

      const patternObj = patterns[j];
      if (patternObj == null) {
        throw new Error();
      }
      // @ts-expect-error: Too dynamic
      const inside = patternObj.inside;
      // @ts-expect-error: Too dynamic
      const lookbehind = patternObj.lookbehind;
      // @ts-expect-error: Too dynamic
      const greedy = patternObj.greedy;
      // @ts-expect-error: Too dynamic
      const alias = patternObj.alias;

      // @ts-expect-error: Too dynamic
      if (greedy && !patternObj.pattern.global) {
        // Without the global flag, lastIndex won't work
        // @ts-expect-error: Too dynamic
        const flags = patternObj.pattern.toString().match(/[imsuy]*$/)[0];
        // @ts-expect-error: Too dynamic
        patternObj.pattern = RegExp(patternObj.pattern.source, `${flags}g`);
      }

      // @ts-expect-error: Too dynamic
      const pattern: RegExp = patternObj.pattern || patternObj;

      for (
        // iterate the token list and keep track of the current token/string position
        let currentNode = startNode.next, pos = startPos;
        currentNode !== tokenList.tail;
        pos += currentNode.value.length, currentNode = currentNode.next
      ) {
        if (rematch && pos >= rematch.reach) {
          break;
        }

        let str = currentNode.value;

        if (tokenList.length > text.length) {
          // Something went terribly wrong, ABORT, ABORT!
          return;
        }

        if (str instanceof Token) {
          continue;
        }

        let removeCount = 1; // this is the to parameter of removeBetween
        let match: RegExpExecArray | null;

        if (greedy) {
          match = matchPattern(pattern, pos, text, lookbehind);
          if (!match || match.index >= text.length) {
            break;
          }

          const from = match.index;
          const to = match.index + match[0].length;
          let p = pos;

          // find the node that contains the match
          p += currentNode.value.length;
          while (from >= p) {
            currentNode = currentNode.next;
            p += currentNode.value.length;
          }
          // adjust pos (and p)
          p -= currentNode.value.length;
          pos = p;

          // the current node is a Token, then the match starts inside another Token, which is invalid
          if (currentNode.value instanceof Token) {
            continue;
          }

          // find the last node which is affected by this match
          for (
            let k = currentNode;
            k !== tokenList.tail && (p < to || typeof k.value === 'string');
            k = k.next
          ) {
            removeCount++;
            p += k.value.length;
          }
          removeCount--;

          // replace with the new match
          str = text.slice(pos, p);
          match.index -= pos;
        } else {
          match = matchPattern(pattern, 0, str, lookbehind);
          if (!match) {
            continue;
          }
        }

        const from = match.index;
        const matchStr = match[0];
        if (matchStr == null) {
          throw new Error();
        }
        const before = str.slice(0, from);
        const after = str.slice(from + matchStr.length);

        const reach = pos + str.length;
        if (rematch && reach > rematch.reach) {
          rematch.reach = reach;
        }

        let removeFrom = currentNode.prev;

        if (before) {
          removeFrom = addAfter(tokenList, removeFrom, before);
          pos += before.length;
        }

        removeRange(tokenList, removeFrom, removeCount);

        const wrapped = new Token(
          token,
          inside ? Prism.tokenize(matchStr, inside) : matchStr,
          alias,
          matchStr,
        );
        currentNode = addAfter(tokenList, removeFrom, wrapped);

        if (after) {
          addAfter(tokenList, currentNode, after);
        }

        if (removeCount > 1) {
          // at least one Token object was removed, so we have to do some rematching
          // this can only happen if the current pattern is greedy

          const nestedRematch = { cause: `${token},${j}`, reach };
          matchGrammar(text, tokenList, grammar, currentNode.prev, pos, nestedRematch);

          // the reach might have been extended because of the rematching
          if (rematch && nestedRematch.reach > rematch.reach) {
            rematch.reach = nestedRematch.reach;
          }
        }
      }
    }
  }
}

/**
 * Adds a new node with the given value to the list.
 * @returns the added node.
 */
function addAfter<T>(list: LinkedList<T>, node: LinkedListNode<T>, value: T): LinkedListNode<T> {
  // assumes that node != list.tail && values.length >= 0
  const next = node.next;

  const newNode = { value, prev: node, next };
  node.next = newNode;
  next.prev = newNode;
  list.length++;

  return newNode;
}

/** Removes `count` nodes after the given node. The given node will not be removed. */
function removeRange<T>(list: LinkedList<T>, node: LinkedListNode<T>, count: number): void {
  let next = node.next;
  let i = 0;
  for (; i < count && next !== list.tail; i++) {
    next = next.next;
  }
  node.next = next;
  next.prev = node;
  list.length -= i;
}

function toArray<T>(list: LinkedList<T>): T[] {
  const array: T[] = [];
  let node = list.head.next;
  while (node !== list.tail) {
    array.push(node.value);
    node = node.next;
  }
  return array;
}

class PrismClass {
  languages: { [language: string]: Record<string, GrammarValue> } = {
    plain: {},
    plaintext: {},
    text: {},
    txt: {},
  };

  tokenize(text: string, language: string): (Token | string)[] {
    const grammar = this.languages[language];
    if (grammar == null) {
      return [text];
    }

    const tokenList = new LinkedList<Token | string>();
    addAfter(tokenList, tokenList.head, text);
    matchGrammar(text, tokenList, grammar, tokenList.head, 0);
    return toArray(tokenList);
  }
}

const Prism: PrismClass = new PrismClass();
export default Prism;
