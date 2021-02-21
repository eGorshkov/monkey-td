import { _canvas, C } from "../canvas";
import Engine from "../engine";
import {callMenu} from './menu';

export class Ui {
  private static lifeValue = 100;
  private static goldValue = 300;

  static get _render() {
    return this.render.bind(this);
  }

  static get gold(): number {
    return this.goldValue;
  }

  constructor() {}

  static restore() {
    this.lifeValue = 100;
    this.goldValue = 300;
  }

  static damage(v) {
    this.lifeValue -= v;
    if (!this.lifeValue) {
      alert("LOL U DIED! LOL! LOL! U DIED!");
      Engine.stop();
    }
  }

  static removeGold(value: number) {
    this.goldValue -= value;
  }

  static addGold(value: number) {
    this.goldValue += value;
  }

  private static render() {
    this.renderLife();
    this.renderGold();
  }

  private static renderLife() {
    C.font = "bold 20px Verdana, sans-serif";
    C.shadowBlur = 2;
    C.shadowOffsetX = 2;
    C.shadowOffsetY = 2;
    C.fillStyle = "red";
    C.fillText(`LIFE: ${this.lifeValue}`, 40, 100);
  }

  private static renderGold() {
    C.font = "bold 20px Verdana, sans-serif";
    C.shadowBlur = 2;
    C.shadowOffsetX = 2;
    C.shadowOffsetY = 2;
    C.fillStyle = "green";
    C.fillText(`GOLD: ${this.goldValue}`, _canvas.width - 200, 100);
  }
}
