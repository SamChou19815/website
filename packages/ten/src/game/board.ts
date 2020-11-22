export type Move = readonly [number, number];

export type Board = {
  /**
   * In variable names, a big square refers to a 3*3 square;
   * a tile refers to a 1*1 square.
   */
  readonly tiles: number[];
  /**
   * Keep track of winning progress on big squares.
   * 1 ==> BLACK_WINS
   * -1 ==> WHITE_WINS
   * 0 ==> INCONCLUSIVE
   * -2 ==> ALL_OCCUPIED
   */
  readonly bigSquareStatusArray: number[];
  /**
   * The current legal big square to pick as next move. If it's value is -1,
   * that means the user can place the move everywhere.
   * This variable is important for maintaining the current game state.
   */
  readonly bigSquareToPick: number;
  /**
   * Counter of big squares occupied by black or white.
   */
  readonly winningCounter: [number, number];
  /**
   * The identity of the current player. Either 1 or -1.
   */
  readonly playerIdentity: 1 | -1;
};

/**
 * An universal empty board.
 * @type {Board}
 */
export const emptyBoard: Board = {
  tiles: Array(81).fill(0),
  bigSquareStatusArray: Array(9).fill(0),
  bigSquareToPick: -1,
  winningCounter: [0, 0],
  playerIdentity: 1,
};

/**
 * Check whether a move is legal.
 *
 * @param {Board} board the board as context.
 * @param {Move} move the move to check.
 * @return {boolean} whether a move is legal.
 */
function isLegalMove(board: Board, move: Move): boolean {
  const [a, b] = move;
  if (a < 0 || a > 8 || b < 0 || b > 8) {
    return false; // Out of boundary values
  }
  const { bigSquareToPick } = board;
  if (bigSquareToPick !== -1 && bigSquareToPick !== a) {
    return false; // in the wrong big square when it cannot have a free move
  }
  /* Not in the occupied big square and on an empty tile */
  const { tiles, bigSquareStatusArray } = board;
  return bigSquareStatusArray[a] === 0 && tiles[a * 9 + b] === 0;
}

/**
 * Returns a list of all legal moves for AI.
 *
 * @param {Board} board the board as context.
 * @return {Move[]} a list of moves.
 */
export function allLegalMovesForAI(board: Board): Move[] {
  const { bigSquareToPick } = board;
  const list = [];
  if (bigSquareToPick === -1) {
    for (let i = 0; i < 9; i += 1) {
      for (let j = 0; j < 9; j += 1) {
        const move: Move = [i, j];
        if (isLegalMove(board, move)) {
          list.push(move);
        }
      }
    }
  } else {
    for (let j = 0; j < 9; j += 1) {
      const move: Move = [bigSquareToPick, j];
      if (isLegalMove(board, move)) {
        list.push(move);
      }
    }
  }
  return list;
}

/**
 * Perform a naive check on the square about whether the player with given identity win the square.
 * It only checks according to the primitive tic-tac-toe rule.
 *
 * @param {number[]} s the square array.
 * @param {number} offset offset of the square array.
 * @param {number} id the player identity.
 * @return {boolean} whether the player wins the square.
 */
function playerSimplyWinSquare(s: number[], offset: number, id: 1 | -1): boolean {
  return (
    (s[offset] === id && s[offset + 1] === id && s[offset + 2] === id) ||
    (s[offset + 3] === id && s[offset + 4] === id && s[offset + 5] === id) ||
    (s[offset + 6] === id && s[offset + 7] === id && s[offset + 8] === id) ||
    (s[offset] === id && s[offset + 3] === id && s[offset + 6] === id) ||
    (s[offset + 1] === id && s[offset + 4] === id && s[offset + 7] === id) ||
    (s[offset + 2] === id && s[offset + 5] === id && s[offset + 8] === id) ||
    (s[offset] === id && s[offset + 4] === id && s[offset + 8] === id) ||
    (s[offset + 2] === id && s[offset + 4] === id && s[offset + 6] === id)
  );
}

