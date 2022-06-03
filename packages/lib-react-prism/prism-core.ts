// Forked from https://github.com/PrismJS/prism

/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-explicit-any */

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
    matchedStr = ''
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

const CloneUtil = {
  uniqueId: 0,

  /**
   * Returns the name of the type of the given value.
   *
   * @param {any} o
   * @returns {string}
   * @example
   * type(null)      === 'Null'
   * type(undefined) === 'Undefined'
   * type(123)       === 'Number'
   * type('foo')     === 'String'
   * type(true)      === 'Boolean'
   * type([1, 2])    === 'Array'
   * type({})        === 'Object'
   * type(String)    === 'Function'
   * type(/abc+/)    === 'RegExp'
   */
  type(o: unknown): string {
    return Object.prototype.toString.call(o).slice(8, -1);
  },

  /** Returns a unique number for the given object. Later calls will still return the same number. */
  objId(obj: any): number {
    if (!obj['__id']) {
      Object.defineProperty(obj, '__id', { value: ++CloneUtil.uniqueId });
    }
    return obj['__id'];
  },

  /**
   * Creates a deep clone of the given object.
   * The main intended use of this function is to clone language definitions.
   */
  clone: function deepClone<T>(o: T, visited: Record<number, any> = {}): T {
    switch (CloneUtil.type(o)) {
      case 'Object': {
        const id = CloneUtil.objId(o);
        if (visited[id]) {
          return visited[id];
        }
        const clone: Record<string, unknown> = {};
        visited[id] = clone;

        for (const key in o) {
          // @ts-expect-error: Untyped JS code
          if (o.hasOwnProperty(key)) {
            clone[key] = deepClone(o[key], visited);
          }
        }

        return clone as unknown as T;
      }

      case 'Array': {
        const id = CloneUtil.objId(o);
        if (visited[id]) {
          return visited[id];
        }
        const clone: unknown[] = [];
        visited[id] = clone;

        (o as unknown as unknown[]).forEach((v, i) => {
          clone[i] = deepClone(v, visited);
        });

        return clone as unknown as T;
      }

      default:
        return o;
    }
  },
};

