const playersObj = [
  {
    name: "player1",
    value: "X",
    pawn: 4,
  },
  {
    name: "player2",
    value: "O",
    pawn: 4,
  },
];

class Players {
  constructor(players = playersObj) {
    this.players = players;
    this.setPlayerName = this.setPlayerName.bind(this);
    this.decrementPlayersPawn = this.decrementPlayersPawn.bind(this);
  }

  setPlayerName(index, value) {
    this.players[index].name = value;
  }
  decrementPlayersPawn(playerValue) {
    const index = this.players[0].value == playerValue ? 0 : 1;
    const player = this.players[index];
    const opponentPlayer = this.players[Number(!index)];
    if (player.pawn === 0) {
      return [
        `All the Pawns are placed of ${player.name}`,
        opponentPlayer.pawn,
      ];
    }
    if (player.value == playerValue) {
      player.pawn--;
      return [true, player.pawn, opponentPlayer.pawn];
    }
    console.log(this.players[0], this.players[1]);
    return [false, player.pawn, opponentPlayer.pawn];
  }
}
const gameBoard = [
  ["-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-"],
  ["-", "-", "-", "-", "-", "-", "-", "-"],
];
class GameBoard {
  #jumpPositions;
  #playerFirstPawns;
  #playerSecondPawns;
  constructor(board = gameBoard) {
    this.board = board;
    this.#playerFirstPawns = 9;
    this.#playerSecondPawns = 9;
    this.#jumpPositions = [];
    this.addPosition = this.addPosition.bind(this);
    this.checkWinner = this.checkWinner.bind(this);
    this.deleteOpponentsPawn = this.deleteOpponentsPawn.bind(this);
    this.movePosition = this.movePosition.bind(this);
    this.getMillis = this.getMillis.bind(this);
    this.checkJumpPositions = this.checkJumpPositions.bind(this);
    this.getJumpPawnPossibilites = this.getJumpPawnPossibilites.bind(this);
    this.getAdjacentEmptyPositions = this.getAdjacentEmptyPositions.bind(this);
    this.isMillis = this.isMillis.bind(this);
    this.boxWinningPositions = [
      [0, 1, 2],
      [2, 3, 4],
      [4, 5, 6],
      [6, 7, 0],
    ];
    this.lineWinningPositions = [1, 3, 5, 7];
  }

  addPosition(index, position, value) {
    this.board[index][position] = value;
  }

  checkWinner(index, position) {
    return this.checkLineWin(position) || this.checkBoxWin(index, position);
  }

  checkLineWin(position) {
    if (this.lineWinningPositions.includes(position)) {
      if (
        this.board[0][position] === this.board[1][position] &&
        this.board[0][position] === this.board[2][position]
      ) {
        return true;
      }
    }
  }

  checkBoxWin(index, position) {
    for (let array of this.boxWinningPositions) {
      if (array.includes(position)) {
        const boxBoard = this.board[index];
        if (
          boxBoard[array[0]] === boxBoard[array[1]] &&
          boxBoard[array[1]] === boxBoard[array[2]]
        ) {
          console.log("won");
          return true;
        }
      }
    }
  }

