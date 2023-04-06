const headingEl = document.querySelector(".heading");
const cellsEl = document.querySelectorAll(".cells");
const playerFormEl = document.querySelector(".players-form");
const boardEl = document.querySelector(".board");
const player1El = document.querySelector(".player1-para");
const player2El = document.querySelector(".player2-para");

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
  if (!player1 || !player2) {
    alert("Please do not leave fields empty");
    return;
  }
  if (player1 === player2) {
    alert("Please do not enter duplicate player names");
    return;
  }
  newPlayers.setPlayerName(0, player1);
  newPlayers.setPlayerName(1, player2);
  boardEl.style.display = "block";
  playerFormEl.style.display = "none";
  updatePawnBoard(player1El, player1, 9);
  updatePawnBoard(player2El, player2, 9);
  nextPlayersTurn("O");
}

function handleCellClick(index, position, e) {
  const inputVal = e.target.value;
  console.log("inputVal :>> ", inputVal);
  console.log("pawnStatus :>> ", pawnStatus);
  if (inputVal === "" && pawnStatus === "add")
    return addPawns(index, position, e);
  else if (inputVal === "" && pawnStatus === "move")
    return movePlayersPawn(index, position, e);
  else if (inputVal !== currentPlayerValue && pawnStatus === "delete")
    return removeOpponentsPawn(index, position, e);
  else if (inputVal === currentPlayerValue && pawnStatus === "move")
    return showPossibleMoves(index, position, e);
}

function removeOpponentsPawn(index, position, e) {
  newGameBoard.deleteOpponentsPawn(index, position, e.target.value);
  e.target.value = "";
  const opponentsValue = currentPlayerValue === "X" ? "O" : "X";
  toggleCellGroupBtns([...cellsEl], true, currentPlayerValue, opponentsValue);
  toggleCellGroupBtns([...cellsEl], false, "");
  changePawnStatus(pawnStatus);
  console.log("remove pawn changed pawnStatus :>> ", pawnStatus);
  const isPlayerWin = newGameBoard.isPlayerWin();
  console.log("isPlayerWin", isPlayerWin);
  if (isPlayerWin) return declareWinner("won", currentPlayerValue);
  return nextPlayersTurn(currentPlayerValue);
}

function movePlayersPawn(index, position, e) {
  console.log("movePLayersPawn function called");
  const cellEl = document.querySelector(
    `input[data-id=\"${movePosition[0]}${movePosition[1]}\"`
  );
  cellEl.value = "";
  e.target.value = currentPlayerValue;
  toggleCellButton(e.target, true);
  newGameBoard.movePosition(
    movePosition,
    [index, position],
    currentPlayerValue
  );
  const isInJumpPositions = newGameBoard.checkJumpPositions(index, position);
  console.log("isInJumpPositions", isInJumpPositions);
  if (isInJumpPositions)
    deleteOpponentOfJumpPosition(movePosition, [index, position]);
  const isPlayerWin = newGameBoard.isPlayerWin();
  console.log("isPlayerWin", isPlayerWin);
  if (isPlayerWin) return declareWinner("won", currentPlayerValue);
  toggleCellGroupBtns([...cellsEl], true, currentPlayerValue);
  const isWinner = newGameBoard.checkWinner(index, position);
  console.log("isWinner", isWinner);
  if (isWinner == true) return declareWinner("millis", currentPlayerValue);
  nextPlayersTurn(currentPlayerValue);
  console.log("board :>> ", newGameBoard.board);
  toggleCellGroupBtns([...cellsEl], true, "");
  toggleCellGroupBtns([...cellsEl], false, currentPlayerValue);
}

function showPossibleMoves(index, position, e) {
  console.log("showPossibleMoves function called");
  const playerName = getPlayersName(currentPlayerValue);
  headingEl.innerText = `${playerName} place your ${currentPlayerValue}`;
  toggleCellGroupBtns([...cellsEl], true, "");
  const getEmptyPositions = newGameBoard.getAdjacentEmptyPositions(
    index,
    position,
    currentPlayerValue
  );
  if (getEmptyPositions.length === 0)
    return (headingEl.innerText =
      "There are no vacant positions. please select other position");
  console.log("board :>> ", newGameBoard.board);
  movePosition = [index, position];
  console.log("movePosition", movePosition);
  console.log("getEmptyPositions :>> ", getEmptyPositions);
  const color = currentPlayerValue === "X" ? "green" : "blue";
  getEmptyPositions.forEach((indexPos) => {
    const cell = document.querySelector(
      `input[data-id=\"${indexPos[0]}${indexPos[1]}\"`
    );
    toggleCellButton(cell, false);
  });
}

function addPawns(index, position, e) {
  console.log("add position called");
  const pawnDecrementResult =
    newPlayers.decrementPlayersPawn(currentPlayerValue);
  const isPawnDecremented = pawnDecrementResult[0];
  const playerName = getPlayersName(currentPlayerValue);
  const playerEl = currentPlayerValue === "X" ? player1El : player2El;
  if (typeof isPawnDecremented === "string") {
    changePawnStatus(pawnStatus);
    console.log("add pawn changed pawnStatus :>> ", pawnStatus);
    updatePawnBoard(playerEl, playerName, pawnDecrementResult[1]);
    headingEl.innerText = isPawnDecremented;
  }
  if (isPawnDecremented === true) {
    updatePawnBoard(playerEl, playerName, pawnDecrementResult[1]);
    e.target.value = currentPlayerValue;
    toggleCellButton(e.target, true);
    newGameBoard.addPosition(index, position, currentPlayerValue);
    const isWinner = newGameBoard.checkWinner(index, position);
    console.log("isWinner", isWinner);
    if (isWinner == true) return declareWinner("millis", currentPlayerValue);
    if (pawnDecrementResult[2] === 0 && pawnDecrementResult[1] === 0) {
      console.error(
        "create move Board callled",
        pawnDecrementResult[2],
        pawnDecrementResult[2]
      );
      createMoveBoard(currentPlayerValue);
      changePawnStatus(pawnStatus, false);
      console.log("create move board changed pawnStatus :>> ", pawnStatus);
    }
    return nextPlayersTurn(currentPlayerValue);
  }
}

function declareWinner(messageCategory, currentPlayerValue) {
  const playerName = getPlayersName(currentPlayerValue);
  const messageCategories = ["millis", "won"];
  const messages = [
    `${playerName} has three on lines. Now please Pick Opponents Pawn`,
    `${playerName} has won the game. Congratulations!!!!`,
  ];
  const index = messageCategories.indexOf(messageCategory);
  const opponentsValue = currentPlayerValue === "X" ? "O" : "X";
  toggleCellGroupBtns([...cellsEl], false, opponentsValue);
  toggleCellGroupBtns([...cellsEl], true, "", currentPlayerValue);
  headingEl.innerText = messages[index];
  toggleMillis(opponentsValue);
  changePawnStatus(pawnStatus);
  console.log("declare win changed pawnStatus :>> ", pawnStatus);
  return;
}
