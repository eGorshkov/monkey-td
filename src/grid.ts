import { C } from "./canvas";
import { GRID_CELL_HEIGHT, GRID_CELL_WIDTH } from "./constants/common";
import { Tower } from "./towers/tower";
import { getGridColumnIndex, getGridRowIndex } from "./helpers/common";
import { ILevel } from "./constants/levels";
import { Game } from "./game";
import { AttackerTower } from "./towers/attacker-tower";
import { callMenu, removeAll } from "./ui/menu";
import { TOWERS } from "./constants/towers";

enum COLORS {
  block = "#CCC7B9",
  road = "#EAF9D9",
  tower = "#E2D4BA",
  onRange = "rgb(228 253 201)",
  multi_tower = "#653239",
}

type CellType = "road" | "block" | "tower";

class Cell {
  type: CellType = "road";
  rowIndex = 0;
  cellIndex = 0;
  private ctx: ILevel = null;

  tower: Tower = null;

  constructor(value: number, rowIndex: number, cellIndex: number, ctx: ILevel) {
    this.type = Boolean(value) ? "road" : "block";
    this.rowIndex = rowIndex;
    this.cellIndex = cellIndex;
    this.ctx = ctx;
  }

  createTower(type: keyof typeof TOWERS) {
    this.type = "tower";
    this.tower = new TOWERS[type]._class(this.rowIndex, this.cellIndex);
  }
}

export class Grid {
  get _render() {
    return this.render.bind(this, this._level);
  }

  get _listenCellClick() {
    return this.listenCellClick(this._game).bind(this);
  }

  matrix = new Map<number, Cell[]>();
  activeCell: Cell = null;
  private _level: ILevel = null;
  private _game: Game = null;

  constructor(gameCtx: Game, level: ILevel) {
    this._level = level;
    this._game = gameCtx;
    level.matrix.forEach((row, rowIndex) => {
      this.matrix.set(
        rowIndex,
        row.map((cell, cellIndex) => new Cell(cell, rowIndex, cellIndex, level))
      );
    });
  }

  render(level: ILevel) {
    this.matrix.forEach((row, lineIndex) =>
      row.forEach((cell, cellIndex) => {
        this.renderCell(cell, level);

        if (cell.type === "tower") {
          C.font = "50px Verdana, sans-serif";
          C.fillStyle = "red";
          C.fillText(
            cell.tower.type[0].toUpperCase() + (cell.tower.upgradeLevel + 1),
            GRID_CELL_WIDTH * cellIndex + GRID_CELL_WIDTH * 0.25,
            GRID_CELL_HEIGHT * lineIndex + GRID_CELL_HEIGHT * 0.9
          );
        } else {
          C.font = "10px Verdana, sans-serif";
          C.fillStyle = "red";
          C.fillText(
            `r-${lineIndex} c-${cellIndex}`,
            GRID_CELL_WIDTH * cellIndex + GRID_CELL_WIDTH * 0.25,
            GRID_CELL_HEIGHT * lineIndex + GRID_CELL_HEIGHT * 0.9
          );
        }
      })
    );
  }

  private renderCell(cell: Cell, level: ILevel) {
    C.beginPath();
    C.rect(
      GRID_CELL_WIDTH * cell.cellIndex,
      GRID_CELL_HEIGHT * cell.rowIndex,
      GRID_CELL_WIDTH,
      GRID_CELL_HEIGHT
    );
    C.fillStyle = this._cellInRange(cell) ? COLORS.onRange : COLORS[cell.type];
    C.fill();
    C.strokeStyle = "rgba(0,0,0,.1)";
    C.stroke();
    C.closePath();

    if (cell.type === "tower") cell.tower?.action(level);
  }

  private listenCellClick(game: Game) {
    return (e: MouseEvent) => {
      console.log(game, e);
      const rowIndex = getGridRowIndex(e.y);
      const cellIndex = getGridColumnIndex(e.x);
      const cell = this.matrix.get(rowIndex)[cellIndex];

      if (!this._isActiveCell(cell)) {
        this.activeCell = cell;
      }

      if (cell.type !== "road") {
        removeAll();
        callMenu(e, cell);
      } else {
        removeAll();
      }
    };
  }

  private _isActiveCell(cell: Cell) {
    return (
      this.activeCell?.cellIndex === cell.cellIndex &&
      this.activeCell?.rowIndex === cell.rowIndex
    );
  }

  private _cellInRange(cell: Cell) {
    if (!this.activeCell?.tower?.range || cell.type === "tower") {
      return false;
    }

    const {
      tower: { range },
    } = this.activeCell;

    return (
      cell.rowIndex >= range.from.y &&
      cell.rowIndex <= range.to.y &&
      cell.cellIndex >= range.from.x &&
      cell.cellIndex <= range.to.x
    );
  }
}
