import { AttackerTower } from "./attacker-tower";
import { ILevel } from "../constants/levels";
import { TOWERS } from "../constants/towers";

export class ShrapnelTower extends AttackerTower {
  type: keyof typeof TOWERS = "shrapnel";
  reload = 500;
  constructor(rowIndex, cellIndex) {
    super(rowIndex, cellIndex);
  }

  findAndShot(level: ILevel) {
    level.enemies.forEach((enemy) => {
      if (this.isTargetInRange(enemy) && enemy.alive) {
        enemy.health -= this.damage;
      }
    });
  }
}