  getAdjacentEmptyPositions(index, position, value) {
    console.log("getAdjacentEmptyPositions", index, position);
    let adjacentPositions = [];
    this.#jumpPositions = this.getJumpPawnPossibilites(index, position, value);
    console.log("jumpPositions :>> ", this.#jumpPositions);
    adjacentPositions.push(...this.#jumpPositions);
    const isOddPosition = position % 2 !== 0 ? true : false;
    if (isOddPosition) {
      if (index === 0 || index === 2) {
        if (this.board[1][position] === "-")
          adjacentPositions.push([1, position]);
      } else {
        for (let i = 0; i < 2; i++) {
          const index2 = i === 0 ? 0 : 2;
          console.log([index2, position], this.board[index2][position]);
          if (this.board[index2][position] === "-")
            adjacentPositions.push([index2, position]);
        }
      }
    }
    console.log("adjacentPositions :>> ", adjacentPositions);
    if (position === 0) {
      console.log("position is 0 :>> ");
      if (this.board[index][1] === "-") adjacentPositions.push([index, 1]);
      if (this.board[index][7] === "-") adjacentPositions.push([index, 7]);
      console.log("adjacentPositions :>> ", adjacentPositions);
      return adjacentPositions;
    }
    if (position === 7) {
      console.log("position is 7 :>> ");
      if (this.board[index][0] === "-") adjacentPositions.push([index, 0]);
      if (this.board[index][6] === "-") adjacentPositions.push([index, 6]);
      console.log("adjacentPositions :>> ", adjacentPositions);
      return adjacentPositions;
    }
    for (let i = 0; i < 2; i++) {
      console.log("position is not 0 or 7 :>> ");
      const position2 = i === 0 ? position - 1 : position + 1;
      console.log([index, position2], this.board[index][position2]);
      if (this.board[index][position2] === "-")
        adjacentPositions.push([index, position2]);
    }
    return adjacentPositions;
  }

  movePosition(beforeMovePos, afterMovePos, value) {
    console.log("beforeMovePos :>> ", beforeMovePos);
    this.board[beforeMovePos[0]][beforeMovePos[1]] = "-";
    console.log(
      "beforeMovePos board:>> ",
      this.board[beforeMovePos[0]][beforeMovePos[1]]
    );
    this.board[afterMovePos[0]][afterMovePos[1]] = value;
    console.log(
      "afterMovePos board:>> ",
      this.board[afterMovePos[0]][afterMovePos[1]]
    );
  }

  deleteOpponentsPawn(index, position, value) {
    value === "X" ? this.#playerFirstPawns-- : this.#playerSecondPawns--;
    console.log("this.#playerFirstPawns", this.#playerFirstPawns);
    console.log("this.#playerSecondPawns", this.#playerSecondPawns);
    return (this.board[index][position] = "-");
  }

  isPlayerWin() {
    console.log("player win called");
    if (this.#playerFirstPawns === 2 || this.#playerSecondPawns === 2)
      return true;
    return false;
  }
  getMillis(value) {
    let result = [];
    console.log(this.board);
    for (let i = 0; i < 3; i++) {
      this.boxWinningPositions.forEach((positions) => {
        if (
          this.board[i][positions[0]] === this.board[i][positions[1]] &&
          this.board[i][positions[0]] === this.board[i][positions[2]] &&
          this.board[i][positions[0]] === value
        ) {
          result.push([i, positions]);
        }
      });
    }

    this.lineWinningPositions.forEach((position) => {
      if (
        this.board[0][position] === this.board[1][position] &&
        this.board[0][position] === this.board[2][position] &&
        this.board[0][position] === value
      )
        result.push([[0, 1, 2], position]);
    });
    // console.log("result :>> ", result);
    return result;
  }

  getJumpPawnPossibilites(index, position, value) {
    const opponentPlayerValue = value === "X" ? "O" : "X";
    const isOddPosition = position % 2 !== 0 ? true : false;
    console.log("odd postion? ", position % 2, isOddPosition);
    if (isOddPosition) {
      let result = [];
      const index1 = index === 0 ? 2 : 0;
      if (
        (index === 0 || index === 2) &&
        this.board[1][position] === opponentPlayerValue &&
        this.board[index1][position] === "-" &&
        !this.isMillis(1, position)
      ) {
        console.log("this.isMillis(1, position)", this.isMillis(1, position));
        result.push([index1, position]);
        return result;
      }
      return [];
    }
    let result = [];
    if (position === 0) {
      if (
        this.board[index][1] === opponentPlayerValue &&
        this.board[index][2] === "-" &&
        !this.isMillis(index, 1)
      ) {
        console.log("this.isMillis(index, 1)", this.isMillis(index, 1));
        result.push([index, 2]);
      }
      if (
        this.board[index][7] === opponentPlayerValue &&
        this.board[index][6] === "-" &&
        !this.isMillis(index, 7)
      ) {
        console.log("this.isMillis(index, 7)", this.isMillis(index, 7));
        result.push([index, 6]);
      }
      return result;
    }
    if (position === 6) {
      if (
        this.board[index][5] === opponentPlayerValue &&
        this.board[index][4] === "-" &&
        !this.isMillis(index, 5)
      ) {
        console.log("this.isMillis(index, 5)", this.isMillis(index, 5));
        result.push([index, 4]);
      }
      if (
        this.board[index][7] === opponentPlayerValue &&
        this.board[index][0] === "-" &&
        !this.isMillis(index, 7)
      ) {
        console.log("this.isMillis(index, 7)", this.isMillis(index, 7));
        result.push([index, 0]);
      }
      return result;
    }
    for (let i = 0; i < 2; i++) {
      const index2 = i === 0 ? position + 1 : position - 1;
      const index3 = i === 0 ? index2 + 1 : index2 - 1;
      if (
        this.board[index][index2] === opponentPlayerValue &&
        this.board[index][index3] === "-" &&
        !this.isMillis(index, index2)
      ) {
        console.log(
          "this.isMillis(index, index2)",
          this.isMillis(index, index2)
        );
        result.push([index, index3]);
      }
    }
    return result;
  }

  isMillis(index, position) {
    if (
      this.board[0][position] === this.board[1][position] &&
      this.board[0][position] === this.board[2][position]
    ) {
      return true;
    }
    if (
      position === 7 &&
      this.board[index][position] === this.board[index][0] &&
      this.board[index][position] === this.board[index][position - 1]
    ) {
      return true;
    }
    if (
      this.board[index][position] === this.board[index][position + 1] &&
      this.board[index][position] === this.board[index][position - 1]
    ) {
      return true;
    }
    return false;
  }
  checkJumpPositions(index, position) {
    let jumpPositions = this.#jumpPositions;
    for (let i = 0; i < jumpPositions.length; i++) {
      const boxIndex = jumpPositions[i][0];
      const positionIndex = jumpPositions[i][1];
      if (boxIndex === index && positionIndex === position) return true;
    }
  }
}
