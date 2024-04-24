/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as druid from 'druid.druid';

interface props {
  druid: DruidClass;
}

export function init(this: props): void {
  gui.set_render_order(10);
  Lang.apply();
  Manager.init_script();
  this.druid = druid.new(this);
  this.druid.new_button('to_menu', () => Scene.load('menu'));
  this.druid.new_button('play_again', () => Scene.restart());
  this.druid.new_button('dev_toggle', () => {
    const winner_window = gui.get_node('winner_window');
    gui.set_enabled(winner_window, false);
  });

  EventBus.on('GAME_OVER', ({ winner, tie }) => {
    gui.set_render_order(10);
    const winner_window = gui.get_node('winner_window');
    const winner_text_node = gui.get_node('winner_text');
    const winner_text = Lang.get_text('winner_text');
    gui.set_text(winner_text_node, (winner === 1 ? 'X' : 'O') + ' ' + winner_text);
    if (tie) {
      gui.set_enabled(winner_text_node, false);
      const tie_text_node = gui.get_node('tie_text');
      gui.set_enabled(tie_text_node, true);
    }
    gui.set_enabled(winner_window, true);
  });
}

export function on_input(this: props, action_id: string | hash, action: unknown) {
  return this.druid.on_input(action_id, action);
}

export function update(this: props, dt: number): void {
  this.druid.update(dt);
}

export function on_message(this: props, message_id: string | hash, message: any, sender: string | hash | url): void {
  EventBus.on('ON_APPLY_CUSTOM_LANG', () => Lang.apply());
  this.druid.on_message(message_id, message, sender);
}

export function final(this: props): void {
  Manager.final_script();
  this.druid.final();
}
