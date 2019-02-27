// @flow strict

type GoodProgramResponse = {|
  +type: 'GOOD_PROGRAM';
  +detail: {| +result: string; +prettyPrintedProgram: string |};
|};
type BadSyntaxResponse = {|
  +type: 'BAD_SYNTAX';
  +detail: string;
|};
type BadTypeResponse = {|
  +type: 'BAD_TYPE';
  +detail: string;
|};
export type Response = GoodProgramResponse | BadSyntaxResponse | BadTypeResponse;

/**
 * Interpret the program.
 *
 * @param {string} program program code string.
 * @return {Response} the server response.
 */
export default async function interpret(program: string): Promise<Response> {
  const rawResp = await fetch('/api/respond', { method: 'POST', body: program });
  return rawResp.json();
}
