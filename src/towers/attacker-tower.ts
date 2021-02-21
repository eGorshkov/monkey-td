import { ITower, ITowerUpgrade, Tower } from "./tower";
import { Enemy } from "../enemies/enemy";
import { ILevel } from "../constants/levels";
import { between } from "../helpers/common";
import { TOWERS } from "../constants/towers";

interface IAttackerTower {
  damage: number;
  reload: number;
  timestamp: number;
}

export class AttackerTower extends Tower implements IAttackerTower {
  type: keyof typeof TOWERS = "attacker";
  upgrades = [
    { damage: 3, vision: 2, gold: 150 },
    { damage: 5, vision: 3, gold: 300 },
  ] as ITowerUpgrade<IAttackerTower & ITower>[];
  buffs = new Map();
  damage = 1;
  reload = 300;
  timestamp = performance.now();

  constructor(rowIndex, cellIndex) {
    super(rowIndex, cellIndex);
  }

  get isReady(): boolean {
    return performance.now() - this.timestamp >= this.reload;
  }

  isTargetInRange(enemy: Enemy) {
    return (
      enemy.alive &&
      between(enemy.rowIndex, this.range.from.y, this.range.to.y) &&
      between(enemy.columnIndex, this.range.from.x, this.range.to.x)
    );
  }

  findAndShot(level: ILevel) {
    const target = level.enemies.find((enemy) => this.isTargetInRange(enemy));
    if (target?.alive) {
      target.health -= this.damage;
    }
  }

  upgradeTower(level: number): void {
    const upgrade = this.upgrades[level];
    Object.keys(upgrade).forEach((key) => (this[key] = upgrade[key]));
  }

  action(level: ILevel) {
    if (this.isReady) {
      this.findAndShot(level);
      this.timestamp = performance.now();
    }
  }
}
