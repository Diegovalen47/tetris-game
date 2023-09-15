// define class Pieza
export class Piece {
  parts: Cell[];
  name: String;
  center: Cell;
  color: String;

  static directions = {
    up:"UP",
    down:"DOWN",
    left:"LEFT",
    right:"RIGHT",
  }

  constructor(name: String, center: Cell, parts: Cell[], color: String) {
    this.name = name;
    this.center = center;
    this.parts = parts;
    this.color = color;
  }

  move(direction: String, gameBoardState: Array<Array<number>>): void{
    let newParts: Cell[] = [];
    let newCenter: Cell = this.center;
    if (direction === Piece.directions.up) {
      newParts = this.rotate()
    }
    if (direction === Piece.directions.down) {
      newParts = this.parts.map((part) => {
        return new Cell(part.row + 1, part.column);
      })
      newCenter = new Cell(this.center.row + 1, this.center.column);
    }
    if (direction === Piece.directions.left) {
      newParts = this.parts.map((part) => {
        return new Cell(part.row, part.column - 1);
      })
      newCenter = new Cell(this.center.row, this.center.column - 1);
    }
    if (direction === Piece.directions.right) {
      newParts = this.parts.map((part) => {
        return new Cell(part.row, part.column + 1);
      })
      newCenter = new Cell(this.center.row, this.center.column + 1);
    }
    if (this.checkEdgeCollision(newParts)) {
      return
    }
    if (this.checkInnerCollision(newParts, gameBoardState)) {
      return
    }
    this.parts = newParts;
    this.center = newCenter;
  }

  rotate() {
    const coordenadasRelativas = this.parts.map((part) => {
      const relCol = part.column - this.center.column;
      const relRow = part.row - this.center.row;
      return new Cell(relRow, relCol);
    })

    const coordenadasRotadas = coordenadasRelativas.map((part) => {
      return new Cell(-part.column, part.row);
    })


    const newParts = coordenadasRotadas.map((part) => {
      const absCol = part.column + this.center.column;
      const absRow = part.row + this.center.row;
      return new Cell(absRow, absCol);
    })

    return newParts;
  }

  checkEdgeCollision(newParts: Cell[]): boolean {
    return newParts.some((part) => {
      return part.row < 0 || part.row > 9 || part.column < 0 || part.column > 9;
    })
  }

  checkInnerCollision(newParts: Cell[], gameBoardState: Array<Array<number>>): boolean {
    return newParts.some((part) => {
      return gameBoardState[part.row][part.column] === 1;
    })
  }
}

export class Cell {
  row: number;
  column: number;

  constructor(row: number, column: number) {
    this.row = row;
    this.column = column;
  }
}