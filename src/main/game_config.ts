/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const IS_DEBUG_MODE = false;
export const IS_HUAWEI = sys.get_sys_info().system_name == 'Android' && sys.get_config("android.package").includes('huawei');

// параметры инициализации для ADS
export const ADS_CONFIG = {
    is_mediation: sys.get_sys_info().system_name == 'Android' || sys.get_sys_info().system_name == 'iPhone OS',
    id_banners: sys.get_sys_info().system_name == 'Android' ? [IS_HUAWEI ? 'R-M-6407344-1' : 'R-M-6407238-1'] : ['R-M-6406678-1'],
    id_inters: sys.get_sys_info().system_name == 'Android' ? [IS_HUAWEI ? 'R-M-6407344-2' : 'R-M-6407238-2'] : ['R-M-6406678-2'],
    id_reward: [],
    banner_on_init: false,
    ads_interval: 3 * 60,
    ads_delay: 30,
};

// для вк
export const VK_SHARE_URL = 'https://vk.com/app51867396';
export const OK_SHARE_TEXT = '';
// для андроида метрика
export const ID_YANDEX_METRICA = sys.get_sys_info().system_name == 'Android' ? "c1ce595b-7bf8-4b99-b487-0457f8da7b95" : "91a2fd82-b0de-4fb2-b3a7-03bff14b9d09";
// через сколько показать первое окно оценки
export const RATE_FIRST_SHOW = 24 * 60 * 60;
// через сколько второй раз показать
export const RATE_SECOND_SHOW = 3 * 24 * 60 * 60;

// игровой конфиг (сюда не пишем/не читаем если предполагается сохранение после выхода из игры)
// все обращения через глобальную переменную GAME_CONFIG
export const _GAME_CONFIG = {

};

// конфиг с хранилищем  (отсюда не читаем/не пишем, все запрашивается/меняется через GameStorage)
export const _STORAGE_CONFIG = {

};


// пользовательские сообщения под конкретный проект, доступны типы через глобальную тип-переменную UserMessages
export type game_mode = 'player' | 'AI';
export type cell_state = 0 | 1 | 2;
export type game_state = cell_state[][];
export type player_string = 'X' | 'O';
export type player_number = 1 | 2;
export type cell_with_index = {
    x: number
    y: number
    cell: cell_state
};

export type _UserMessages = {
    SET_GAME_MODE: { mode: game_mode },
    NEXT_TURN: { x: number, y: number, value: cell_state },
    DRAW_TURN: { x: number, y: number, value: cell_state },
    HIGHLIGHT_CELLS: { cells: { x: number, y: number }[] },
    SET_CURRENT_PLAYER: { player: player_number },
    RESTART_GAME: { mode: game_mode },
    GAME_OVER: { winner?: player_number, tie?: boolean },
    SET_AI_BOARD: { game_state: game_state, free_cells: cell_with_index[], board_size: number }
    UPDATE_AI_BOARD: { x: number, y: number, value: cell_state, free_cell_to_delete: number }
};
