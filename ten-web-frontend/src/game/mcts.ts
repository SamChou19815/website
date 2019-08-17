import { Board, Move, allLegalMovesForAI, getGameStatus, makeMoveWithoutCheck } from './board';

type Node = {
  readonly parent: Node | null;
  readonly move: Move;
  readonly board: Board;
  readonly children: Node[];
  winningProbNum: number;
  winningProbDen: number;
};

const timeLimit = 1500;

/**
 * Returns the winning probability association with a node.
 *
 * @param {Node} node the node of interest.
 * @return {number} the winning probability.
 */
function getWinningProb(node: Node): number {
  const { winningProbNum, winningProbDen } = node;
  return winningProbNum / winningProbDen;
}

/**
 * Returns the upper confidence bound.
 *
 * @param {Node} node the node of interest.
 * @param {boolean} isPlayer whether it's for or against the player.
 * @param {Node} parent the required parent node.
 * @return {number} the upper confidence bound.
 */
function getUpperConfidenceBound(node: Node, isPlayer: boolean, parent: Node): number {
  let winningProb = getWinningProb(node);
  if (!isPlayer) {
    winningProb = 1 - winningProb;
  }
  return winningProb + Math.sqrt((2.0 * Math.log(parent.winningProbDen)) / node.winningProbDen);
}

/**
 * Select the best node for further exploration.
 *
 * @param {Node} root the root node.
 * @return {Node} the selected node.
 */
function select(root: Node): Node {
  let node = root;
  let isPlayer = true;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { children } = node;
    const len = children.length;
    if (len === 0) {
      break;
    }
    let bestNode = children[0];
    let bestUCB = getUpperConfidenceBound(bestNode, isPlayer, node);
    for (let i = 1; i < len; i += 1) {
      const n = children[i];
      const ucb = getUpperConfidenceBound(n, isPlayer, node);
      if (ucb > bestUCB) {
        bestNode = n;
        bestUCB = ucb;
      }
    }
    node = bestNode;
    isPlayer = !isPlayer;
  }
  return node;
}

/**
 * Run a simulation and returns the result.
 *
 * @param {Board} board the board to run the simulation.
 * @return {number} the simulation result, which is the final game status.
 */
function simulation(board: Board): number {
  let b = board;
  let status = getGameStatus(b);
  while (status === 0) {
    const moves = allLegalMovesForAI(b);
    const move = moves[Math.floor(Math.random() * moves.length)];
    b = makeMoveWithoutCheck(b, move);
    status = getGameStatus(b);
  }
  return status;
}

/**
 * Think until the end of the time limit.
 * It should update directly on the root node.
 *
 * @param {Node} root the root node to think on.
 * @param {number} playerIdentity the player identity.
 * @return {number} the number of simulations performs.
 */
function think(root: Node, playerIdentity: 1 | -1): number {
  const t1 = Date.now();
  let simCounter = 0;
  while (Date.now() - t1 < timeLimit) {
    const selectedNode = select(root);
    const { board, children } = selectedNode;
    const allLegalMoves = allLegalMovesForAI(board);
    let len = allLegalMoves.length;
    let winCount = 0;
    if (len === 0) {
      winCount = playerIdentity === getGameStatus(board) ? 1 : 0;
      len = 1;
    } else {
      for (let i = 0; i < len; i += 1) {
        const move = allLegalMoves[i];
        const newBoard = makeMoveWithoutCheck(board, move);
        const playerWins = playerIdentity === simulation(newBoard);
        if (playerWins) {
          winCount += 1;
        }
        const childNode = {
          parent: selectedNode,
          move,
          board: newBoard,
          children: [],
          winningProbNum: playerWins ? 1 : 0,
          winningProbDen: 1,
        };
        children.push(childNode);
      }
    }
    let n: Node | null = selectedNode;
    while (n !== null) {
      n.winningProbNum += winCount;
      n.winningProbDen += len;
      n = n.parent;
    }
    simCounter += len;
  }
  return simCounter;
}

export type MctsResponse = {
  readonly move: Move;
  readonly winningPercentage: number;
  readonly simulationCounter: number;
};

/**
 * Select the best move.
 *
 * @param {Board} board the board to run the simulation on.
 * @return {[Move, number, number]} the move chosen, winning percentage, and simulation counter.
 */
export default function selectMove(board: Board): MctsResponse {
  const root: Node = {
    parent: null,
    move: [-1, -1],
    board,
    children: [],
    winningProbNum: 0,
    winningProbDen: 0,
  };
  const { playerIdentity } = board;
  const simulationCounter = think(root, playerIdentity);
  const { children } = root;
  let bestNode = children[0];
  let bestProb = getWinningProb(bestNode);
  for (let i = 1; i < children.length; i += 1) {
    const currentNode = children[i];
    const prob = getWinningProb(currentNode);
    if (prob > bestProb) {
      bestNode = currentNode;
      bestProb = prob;
    }
  }
  const { move, winningProbNum, winningProbDen } = bestNode;
  const winningPercentage = Math.floor((winningProbNum * 100) / winningProbDen);
  return { move, winningPercentage, simulationCounter };
}
