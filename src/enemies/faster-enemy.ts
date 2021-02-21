import { Enemy, Move, Position } from "./enemy";
import { C } from "../canvas";
import { GRID_CELL_HEIGHT, GRID_CELL_WIDTH } from "../constants/common";

export class FasterEnemy extends Enemy {
  damage = 5;
  speedCoefficient = 1.5;

  constructor(spawn: Position, path: Move[]) {
    super(spawn, path);
  }

  render() {
    C.beginPath();
    C.moveTo(this.lastX, this.lastY);
    C.lineTo(this.lastX + GRID_CELL_WIDTH / 2, this.lastY - GRID_CELL_HEIGHT / 4);
    C.lineTo(this.lastX, this.lastY - GRID_CELL_HEIGHT / 2);
    C.closePath();
    C.fillStyle = "rgba(255, 0, 0, .6)";
    C.fill();
  }
}
