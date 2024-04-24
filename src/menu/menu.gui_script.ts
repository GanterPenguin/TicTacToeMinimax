/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as druid from 'druid.druid';
import * as checkbox from 'druid.extended.checkbox';
import { ADS_CONFIG } from '../main/game_config';
import { show_gui_list, hide_gui_list, set_text } from '../utils/utils';

interface props {
    druid: DruidClass;
}


export function init(this: props): void {
    Manager.init_script();
    this.druid = druid.new(this);

    this.druid.new_button('btnPlay', () => {
        Scene.load('game');
        AI.disable();
    });
    this.druid.new_button('btnPlayVsAI', () => {
        Scene.load('game');
        AI.enable();
    });

    if (System.platform != 'HTML5')
        this.druid.new_button('btnExit', () => sys.exit(0));
    else
        hide_gui_list(['btnExit']);
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
