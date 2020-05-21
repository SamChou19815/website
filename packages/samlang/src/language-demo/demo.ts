/**
 * Copyright (c) 2019-present, Developer Sam.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import runDemo from '@dev-sam/samlang-demo';

const initialText = `/* Start to type your program */
// Add your comments!
// Press enter to add a new line.

class Main {
  function main(): string = "Hello World!"
}
`;

export type Response = ReturnType<typeof runDemo>;
export { initialText, runDemo };
