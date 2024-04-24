/* eslint-disable @typescript-eslint/no-explicit-any */

import { cell_state, cell_with_index, game_state, player_number } from '../main/game_config';

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
declare global {
  const GameBoard: ReturnType<typeof GameBoardModule>;
}

export function register_game_board() {
  (_G as any).GameBoard = GameBoardModule();
}

export type win_conditions = {
  has_winner: {
    value: boolean;
    cells_to_highlight: cell_with_index[];
  };
  is_draw: boolean;
  is_game_over: boolean;
};


function GameBoardModule() {
  let board_size: number;
  let game_state: game_state = [];
  // let free_cells: cell_with_index[] = [];
  let current_player: player_number = 1;
  let _turn: number;

  function init() {
    current_player = 1;
    board_size = 3;
    _turn = 0;
    game_state = [];
    create_empty_board();
    bind_messsages();
  }

  function create_empty_board() {
    for (let y = 0; y < board_size; y++) {
      game_state[y] = [];
      for (let x = 0; x < board_size; x++) {
        game_state[y][x] = 0;
      }
    }
  }

  function get_turn() {
    return _turn;
  }

  function get_game_board() {
    return game_state;
  }

  function create_move(y: number, x: number, value: cell_state, board: game_state): game_state {
    const new_board: game_state = [];
    for (let y = 0; y < board_size; y++) {
      new_board[y] = [];
      for (let x = 0; x < board_size; x++) {
        new_board[y][x] = board[y][x];
      }
    }
    new_board[y][x] = value;
    return new_board;
  }

  function find_free_cells(game_board: game_state): cell_with_index[] {
    const result = [];
    for (let y = 0; y < game_board.length; y++) {
      for (let x = 0; x < game_board.length; x++) {
        if (game_board[y][x] === 0) result.push({ y, x, cell: 0 as cell_state });
      }
    }
    return result;
  }

  function get_current_player() {
    return current_player;
  }

  function get_player_string(value: player_number | cell_state) {
    const dict = {
      0: '',
      1: 'x',
      2: 'o',
    };
    return dict[value];
  }

  function get_rows(board: game_state): cell_with_index[][] {
    return board.map((row, y) => row.map((cell, x) => ({ x, y, cell: cell })));
  }

  function get_columns(board: game_state): cell_with_index[][] {
    const columns = [];
    for (let x = 0; x < board_size; x++) {
      columns.push(board.map((row, y) => ({ cell: row[x], x, y })));
    }
    return columns;
  }

  function get_diagonals(board: game_state): cell_with_index[][] {
    const diagonal = [];
    const counter_diagonal = [];

    for (let i = 0; i < board.length; i++) {
      diagonal.push({ x: i, y: i, cell: board[i][i] });
      counter_diagonal.push({ x: board.length - i - 1, y: i, cell: board[i][board.length - i - 1] });
    }
    return [diagonal, counter_diagonal];
  }

  function check_win_conditions(board: game_state) {
    const rows = get_rows(board);
    const columns = get_columns(board);
    const diagonals = get_diagonals(board);

    const lines = rows.concat(columns, diagonals);
    const result = lines.filter(line => {
      return line.every(cell => cell.cell !== 0 && cell.cell === line[0].cell);
    });

    const has_winner = {
      value: result.length !== 0,
      cells_to_highlight: result[0],
    };
    const is_draw = result.length === 0 && find_free_cells(board).length === 0;

    return {
      has_winner,
      is_draw,
      is_game_over: has_winner.value || is_draw,
    };
  }

  function update_game_board(x: number, y: number, value: cell_state) {
    game_state[y][x] = value;
    const win = check_win_conditions(game_state);
    EventBus.send('DRAW_TURN', { x, y, value });
    if (win.is_draw) {
      EventBus.send('GAME_OVER', { tie: true });
      return;
    } else if (win.has_winner.value) {
      EventBus.send('HIGHLIGHT_CELLS', { cells: win.has_winner.cells_to_highlight });
      EventBus.send('GAME_OVER', { winner: <player_number>win.has_winner.cells_to_highlight[0].cell });
      return;
    }
    _turn++;
    current_player = current_player === 1 ? 2 : 1;
    if (AI.get_is_enabled() && current_player === 2) AI.find_best_move();
  }

  function bind_messsages() {
    return;
  }

  init();

  return { init, get_game_board, update_game_board, get_current_player, get_player_string, check_win_conditions, get_turn, find_free_cells, create_move };
}
