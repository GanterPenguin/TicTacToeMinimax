/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as druid from 'druid.druid';
import { cell_state, player_number, player_string } from '../main/game_config';
import { hex2rgba } from '../utils/utils';

interface props {
    druid: DruidClass;
}

interface Cell {
    node: node;
    x: number;
    y: number;
    disabled: boolean;
    is_winner: boolean;
}

const created_cells: Cell[][] = [];
// let current_player: player_number = 1;
let game_over = false;

function create_cells(_this: props) {
    const board_size = 3;
    const board = gui.get_node('board');
    const size = vmath.vector3(145, 145, 0);
    const step = 153;
    const position = vmath.vector3(-153, 153, 0);
    const gap = 8;
    for (let y = 0; y < board_size; y++) {
        position.x = -153;
        created_cells.push([]);
        for (let x = 0; x < board_size; x++) {
            const cell = gui.new_box_node(position, size);
            created_cells[y].push({ node: cell, x, y, disabled: false, is_winner: false });
            gui.set_parent(cell, board, false);
            gui.set_layer(cell, 'gameplay');
            position.x = position.x + step;
            bind_cell_hover_click(_this, cell, x, y);
        }
        position.y = position.y - 153;
    }
}

function draw_turn(x: number, y: number, value: cell_state) {
    const cell_node = created_cells[y][x].node;
    gui.set_texture(cell_node, 'game');
    gui.play_flipbook(cell_node, GameBoard.get_player_string(value));
    created_cells[y][x].disabled = true;
}

function bind_cell_hover_click(_this: props, node: any, x: number, y: number) {
    const btn = _this.druid.new_button(node, () => {
        if (game_over) return;
        if (AI.get_is_enabled() && GameBoard.get_current_player() === 2) return;
        if (created_cells[y][x].disabled) return;
        GameBoard.update_game_board(x, y, GameBoard.get_current_player());
        created_cells[y][x].disabled = true;
    });

    btn.style.on_mouse_hover = (_, node, state) => {
        if (game_over) return;
        if (node === undefined) return;
        if (state) gui.set_color(node, hex2rgba('#e6e64d'));
        else if (created_cells[y][x].is_winner) gui.set_color(node, hex2rgba('#F00'));
        else gui.set_color(node, hex2rgba('#fff'));
    };
}

export function init(this: props): void {
    Manager.init_script();
    this.druid = druid.new(this);
    this.druid.new_button('btnHome', () => Scene.load('menu'));
    create_cells(this);

    EventBus.on('DRAW_TURN', ({ x, y, value }) => {
        draw_turn(x, y, value);
    });
    EventBus.on('HIGHLIGHT_CELLS', (state) => {
        state.cells.forEach(({ x, y }) => {
            gui.set_color(created_cells[y][x].node, hex2rgba('#F00'));
            created_cells[y][x].is_winner = true;
        });
    });
    EventBus.on('GAME_OVER', () => {
        game_over = true;
    });
}

export function on_input(this: props, action_id: string | hash, action: unknown) {
    return this.druid.on_input(action_id, action);
}

export function update(this: props, dt: number): void {
    this.druid.update(dt);
}

export function on_message(this: props, message_id: string | hash, message: any, sender: string | hash | url): void {
    this.druid.on_message(message_id, message, sender);
}

export function final(this: props): void {
    Manager.final_script();
    this.druid.final();
}
