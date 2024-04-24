/* eslint-disable @typescript-eslint/no-explicit-any */

import { cell_with_index, game_mode, game_state } from '../main/game_config';
import { win_conditions } from './GameBoard';

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
declare global {
  const AI: ReturnType<typeof AIModule>;
}

export function register_AI() {
  (_G as any).AI = AIModule();
}


function AIModule() {
  const Human_side = 1;
  const AI_side = 2;
  let is_enabled = false;

  function init() {
    is_enabled = false;
  }

  function find_best_move() {
    const turn = GameBoard.get_turn();
    let best_score = -1000;
    let best_move: { y: number; x: number } = { y: -1, x: -1 };
    const board = GameBoard.get_game_board();
    const free_cells = GameBoard.find_free_cells(board);
    free_cells.forEach(({ y, x }) => {
      const move = GameBoard.create_move(y, x, AI_side, board);
      const score = minimax(move, false, turn, 0);
      if (score > best_score) {
        best_score = score;
        best_move = { y, x };
      }
    });
    GameBoard.update_game_board(best_move.x, best_move.y, AI_side);
  }

  function evaluate(win_conditions: win_conditions, depth: number) {
    if (
      win_conditions.has_winner.value === true &&
      win_conditions.has_winner.cells_to_highlight[0].cell === AI_side
    ) {
      return 10 - depth;
    } else if (
      win_conditions.has_winner.value === true &&
      win_conditions.has_winner.cells_to_highlight[0].cell === Human_side
    ) {
      return - 10 + depth;
    } else {
      return 0;
    }
  }

  function minimax(board: game_state, isMaximazing: boolean, turn: number, depth: number): number {
    const result = GameBoard.check_win_conditions(board);
    const score = evaluate(result, depth);
    if (score !== 0) return score;
    if (result.is_draw) return 0;
    const free_cells = GameBoard.find_free_cells(board);

    if (isMaximazing) {
      let best_score = -1000;
      free_cells.forEach(({ x, y }) => {
        const new_board = GameBoard.create_move(y, x, AI_side, board);
        best_score = math.max(
          best_score,
          minimax(new_board, !isMaximazing, turn + 1, depth + 1)
        );
      });
      return best_score;
    } else {
      let best_score = 1000;
      free_cells.forEach(({ x, y }) => {
        const new_board = GameBoard.create_move(y, x, Human_side, board);
        best_score = math.min(
          best_score,
          minimax(new_board, !isMaximazing, turn + 1, depth + 1)
        );
      });
      return best_score;
    }
  }

  function enable() {
    is_enabled = true;
  }

  function disable() {
    is_enabled = false;
  }

  function get_is_enabled() {
    return is_enabled;
  }

  init();

  return { init, enable, disable, get_is_enabled, find_best_move };
}
