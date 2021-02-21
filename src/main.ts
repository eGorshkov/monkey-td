import { Game } from "./game";
import { _canvas } from "./canvas";
import Engine from "./engine";

onload = () => {
  window["Engine"] = Engine;

  _canvas.width = window.innerWidth;
  _canvas.height = window.innerHeight;

  new Game();
};
