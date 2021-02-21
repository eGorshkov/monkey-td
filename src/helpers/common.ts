import { GRID_CELL_HEIGHT, GRID_CELL_WIDTH } from "../constants/common";

export function getGridRowIndex(y: number) {
  return Math.floor(y / GRID_CELL_HEIGHT);
}

export function getGridColumnIndex(x: number) {
  return Math.floor(x / GRID_CELL_WIDTH);
}

export function between(value: number, fromValue: number, toValue: number) {
  return value >= fromValue && value <= toValue;
}
