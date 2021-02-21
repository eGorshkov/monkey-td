import { Enemy, Position } from "../enemies/enemy";
import { between } from "../helpers/common";
import {ILevel} from '../constants/levels';

interface ITower {
  range: {
    from: Position;
    to: Position;
  };
  vision: number;
}

export class Tower implements ITower {
  range = null;
  vision = 1;
  damage = 1;
  reload = 500;
  target: Enemy = null;
  timestamp = performance.now();

  get isReady(): boolean {
    return performance.now() - this.timestamp >= this.reload;
  }

  constructor(rowIndex, cellIndex) {
    this.setRange(rowIndex, cellIndex);
  }

  private setRange(rowIndex: any, cellIndex: any) {
    this.range = {
      from: {
        x: cellIndex - this.vision,
        y: rowIndex - this.vision,
      },
      to: {
        x: cellIndex + this.vision,
        y: rowIndex + this.vision,
      },
    };
  }

  findTarget(level: ILevel) {
    this.target = level.enemies.find((enemy) => {
      return (
        enemy.alive &&
        between(enemy.rowIndex, this.range.from.y, this.range.to.y) &&
        between(enemy.columnIndex, this.range.from.x, this.range.to.x)
      );
    });
  }

  shot() {
    if (this.target?.alive && this.isReady) {
      --this.target.health;
      this.timestamp = performance.now();
    }
  }
}
