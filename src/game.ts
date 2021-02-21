import { GAME_LEVELS, ILevel } from "./constants/levels";
import { Grid } from "./grid";
import { Ui } from "./ui/ui";
import Engine from "./engine";
import { Enemy } from "./enemies/enemy";
import { _canvas, C } from "./canvas";

export class Game {
  grid = null;
  levelIndex: number = 0;
  interval = null;

  constructor() {
    this.start();
  }

  start() {
    const level = GAME_LEVELS[this.levelIndex];

    Ui.restore();

    this.grid = new Grid(this, level);
    this.listen();

    this.startEnemies(level);
    this.startEngine();
  }

  startEnemies(level: ILevel) {
    if (level.enemies.length) {
      for (let i = 0; i < level.enemies.length; i++) {
        const enemy = level.enemies[i];
        enemy.id = i + 1;
        enemy.onDamaging.subscribe((v) => Ui.damage(v));
        enemy.onKilling.subscribe(() => {
          Engine.remove(enemy._moving);
          Ui.addGold(10);
        });

        setTimeout(() => Engine.add(enemy._moving), 200 * i);
      }
    }

    this.interval = setInterval(() => {
      if (level.enemies.every((e) => e.isEnded)) {
        Engine.restore();
        clearInterval(this.interval);

        if (this.levelIndex >= GAME_LEVELS.length - 1) {
          console.log(this.levelIndex, GAME_LEVELS);
          this.levelIndex = 0;
          alert("КОНГРАТУЛЕЙШН РЕТРАЙ???");
          return;
        }

        this.levelIndex++;
        alert("YOU ARE COOL WATAFAKA MAZAFAKA NEXT LEVEL???");
        this.start();
      }
    }, 1000);
  }

  startEngine() {
    Engine.add(this.grid._render);
    Engine.add(Ui._render);
    Engine.start();
  }

  private listen() {
    _canvas.addEventListener("click", this.grid._listenCellClick);
  }
}
