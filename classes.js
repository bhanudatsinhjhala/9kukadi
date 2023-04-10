const playersObj = [
  {
    name: "player1",
    value: "X",
    pawn: 9,
  },
  {
    name: "player2",
    value: "O",
    pawn: 9,
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
    this.#playerFirstPawns = 9;
    this.#playerSecondPawns = 9;
    this.#jumpPositions = [];
    this.board = board;
    this.boxWinningPositions = [
      [0, 1, 2],
      [2, 3, 4],
      [4, 5, 6],
      [6, 7, 0],
    ];
    this.lineWinningPositions = [1, 3, 5, 7];
    this.addPosition = this.addPosition.bind(this);
    this.checkMillis = this.checkMilli.bind(this);
    this.removeOpponentsPawn = this.removeOpponentsPawn.bind(this);
    this.movePosition = this.movePosition.bind(this);
    this.getMillis = this.getMillis.bind(this);
    this.getBoxMillis = this.getBoxMillis.bind(this);
    this.getLineMillis = this.getLineMillis.bind(this);
    this.checkJumpPositions = this.checkJumpPositions.bind(this);
    this.getJumpPawnPossibilites = this.getJumpPawnPossibilites.bind(this);
    this.getJumpPosition = this.getJumpPosition.bind(this);
    this.getExceptionJumpPosition = this.getExceptionJumpPosition.bind(this);
    this.getOddJumpPositions = this.getOddJumpPositions.bind(this);
    this.getAdjacentEmptyPositions = this.getAdjacentEmptyPositions.bind(this);
  }

  addPosition(index, position, value) {
    this.board[index][position] = value;
  }

  checkMilli(index, position) {
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
          return true;
        }
      }
    }
  }

  getAdjacentEmptyPositions(index, position, value) {
    let adjacentPositions = [];
    adjacentPositions = [...this.#jumpPositions] = this.getJumpPawnPossibilites(
      index,
      position,
      value
    );
    console.log("#jumpPositions :>> ", this.#jumpPositions);
    const isOddPosition = position % 2 !== 0 ? true : false;
    if (isOddPosition) {
      if (index === 0 || index === 2) {
        if (this.board[1][position] === "-")
          adjacentPositions.push([1, position]);
      } else {
        for (let i = 0; i < 2; i++) {
          const index2 = i === 0 ? 0 : 2;
          if (this.board[index2][position] === "-")
            adjacentPositions.push([index2, position]);
        }
      }
    }
    if (position === 0 || position === 7) {
      const positionNext = position === 0 ? 1 : 0;
      const positionPrevious = position === 0 ? 7 : 6;
      if (this.board[index][positionNext] === "-")
        adjacentPositions.push([index, positionNext]);
      if (this.board[index][positionPrevious] === "-")
        adjacentPositions.push([index, positionPrevious]);
      return adjacentPositions;
    }
    for (let i = 0; i < 2; i++) {
      const movePosition = i === 0 ? position - 1 : position + 1;
      if (this.board[index][movePosition] === "-")
        adjacentPositions.push([index, movePosition]);
    }
    console.log("finall adjacentPositions", adjacentPositions);
    return adjacentPositions;
  }

  movePosition(beforeMovePosition, afterMovePosition, value) {
    this.board[beforeMovePosition[0]][beforeMovePosition[1]] = "-";
    this.board[afterMovePosition[0]][afterMovePosition[1]] = value;
  }

  removeOpponentsPawn(index, position, value) {
    value === "X" ? this.#playerFirstPawns-- : this.#playerSecondPawns--;
    console.log("this.#playerFirstPawns", this.#playerFirstPawns);
    console.log("this.#playerSecondPawns", this.#playerSecondPawns);
    return (this.board[index][position] = "-");
  }

  isPlayerWin() {
    if (this.#playerFirstPawns === 2 || this.#playerSecondPawns === 2)
      return true;
    return false;
  }

  getMillis(value) {
    return [...this.getBoxMillis(value), ...this.getLineMillis(value)];
  }

  getLineMillis(value) {
    let result = [];
    this.lineWinningPositions.forEach((position) => {
      if (
        this.board[0][position] === this.board[1][position] &&
        this.board[0][position] === this.board[2][position] &&
        this.board[0][position] === value
      )
        result.push([[0, 1, 2], position]);
    });
    return result;
  }

  getBoxMillis(value) {
    let result = [];
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
    return result;
  }

  getJumpPawnPossibilites(index, position, value) {
    const opponentPlayerValue = getOpponetsValue(value);
    const isOddPosition = position % 2 !== 0 ? true : false;
    if (isOddPosition) {
      return this.getOddJumpPositions(index, position, opponentPlayerValue);
    }
    if (position === 0 || position === 6) {
      return this.getExceptionJumpPosition(
        position,
        index,
        opponentPlayerValue
      );
    }
    let result = [];
    for (let i = 0; i < 2; i++) {
      const jumpPosition = i === 0 ? position + 1 : position - 1;
      const newPositionPlayer = i === 0 ? jumpPosition + 1 : jumpPosition - 1;
      const resultPosition = this.getJumpPosition(
        index,
        jumpPosition,
        newPositionPlayer,
        opponentPlayerValue
      );
      if (resultPosition) result.push(resultPosition);
    }
    console.log("result", result);
    return result;
  }

  getJumpPosition(index, jumpPosition, newPositionPlayer, opponentPlayerValue) {
    if (
      this.board[index][jumpPosition] === opponentPlayerValue &&
      this.board[index][newPositionPlayer] === "-" &&
      !this.checkMilli(index, jumpPosition)
    ) {
      console.log("newPositionPlayer", newPositionPlayer);
      return [index, newPositionPlayer];
    }
    return;
  }

  getExceptionJumpPosition(value, index, opponentPlayerValue) {
    const jumpPosition = value === 0 ? 1 : 5;
    const newPositionPlayer = value === 0 ? 2 : 4;
    const oppositePosition = value === 0 ? 6 : 0;
    let result = [];
    const jumpPositionLowerValue = this.getJumpPosition(
      index,
      jumpPosition,
      newPositionPlayer,
      opponentPlayerValue
    );
    const jumpPositionIsSeven = this.getJumpPosition(
      index,
      7,
      oppositePosition,
      opponentPlayerValue
    );
    if (jumpPositionLowerValue) result.push(jumpPositionLowerValue);
    if (jumpPositionIsSeven) result.push(jumpPositionIsSeven);
    console.log("result", result);
    return result;
  }

  getOddJumpPositions(index, position, opponentPlayerValue) {
    const jumpIndex = index === 0 ? 2 : 0;
    if (
      (index === 0 || index === 2) &&
      this.board[1][position] === opponentPlayerValue &&
      this.board[jumpIndex][position] === "-" &&
      !this.checkMilli(1, position)
    )
      return [[jumpIndex, position]];
    return [];
  }
  checkJumpPositions(index, position) {
    let jumpPositions = this.#jumpPositions;
    console.info("jumpPositions", jumpPositions);
    for (let i = 0; i < jumpPositions.length; i++) {
      const boxIndex = jumpPositions[i][0];
      const positionIndex = jumpPositions[i][1];
      if (boxIndex === index && positionIndex === position) return true;
    }
  }
}
