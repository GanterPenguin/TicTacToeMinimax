/* eslint-disable @typescript-eslint/no-empty-interface */

import { cell_state, cell_with_index, game_mode, game_state, player_number, player_string } from '../main/game_config';

interface props {
    game_mode: game_mode
}

export function init(this: props) {
    Manager.init_script();
    GameBoard.init();
    this.game_mode = AI.get_is_enabled() ? 'AI' : 'player';
}


export function final(this: props) {
    Manager.final_script();
}