function matchPattern(
  pattern: RegExp,
  pos: number,
  text: string,
  lookbehind: boolean
): RegExpExecArray | null {
  pattern.lastIndex = pos;
  const match = pattern.exec(text);
  if (match && lookbehind && match[1]) {
    // change the match to remove the text matched by the Prism lookbehind group
    const lookbehindLength = match[1].length;
    match.index += lookbehindLength;
    // @ts-expect-error: indexing
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
  rematch?: { cause: string; reach: number }
): void {
  for (const token in grammar) {
    if (!grammar.hasOwnProperty(token) || !grammar[token]) {
      continue;
    }

    let patterns = grammar[token];
    if (patterns == null) throw new Error();
    patterns = Array.isArray(patterns) ? patterns : [patterns];

    for (let j = 0; j < patterns.length; ++j) {
      if (rematch && rematch.cause === `${token},${j}`) {
        return;
      }

      const patternObj = patterns[j];
      if (patternObj == null) throw new Error();
      // @ts-expect-error: Too dynamic
      const inside = patternObj.inside;
      // @ts-expect-error: Too dynamic
      const lookbehind = !!patternObj.lookbehind;
      // @ts-expect-error: Too dynamic
      const greedy = !!patternObj.greedy;
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
          // @ts-expect-error: indexing
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
        if (matchStr == null) throw new Error();
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
          matchStr
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

const languages: { [language: string]: Record<string, GrammarValue> } = {
  plain: {},
  plaintext: {},
  text: {},
  txt: {},
};

const LanguageUtil = {
  /**
   * Creates a deep copy of the language with the given id and appends the given tokens.
   *
   * If a token in `redef` also appears in the copied language, then the existing token in the copied language
   * will be overwritten at its original position.
   *
   * ## Best practices
   *
   * Since the position of overwriting tokens (token in `redef` that overwrite tokens in the copied language)
   * doesn't matter, they can technically be in any order. However, this can be confusing to others that trying to
   * understand the language definition because, normally, the order of tokens matters in Prism grammars.
   *
   * Therefore, it is encouraged to order overwriting tokens according to the positions of the overwritten tokens.
   * Furthermore, all non-overwriting tokens should be placed after the overwriting ones.
   *
   * @param id The id of the language to extend. This has to be a key in `Prism.languages`.
   * @param redef The new tokens to append.
   * @returns The new language created.
   */
  extend(id: string, redef: Grammar): Grammar {
    const lang = CloneUtil.clone(languages[id]);
    if (lang == null) throw id;
    Object.entries(redef).forEach(([key, value]) => {
      lang[key] = value;
    });
    return lang;
  },

  /**
   * Inserts tokens _before_ another token in a language definition or any other grammar.
   *
   * ## Usage
   *
   * This helper method makes it easy to modify existing languages. For example, the CSS language definition
   * not only defines CSS highlighting for CSS documents, but also needs to define highlighting for CSS embedded
   * in HTML through `<style>` elements. To do this, it needs to modify `Prism.languages.markup` and add the
   * appropriate tokens. However, `Prism.languages.markup` is a regular JavaScript object literal, so if you do
   * this:
   *
   * ```typescript
   * Prism.languages.markup.style = {
   *     // token
   * };
   * ```
   *
   * then the `style` token will be added (and processed) at the end. `insertBefore` allows you to insert tokens
   * before existing tokens. For the CSS example above, you would use it like this:
   *
   * ```typescript
   * Prism.languages.insertBefore('markup', 'cdata', {
   *     'style': {
   *         // token
   *     }
   * });
   * ```
   *
   * ## Special cases
   *
   * If the grammars of `inside` and `insert` have tokens with the same name, the tokens in `inside`'s grammar
   * will be ignored.
   *
   * This behavior can be used to insert tokens after `before`:
   *
   * ```typescript
   * Prism.languages.insertBefore('markup', 'comment', {
   *     'comment': Prism.languages.markup.comment,
   *     // tokens after 'comment'
   * });
   * ```
   *
   * ## Limitations
   *
   * The main problem `insertBefore` has to solve is iteration order. Since ES2015, the iteration order for object
   * properties is guaranteed to be the insertion order (except for integer keys) but some browsers behave
   * differently when keys are deleted and re-inserted. So `insertBefore` can't be implemented by temporarily
   * deleting properties which is necessary to insert at arbitrary positions.
   *
   * To solve this problem, `insertBefore` doesn't actually insert the given tokens into the target object.
   * Instead, it will create a new object and replace all references to the target object with the new one. This
   * can be done without temporarily deleting properties, so the iteration order is well-defined.
   *
   * However, only references that can be reached from `Prism.languages` or `insert` will be replaced. I.e. if
   * you hold the target object in a variable, then the value of the variable will not change.
   *
   * ```typescript
   * var oldMarkup = Prism.languages.markup;
   * var newMarkup = Prism.languages.insertBefore('markup', 'comment', { ... });
   *
   * assert(oldMarkup !== Prism.languages.markup);
   * assert(newMarkup === Prism.languages.markup);
   * ```
   *
   * @param inside The property of `root` (e.g. a language id in `Prism.languages`) that contains the
   * object to be modified.
   * @param before The key to insert before.
   * @param insert An object containing the key-value pairs to be inserted.
   * @param root The object containing `inside`, i.e. the object that contains the
   * object to be modified. Defaults to `Prism.languages`.
   */
  insertBefore(
    inside: string,
    before: string,
    insert: Grammar,
    root: Record<string, any> = languages
  ): Grammar {
    const grammar = root[inside];
    const ret: Grammar = {};

    for (const token in grammar) {
      if (grammar.hasOwnProperty(token)) {
        // eslint-disable-next-line eqeqeq
        if (token == before) {
          for (const newToken in insert) {
            if (insert.hasOwnProperty(newToken)) {
              // @ts-expect-error: Too dynamic
              ret[newToken] = insert[newToken];
            }
          }
        }

        // Do not insert token which also occur in insert. See #1525
        if (!insert.hasOwnProperty(token)) {
          ret[token] = grammar[token];
        }
      }
    }

    const old = root[inside];
    root[inside] = ret;

    // Traverse a language definition with Depth First Search
    // @ts-expect-error: Too dynamic
    function DFS(o, callback, type?: string, visited: Record<number, boolean> = {}) {
      const objId = CloneUtil.objId;

      for (const i in o) {
        if (o.hasOwnProperty(i)) {
          callback.call(o, i, o[i], type || i);

          const property = o[i];
          const propertyType = CloneUtil.type(property);

          if (propertyType === 'Object' && !visited[objId(property)]) {
            visited[objId(property)] = true;
            DFS(property, callback, undefined, visited);
          } else if (propertyType === 'Array' && !visited[objId(property)]) {
            visited[objId(property)] = true;
            DFS(property, callback, i, visited);
          }
        }
      }
    }

    // Update references in other language definitions
    // @ts-expect-error: Too dynamic
    DFS(languages, function (key, value) {
      // eslint-disable-next-line eqeqeq
      if (value === old && key != inside) {
        // @ts-expect-error: Too dynamic
        this[key] = ret;
      }
    });

    return ret;
  },
};

/**
 * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
 * and the language definitions to use, and returns an array with the tokenized code.
 *
 * When the language definition includes nested tokens, the function is called recursively on each of these tokens.
 *
 * This method could be useful in other contexts as well, as a very crude parser.
 *
 * @param {string} text
 * @param {Grammar} grammar An object containing the tokens to use.
 *
 * Usually a language definition like `Prism.languages.markup`.
 * @returns {TokenStream} An array of strings and tokens, a token stream.
 * @memberof Prism
 * @public
 * @example
 * let code = `var foo = 0;`;
 * let tokens = Prism.tokenize(code, Prism.languages.javascript);
 * tokens.forEach(token => {
 *     if (token instanceof Prism.Token && token.type === 'number') {
 *         console.log(`Found numeric literal: ${token.content}`);
 *     }
 * });
 */
function tokenize(text: string, grammar: Grammar): (Token | string)[] {
  const rest = grammar.rest;
  if (rest) {
    // @ts-expect-error: Too dynamic
    // eslint-disable-next-line guard-for-in
    for (const token in rest) grammar[token] = rest[token];

    delete grammar.rest;
  }

  const tokenList = new LinkedList<Token | string>();
  addAfter(tokenList, tokenList.head, text);

  matchGrammar(text, tokenList, grammar, tokenList.head, 0);

  return toArray(tokenList);
}

const Prism = { languages, LanguageUtil, tokenize };
export default Prism;
