import { _canvas, C } from "./canvas";

export default class Engine {
  static tasks = [];
  static rendering = false;

  private static framesCount = 0;
  private static frameTime = 0;
  private static maxTasks = 0;
  private static animationReq = null;

  constructor() {}

  static add(fn) {
    if (this.tasks.indexOf(fn) < 0) {
      this.tasks.push(fn);
    }
  }

  static remove(fn) {
    const index = this.tasks.indexOf(fn);
    if (index >= 0) {
      this.tasks.splice(index, 1);
    }
  }

  static render() {
    this.framesCount++;
    if (this.rendering) {
      this.rendering = true;
      const startTime = performance.now();
      C.clearRect(0, 0, _canvas.width, _canvas.height);
      this.tasks.forEach((fn) => fn());
      const frameTime = performance.now() - startTime;

      this.maxTasks =
        this.tasks.length > this.maxTasks ? this.tasks.length : this.maxTasks;
      this.frameTime = frameTime > this.frameTime ? frameTime : this.frameTime;

      this.animationReq = requestAnimationFrame(this.render.bind(this));
    }
  }

  static start() {
    this.rendering = true;
    this.animationReq = requestAnimationFrame(this.render.bind(this));
  }

  static stop() {
      this.rendering = false;
      if (this.animationReq) {
        cancelAnimationFrame(this.animationReq);
      }

      console.table({
        "Max tasks": this.maxTasks,
        "Frames count": this.framesCount,
        "Frame time": this.frameTime,
      });
  }

  static restore() {
    this.stop();

    this.tasks = [];
    this.rendering = false;
    this.framesCount = 0;
    this.frameTime = 0;
    this.maxTasks = 0;
    this.animationReq = null;
  }
}
