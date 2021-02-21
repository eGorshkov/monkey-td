import { C } from "../canvas";
import {
  CELL_LENGTH,
  GRID_CELL_HEIGHT,
  GRID_CELL_WIDTH,
} from "../constants/common";
import { Subject } from "../helpers/subject";
import { getGridColumnIndex, getGridRowIndex } from "../helpers/common";

export interface Move {
  to: "right" | "left" | "up" | "bottom";
  value: number;
}

export interface Position {
  x: number;
  y: number;
}

export type EnemyType = "default" | "bigger" | 'faster';

export class Enemy {
  lastX = 0;
  lastY = 0;
  path: Move[] = [];
  pathIndex = 0;
  speedCoefficient = 0.7;
  health = 1;
  damage = 1;
  fill = ["#0095DD", "red", "black", "white", "yellow"].find(
    (x, i) => i === Math.floor(Math.random() * 5)
  );

  id = null;

  onDamaging = new Subject();
  onKilling = new Subject();

  constructor(spawn: Position, path: Move[]) {
    this.lastX = Math.ceil(spawn.x * GRID_CELL_WIDTH + GRID_CELL_WIDTH / 2);
    this.lastY = Math.ceil(spawn.y * GRID_CELL_HEIGHT + GRID_CELL_HEIGHT / 2);
    this.path = path;
    this.id = (Math.random() * 10 ** 6).toString().replace(".", "");
  }

  _moving = this.moving.bind(this);

  get currentMove(): Move {
    return this.path[this.pathIndex];
  }

  get isCeil(): number {
    return this.isHorizontal ? this.rowIndex : this.columnIndex;
  }

  get rowIndex(): number {
    return getGridRowIndex(this.lastY);
  }

  get columnIndex(): number {
    return getGridColumnIndex(this.lastX);
  }

  get isHorizontal(): boolean {
    return this.currentMove.to === "up" || this.currentMove.to === "bottom";
  }

  get alive(): boolean {
    return this.health > 0;
  }

  get isEnded(): boolean {
    return !this.alive || !this.currentMove;
  }

  render() {
    C.beginPath();
    C.arc(this.lastX, this.lastY, GRID_CELL_WIDTH / 4, 0, Math.PI * 2);
    C.fillStyle = this.fill;
    C.fill();
    C.closePath();
  }

  start() {
    this.moving();
    return this;
  }

  moving() {
    if (!this.alive) {
      this.kill();
      return;
    }

    if (!this.currentMove) {
      this.onDamaging.next(this.damage);
      this.kill();
      return;
    }

    this.change(this.currentMove.to);

    if (this.isCeil === this.currentMove.value) {
      this.pathIndex++;
    }

    this.render();
  }

  kill() {
    this.onKilling.next();
  }

  private change(to: "right" | "left" | "up" | "bottom"): number {
    let changed = 0;
    switch (to) {
      case "right":
      case "left":
        changed = Math.ceil(
          CELL_LENGTH * this.speedCoefficient * (to === "right" ? 1 : -1)
        );
        this.lastX += changed;
        return changed;
      case "bottom":
      case "up":
        changed = Math.ceil(
          CELL_LENGTH * this.speedCoefficient * (to === "bottom" ? 1 : -1)
        );
        this.lastY += changed;
        return changed;
    }
  }
}
