/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { MessageId, Messages, VoidCallback, _SystemMessages, _ID_MESSAGES } from "./modules_const";
import { ID_YANDEX_METRICA, _UserMessages } from "../main/game_config";
import { register_system } from "./System";
import { register_log } from "./Log";
import { register_event_bus } from "./EventBus";
import { register_storage } from "./Storage";
import { register_game_storage } from "./GameStorage";
import { register_sound } from "./Sound";
import { register_lang } from "./Lang";
import { register_scene } from "./Scene";
import { register_ads } from "./Ads";
import { register_rate } from "./Rate";
import { register_metrica } from "./Metrica";
import { register_camera } from "./Camera";
import { register_html_bridge } from './HtmlBridge';
import { register_AI } from './AI';
import { register_game_board } from './GameBoard';



/*
    Основной модуль для подгрузки остальных, доступен по объекту Manager
    также глобально доступна функция to_hash которая ограничит список доступных для отправки сообщений
    при проверке в on_message, например  if (message_id == to_hash('MANAGER_READY'))
*/

declare global {
    const Manager: ReturnType<typeof ManagerModule>;
    const to_hash: typeof _to_hash;
    type UserMessages = _UserMessages;
    type SystemMessages = _SystemMessages;
    const ID_MESSAGES: typeof _ID_MESSAGES;
}

function _to_hash<T extends MessageId>(key: T) {
    return hash(key);
}

export function register_manager() {
    (_G as any).Manager = ManagerModule();
    (_G as any).to_hash = _to_hash;
    (_G as any).ID_MESSAGES = _ID_MESSAGES;
}


function ManagerModule() {
    let _is_ready = false;

    function init(callback_ready?: VoidCallback, use_custom_storage_key = false) {
        math.randomseed(socket.gettime());
        register_system();
        register_log();
        register_storage(use_custom_storage_key);
        register_game_storage();
        register_event_bus();
        if (System.platform == 'HTML5') {
            register_html_bridge();
            HtmlBridge.init(() => register_modules(callback_ready));
        }
        else
            register_modules(callback_ready);
    }

    function register_modules(callback_ready?: VoidCallback) {
        register_metrica();
        register_sound();
        register_lang();
        register_scene();
        register_camera();
        register_ads();
        register_rate();
        register_AI();
        register_game_board();
        Metrica.init(ID_YANDEX_METRICA);
        check_ready(callback_ready);
    }


    function check_ready(callback_ready?: VoidCallback) {
        const id_timer = timer.delay(0.1, true, () => {
            // список модулей с ожиданием готовности
            if (Ads.is_ready()) {
                timer.cancel(id_timer);
                _is_ready = true;
                log('All Managers ready ver: ' + sys.get_config("project.version"));
                msg.post('main:/rate#rate', 'MANAGER_READY');
                if (callback_ready)
                    callback_ready();
            }
        });
    }

    function is_ready() {
        return _is_ready;
    }

    function on_message(_this: any, message_id: hash, message: any, sender: hash) {
        Scene._on_message(_this, message_id, message, sender);
    }

    // можно вызывать в каждом init всех gui/go чтобы применялись языки например
    function init_script() {
        Lang.apply();
        EventBus.on('ON_APPLY_CUSTOM_LANG', () => Lang.apply());
    }

    function final_script() {
        EventBus.off_all_current_script();
    }


    return { init, on_message, is_ready, init_script, final_script };
}


