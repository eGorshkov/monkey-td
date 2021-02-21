import { Enemy, EnemyType, Move, Position } from "./enemies/enemy";
import { CELL_LENGTH } from "./constants/common";
import { BiggerEnemy } from "./enemies/bigger-enemy";
import { FasterEnemy } from "./enemies/faster-enemy";

type IEnemyConfig = { type?: EnemyType; count?: number };

const EnemyClass: { [k in EnemyType]: any } = {
  default: Enemy,
  bigger: BiggerEnemy,
  faster: FasterEnemy,
};

export class Level {
  matrix = null;
  spawn = null;
  end = null;
  path = null;
  enemies: Enemy[] = [];
  constructor(matrix, spawn, end, enemiesConfig: IEnemyConfig[]) {
    this.matrix = matrix;
    this.spawn = spawn;
    this.end = end;
    this.path = this.createPath(spawn, end);
    this.createEnemies(enemiesConfig);
  }

  _isUp(position: Position, prevPosition: Position): boolean {
    return Boolean(
      position.y - 1 >= 0 &&
        position.x !== prevPosition.x &&
        !!this.matrix[position.y - 1][position.x]
    );
  }

  _toUp(arr: Move[], x: number, y: number): [Move[], Position] {
    while (y - 1 >= 0 && this.matrix[y - 1][x]) {
      y--;
    }
    arr.push({ to: "up", value: y });
    return [arr, { x, y }];
  }

  _isBottom(position: Position, prevPosition: Position): boolean {
    return Boolean(
      position.y + 1 < CELL_LENGTH &&
        position.x !== prevPosition.x &&
        !!this.matrix[position.y + 1][position.x]
    );
  }

  _toBottom(arr: Move[], x: number, y: number): [Move[], Position] {
    console.log("to bottom");
    while (y + 1 < CELL_LENGTH && this.matrix[y + 1][x]) {
      y++;
    }
    arr.push({ to: "bottom", value: y });
    return [arr, { x, y }];
  }

  _isRight(position: Position, prevPosition: Position): boolean {
    return Boolean(
      position.x + 1 < CELL_LENGTH &&
        position.y !== prevPosition.y &&
        !!this.matrix[position.y][position.x + 1]
    );
  }

  _toRight(arr: Move[], x: number, y: number): [Move[], Position] {
    while (x + 1 < CELL_LENGTH && this.matrix[y][x + 1]) {
      x++;
    }
    arr.push({ to: "right", value: x });
    return [arr, { x, y }];
  }

  _isLeft(position: Position, prevPosition: Position): boolean {
    return Boolean(
      position.x - 1 < CELL_LENGTH &&
        position.y !== prevPosition.y &&
        !!this.matrix[position.y][position.x - 1]
    );
  }

  _toLeft(arr: Move[], x: number, y: number): [Move[], Position] {
    while (x - 1 >= 0 && this.matrix[y][x - 1]) {
      x--;
    }
    arr.push({ to: "left", value: x });
    return [arr, { x, y }];
  }

  createPath(position: Position, end: Position): Move[] {
    let arr: Move[] = [];
    let newPosition = { x: -1, y: -1 };
    let prevPosition = { x: -1, y: -1 };

    while (position.y !== end.y || position.x !== end.x) {
      const { x, y } = position;

      switch (true) {
        case this._isBottom(position, prevPosition):
          [arr, newPosition] = this._toBottom(arr, x, y);
          break;
        case this._isRight(position, prevPosition):
          [arr, newPosition] = this._toRight(arr, x, y);
          break;
        case this._isUp(position, prevPosition):
          [arr, newPosition] = this._toUp(arr, x, y);
          break;
        case this._isLeft(position, prevPosition):
          [arr, newPosition] = this._toLeft(arr, x, y);
          break;
        default:
          console.log(arr, prevPosition, position);
          alert("ОШИБКА ОШИБКА ПРИ СОДАНИИ ПУТИ !!!111 АДИН АДЫН");
          return;
      }
      prevPosition = { ...position };
      position = { ...newPosition };
    }

    return arr;
  }

  createEnemies(enemiesConfig: IEnemyConfig[]) {
    for (const config of enemiesConfig) {
      this.enemies = [
        ...this.enemies,
        ...this.create(
          this.spawn,
          this.path,
          config.count || 1,
          config.type || "default"
        ),
      ];
    }
  }

  private create(
    spawn: Position,
    path: Move[],
    count = 1,
    type: EnemyType = "default"
  ) {
    const enemies = [];
    const enemyClass = EnemyClass[type];
    if (enemyClass) {
      for (let i = 0; i < count; i++) {
        enemies.push(new enemyClass(spawn, path));
      }
    }
    return enemies;
  }
}
