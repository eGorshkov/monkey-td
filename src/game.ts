import { GAME_LEVELS, ILevel } from "./constants/levels";
import { Grid } from "./grid";
import { Ui } from "./ui";
import Engine from "./engine";
import { Enemy } from "./enemies/enemy";
import {_canvas, C} from "./canvas";

export class Game {
  ui = new Ui();
  grid = null;

  constructor(level?: ILevel) {
    this.start(level || GAME_LEVELS[0]);
  }

  start(level: ILevel) {
    this.grid = new Grid(this, level);

    this.listen();

    this.startEnemies(level.enemies);
    this.startEngine();
  }

  startEnemies(enemies: Enemy[]) {
    if (enemies.length) {
      for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        enemy.id = i + 1;
        enemy.onDamaging.subscribe((v) => this.ui.damage(v));
        enemy.onKilling.subscribe(() => {
          Engine.remove(enemy._moving);
          this.ui.addGold(10);
        });

        setTimeout(() => Engine.add(enemy._moving), 200 * i);
      }
    }
  }

  startEngine() {
    Engine.add(this.grid._render);
    Engine.add(this.ui._render);
    Engine.start();
  }

  private listen() {
    _canvas.addEventListener("click", this.grid._listenCellClick);
  }
}
