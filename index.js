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
    this.players[index] = value;
  }
  decrementPlayersPawn(playerValue) {
    const index = this.players[0].value == playerValue ? 0 : 1;
    const player = this.players[index];
    if (player.pawn === 0) {
      return "All the Pawns are placed";
    }
    if (player.value == playerValue) {
      player.pawn--;
      return true;
    }
    console.log(this.players[0].pawn, this.players[1].pawn);
    return false;
  }
}
class gameBoard {
  constructor(board = {}) {
    this.board = board;
    this.addPosition = this.addPosition.bind(this);
  }
  addPosition(position, value) {
    this.board[position] = value;
  }
}

const newGameBoard = new gameBoard();
const newPlayers = new Players();
let playerTurnVal = "X";

function handleSubmit(e) {
  e.preventDefault();
  const players = getFormData(e.target);
  newPlayers.setPlayerName(0, players[0]);
  newPlayers.setPlayerName(1, players[1]);
}

function getFormData(form) {
  const data = [...new FormData(form).entries()];
  const result = [];
  for (let i = 0; i < data.length; i++) {
    result.push(data[i][1]);
  }
}

function handleCellClick(cellNum, e) {
  const isPawnDecremented = newPlayers.decrementPlayersPawn(playerTurnVal);
  if (typeof isPawnDecremented == "string") {
    
  }
  e.target.value = playerTurnVal;
  playerTurnVal = playerTurnVal == "X" ? "O" : "X";
}
