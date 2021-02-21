import { Enemy, Move, Position } from "./enemy";
import { C } from "../canvas";
import { GRID_CELL_HEIGHT, GRID_CELL_WIDTH } from "../constants/common";

export class BiggerEnemy extends Enemy {
  health = 3;
  damage = 3;
  speedCoefficient = 0.3;

  constructor(spawn: Position, path: Move[]) {
    super(spawn, path);
  }

  render() {
    C.beginPath();
    C.fillRect(this.lastX, this.lastY, GRID_CELL_WIDTH, GRID_CELL_HEIGHT);
    C.fillStyle = this.fill;
    C.fill();
    C.closePath();
  }
}
