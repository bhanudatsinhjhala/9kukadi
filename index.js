const headingEl = document.querySelector(".heading");
let cellsEl = document.querySelectorAll(".cells");
const playerFormEl = document.querySelector(".players-form");
const boardEl = document.querySelector(".board");
const player1El = document.querySelector(".player1-para");
const player2El = document.querySelector(".player2-para");
const boardHeadingEl = document.getElementsByTagName("h4");

cellsEl = [...cellsEl];
const newGameBoard = new GameBoard();
const newPlayers = new Players();

let currentPlayerValue = "X";
let pawnStatus = "add";
let movePosition = [];

function handleSubmit(e) {
  e.preventDefault();
  const players = getFormData(e.target);
  const player1 = players[0].toLowerCase().trim();
  const player2 = players[1].toLowerCase().trim();
  if (!player1 || !player2) return alert("Please do not leave fields empty");
  if (player1 === player2)
    return alert("Please do not enter duplicate player names");
  newPlayers.setPlayerName(0, player1);
  newPlayers.setPlayerName(1, player2);
  boardEl.style.display = "block";
  playerFormEl.style.display = "none";
  updatePawnBoard(player1El, player1, 9);
  updatePawnBoard(player2El, player2, 9);
  nextPlayersTurn("O");
}

function handleCellClick(index, position, e) {
  const inputVal = e.target.dataset.value;
  switch (true) {
    case inputVal === "" && pawnStatus === "add":
      addPawns(index, position, e);
      break;
    case inputVal === "" && pawnStatus === "move":
      movePlayersPawn(index, position, e);
      break;
    case inputVal !== currentPlayerValue && pawnStatus === "delete":
      removeOpponentsPawn(index, position, e);
      break;
    case inputVal === currentPlayerValue && pawnStatus === "move":
      showPossibleMoves(index, position);
      break;
    default:
      console.error("Switch case reached to default");
  }
}

function removeOpponentsPawn(index, position, e) {
  newGameBoard.removeOpponentsPawn(index, position, e.target.dataset.value);
  setElementTargetDataValue(e.target, "");
  const opponentsValue = getOpponetsValue();
  toggleCellGroupBtns(cellsEl, true, currentPlayerValue, opponentsValue);
  toggleCellGroupBtns(cellsEl, false, "");
  const playerEl = currentPlayerValue === "X" ? player1El : player2El;
  updatePawnBoard(
    playerEl,
    getCurrentPlayerName(currentPlayerValue),
    newGameBoard.getPlayersPawnCount(currentPlayerValue)
  );
  changePawnStatus(pawnStatus);
  const isPlayerWin = newGameBoard.isPlayerWin();
  if (isPlayerWin) return declareWinner("won", currentPlayerValue);
  return nextPlayersTurn(currentPlayerValue);
}

function movePlayersPawn(index, position, e) {
  // empty last move position
  const cellEl = getCellBtnEl(movePosition[0], movePosition[1]);
  setElementTargetDataValue(cellEl, "");

  // disable the btn and assign the current player's value
  setElementTargetDataValue(e.target, currentPlayerValue);
  toggleCellButton(e.target, true);

  // move the position
  newGameBoard.movePosition(
    movePosition,
    [index, position],
    currentPlayerValue
  );

  // check if it's jump move and delete the opponent if it is.
  const isInJumpPositions = newGameBoard.checkJumpPositions(index, position);
  if (isInJumpPositions)
    deleteOpponentJumpPosition(movePosition, [index, position]);

  // check if the player won
  const isPlayerWin = newGameBoard.isPlayerWin();
  if (isPlayerWin) return declareWinner("won", currentPlayerValue);

  toggleCellGroupBtns(cellsEl, true, currentPlayerValue);

  // check if there is milli after moving
  const isWinner = newGameBoard.checkMilli(index, position);
  if (isWinner) return declareWinner("millis", currentPlayerValue);
  nextPlayersTurn(currentPlayerValue);
  toggleCellGroupBtns(cellsEl, true, "");
  toggleCellGroupBtns(cellsEl, false, currentPlayerValue);
}

function showPossibleMoves(index, position) {
  const playerName = getCurrentPlayerName(currentPlayerValue);
  setHeading(`${playerName} move your ${currentPlayerValue}`);
  toggleCellGroupBtns(cellsEl, true, "");
  const getEmptyPositions = newGameBoard.getAdjacentEmptyPositions(
    index,
    position,
    currentPlayerValue
  );
  if (getEmptyPositions.length === 0)
    return setHeading(
      "There are no vacant positions. please select other position"
    );
  movePosition = [index, position];
  getEmptyPositions.forEach((indexPosistions) => {
    const cell = getCellBtnEl(indexPosistions[0], indexPosistions[1]);
    toggleCellButton(cell, false);
  });
}

function addPawns(index, position, e) {
  const pawnDecrementResult =
    newPlayers.decrementPlayersPawn(currentPlayerValue);
  const isPawnDecremented = pawnDecrementResult[0];
  const playerName = getCurrentPlayerName(currentPlayerValue);
  const playerEl = currentPlayerValue === "X" ? player1El : player2El;
  if (isPawnDecremented) {
    updatePawnBoard(playerEl, playerName, pawnDecrementResult[1]);
    setElementTargetDataValue(e.target, currentPlayerValue);
    toggleCellButton(e.target, true);
    newGameBoard.addPosition(index, position, currentPlayerValue);
    const isWinner = newGameBoard.checkMilli(index, position);
    if (isWinner) return declareWinner("millis", currentPlayerValue);
    if (pawnDecrementResult[2] === 0 && pawnDecrementResult[1] === 0) {
      createMoveBoard();
      changePawnStatus(pawnStatus, false);
    }
    return nextPlayersTurn(currentPlayerValue);
  }
}

function declareWinner(messageCategory, currentPlayerValue) {
  const playerName = getCurrentPlayerName(currentPlayerValue);
  const messageCategories = ["millis", "won"];
  const messages = [
    `${playerName} has three on lines. Now please Pick Opponents Pawn`,
    `${playerName} has won the game. Congratulations!!!!`,
  ];
  const index = messageCategories.indexOf(messageCategory);
  const opponentsValue = getOpponetsValue();
  if (messageCategory === "won") {
    setHeading(messages[index]);
    return toggleCellGroupBtns(
      cellsEl,
      true,
      "",
      opponentsValue,
      currentPlayerValue
    );
  }
  toggleCellGroupBtns(cellsEl, false, opponentsValue);
  toggleCellGroupBtns(cellsEl, true, "", currentPlayerValue);
  toggleMillis(opponentsValue);
  changePawnStatus(pawnStatus);
  return;
}