/**
 * Compute the big square status for ONE big square of id.
 *
 * @param {number[]} s the square array.
 * @param {number} offset offset of the square array.
 * @return {number} the status of the big square.
 */
function computeBigSquareStatus(s: number[], offset: number): 1 | -1 | 0 | -2 {
  if (playerSimplyWinSquare(s, offset, 1)) {
    return 1;
  }
  if (playerSimplyWinSquare(s, offset, -1)) {
    return -1;
  }
  const allOccupied =
    s[offset] !== 0 &&
    s[offset + 1] !== 0 &&
    s[offset + 2] !== 0 &&
    s[offset + 3] !== 0 &&
    s[offset + 4] !== 0 &&
    s[offset + 5] !== 0 &&
    s[offset + 6] !== 0 &&
    s[offset + 7] !== 0 &&
    s[offset + 8] !== 0;
  return allOccupied ? -2 : 0;
}

/**
 * Make a move without any check, which can accelerate AI simulation.
 * It should also switch the identity of the current player.
 *
 * Requires:
 * - [move] is a valid int array representation of a move in the game.
 *
 * @param {Board} board the board before the move.
 * @param {Move} move the move to perform.
 * @return {Board} the board after the move.
 */
export function makeMoveWithoutCheck(board: Board, move: Move): Board {
  const {
    tiles: oldTiles,
    bigSquareStatusArray: oldBigSquareStatusArray,
    winningCounter: oldWinningCounter,
    playerIdentity: oldPlayerIdentity,
  } = board;
  const tiles = [...oldTiles];
  const [a, b] = move;
  tiles[a * 9 + b] = oldPlayerIdentity;
  const newBigSquareStatus = computeBigSquareStatus(tiles, a * 9);
  if (newBigSquareStatus === 1 || newBigSquareStatus === -1) {
    for (let i = 0; i < 9; i += 1) {
      tiles[a * 9 + i] = newBigSquareStatus;
    }
  }
  const bigSquareStatusArray = [...oldBigSquareStatusArray];
  bigSquareStatusArray[a] = newBigSquareStatus;
  const bigSquareToPick = bigSquareStatusArray[b] === 0 ? b : -1;
  let [blackCounter, whiteCounter] = oldWinningCounter;
  if (newBigSquareStatus === 1) {
    blackCounter += 1;
  } else if (newBigSquareStatus === -1) {
    whiteCounter += 1;
  }
  const winningCounter: [number, number] = [blackCounter, whiteCounter];
  const playerIdentity = -oldPlayerIdentity as 1 | -1;
  return {
    tiles,
    bigSquareStatusArray,
    bigSquareToPick,
    winningCounter,
    playerIdentity,
  };
}

/**
 * Make a move with legality check and tells whether the move is legal.
 *
 * @param {Board} board the board before the move.
 * @param {Move} move the move to perform.
 * @return {Board | null} the board after the move, or null if the move is illegal.
 */
export function makeMove(board: Board, move: Move): Board | null {
  return isLegalMove(board, move) ? makeMoveWithoutCheck(board, move) : null;
}

/**
 * Compute the game status.
 *
 * @param {Board} board the board as the context.
 * @return {number} the game status.
 */
export function getGameStatus(board: Board): 1 | -1 | 0 {
  const status = computeBigSquareStatus(board.bigSquareStatusArray, 0);
  if (status === -2) {
    const [b, w] = board.winningCounter;
    return b > w ? 1 : -1;
  }
  // $FlowFixMe: incomplete flow type refinement behavior.
  return status;
}

/**
 * Convert the board to a json for server communication.
 */
export function boardToJson(board: Board): unknown {
  const { tiles, bigSquareToPick, playerIdentity } = board;
  return { tiles, bigSquareToPick, playerIdentity };
}
