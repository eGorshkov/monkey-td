import { _canvas, C } from "./canvas";
import Engine from "./engine";

export class Ui {
  private lifeValue = 100;
  private goldValue = 100;

  get _render() {
    return this.render.bind(this);
  }

  get gold(): number {
    return this.goldValue;
  }

  constructor() {}

  damage(v) {
    this.lifeValue -= v;
    if (!this.lifeValue) {
      debugger;
      alert("LOL U DIED! LOL! LOL! U DIED!");
      Engine.stop();
    }
  }

  removeGold(value: number) {
    this.goldValue -= value;
  }

  addGold(value: number) {
    this.goldValue += value;
  }

  private render() {
    this.renderLife();
    this.renderGold();
  }

  private renderLife() {
    C.font = "bold 20px Verdana, sans-serif";
    C.shadowBlur = 2;
    C.shadowOffsetX = 2;
    C.shadowOffsetY = 2;
    C.fillStyle = "red";
    C.fillText(`LIFE: ${this.lifeValue}`, 40, 100);
  }

  private renderGold() {
    C.font = "bold 20px Verdana, sans-serif";
    C.shadowBlur = 2;
    C.shadowOffsetX = 2;
    C.shadowOffsetY = 2;
    C.fillStyle = "green";
    C.fillText(`GOLD: ${this.goldValue}`, _canvas.width - 200, 100);
  }
}
