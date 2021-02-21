export const _canvas: HTMLCanvasElement = document.getElementById(
  "g"
) as HTMLCanvasElement;

export const C = _canvas.getContext("2d", { alpha: false });

