class Game {
  constructor(width, height, p1, p2) {
    this.players = [p1, p2];
    this.width = width;
    this.height = height;
    this.currPlayer = p1; // active player: 1 or 2
    this.board = []; // array of rows, each row is array of cells  (board[y][x])
    this.makeBoard();
    this.makeHtmlBoard();
  }
  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }
  makeHtmlBoard() {
    const board = document.getElementById("board");

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.addEventListener("click", this.handleClick.bind(this));

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("tr");

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }
  placeInTable(y, x) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.classList.add(`p${this.currPlayer}`);
    console.log(this.currPlayer);
    piece.style.backgroundColor = this.currPlayer;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }
  endGame(msg) {
    alert(msg);
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer} won!`);
    }

    // check for tie
    if (this.board.every((row) => row.every((cell) => cell))) {
      return this.endGame("Tie!");
    }

    // switch players
    this.currPlayer =
      this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }
  checkForWin() {
    const _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    };

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
  startGame() {
    // Clear the board

    this.board = [];
    this.makeBoard();
    this.makeHtmlBoard();

    // Reset current player to the first player
    this.currPlayer = this.players[0];
  }
}

const btn = document.querySelector("#btn");
btn.addEventListener("click", () => {
  const p1 = document.querySelector("#p1").value;
  const p2 = document.querySelector("#p2").value;
  const height = document.querySelector("#height").value;
  const width = document.querySelector("#width").value;

  const board = document.getElementById("board");

  if (!height || !width) {
    alert("Please give the board a size");
    return;
  }
  if (height <= 0 || width <= 0) {
    alert("Min height or width is 1");
    return;
  }
  if (height > 50 || width > 50) {
    alert("Max size is 50 for height and width");
    return;
  }
  if (p1 === p2) {
    alert("No twins allow!");
    return;
  }
  board.innerHTML = "";
  new Game(height, width, p1, p2);
});
new Game(7, 6, "red", "blue");
