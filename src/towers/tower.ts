import { Position } from "../enemies/enemy";
import { ILevel } from "../constants/levels";
import { TOWERS } from "../constants/towers";

export type ITowerUpgrade<T = ITower> = { [k in keyof T]: number } & {
  gold: number;
};

export type ITowerBuffs<T = ITower> = Map<keyof T, any>;

export interface ITower {
  range: {
    from: Position;
    to: Position;
  };
  vision: number;
  type: keyof typeof TOWERS;
  upgradeLevel: number;
  upgrades: ITowerUpgrade[];
  buffs: ITowerBuffs;
}

export abstract class Tower implements ITower {
  range = null;
  vision = 1;
  upgradeLevel = -1;

  cellIndex = -1;
  rowIndex = -1;

  abstract upgrades;
  abstract buffs;
  abstract type: keyof typeof TOWERS;

  protected constructor(rowIndex, cellIndex) {
    this.rowIndex = rowIndex;
    this.cellIndex = cellIndex;
    this.updateRange();
  }

  get canUpgrade(): boolean {
    return !!this.upgrades?.length || this.upgradeLevel < this.upgrades.length;
  }

  get nextUpgrade(): ITowerUpgrade {
    return this.upgrades[this.upgradeLevel + 1];
  }

  public upgrade(): void {
    if (this.canUpgrade) {
      this.upgradeLevel++;
      this.upgradeTower(this.upgradeLevel);
      this.updateRange();
    }
  }

  private updateRange() {
    this.range = {
      from: {
        x: this.cellIndex - this.vision,
        y: this.rowIndex - this.vision,
      },
      to: {
        x: this.cellIndex + this.vision,
        y: this.rowIndex + this.vision,
      },
    };
  }

  abstract action(level: ILevel): void;
  abstract upgradeTower(upgradeLevel: number): void;
}
