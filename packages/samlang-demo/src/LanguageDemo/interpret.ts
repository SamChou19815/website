type GoodProgramResponse = {
  readonly type: 'GOOD_PROGRAM';
  readonly detail: {
    readonly result: string;
    readonly prettyPrintedProgram: string;
  };
};

type BadSyntaxResponse = {
  readonly type: 'BAD_SYNTAX';
  readonly detail: string;
};

type BadTypeResponse = {
  readonly type: 'BAD_TYPE';
  readonly detail: string;
};
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
