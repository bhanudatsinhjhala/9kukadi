function getFormData(form) {
  const data = [...new FormData(form).entries()];
  const result = [];
  for (let i = 0; i < data.length; i++) {
    result.push(data[i][1]);
  }
  return result;
}

function resetPlayersName() {
  player1.value = "";
  player2.value = "";
}

// function setBackgroundColorOfCell(color, element, disabled) {
//   const disabledColor = ["#9b000081", "#009b0d85", "#00629b7e"];
//   const darkColor = ["#9b0000", "#009b0d", "#00629b", "#924404"];
//   const colorName = ["red", "green", "blue", "brown"];
//   if (disabled === true)
//     return (element.style.backgroundColor =
//       disabledColor[colorName.indexOf(color)]);
//   return (element.style.backgroundColor = darkColor[colorName.indexOf(color)]);
// }

function nextPlayersTurn(value) {
  currentPlayerValue = value === "X" ? "O" : "X";
  const color = currentPlayerValue === "X" ? "red" : "green";
  const playerName = getCurrentPlayerName(currentPlayerValue);
  const messages = [
    `${playerName} place your ${color}`,
    `${playerName} move your ${color}`,
  ];
  return (headingEl.innerText =
    pawnStatus === "move" ? messages[1] : messages[0]);
}

function toggleCellButton(element, disabled) {
  if (disabled) return element.setAttribute("disabled", true);
  return element.removeAttribute("disabled");
}

function getCurrentPlayerName(currentPlayerValue) {
  return newPlayers.players[0].value == currentPlayerValue
    ? newPlayers.players[0].name
    : newPlayers.players[1].name;
}

function updatePawnBoard(playerEl, playerName, pawnCount) {
  return (playerEl.innerText = `${playerName}: ${pawnCount}`);
}

function createMoveBoard() {
  toggleCellGroupBtns(cellsEl, true, "");
  toggleCellGroupBtns(cellsEl, false, getOpponetsValue());
  [...boardHeadingEl][0].innerText = "Pawns Left on Board";
  updatePawnBoard(
    player1El,
    getCurrentPlayerName("X"),
    newGameBoard.getPlayersPawnCount("X")
  );
  updatePawnBoard(
    player2El,
    getCurrentPlayerName("O"),
    newGameBoard.getPlayersPawnCount("O")
  );
}

function changePawnStatus(value, isWinner = null) {
  const isAllPawnPlaced =
    newPlayers.players[0].pawn === 0 && newPlayers.players[1].pawn === 0;
  switch (value) {
    case "add":
      if (isAllPawnPlaced && isWinner === false) return (pawnStatus = "move");
      pawnStatus = "delete";
      break;
    case "delete":
      if (isAllPawnPlaced) {
        createMoveBoard();
        return (pawnStatus = "move");
      }
      pawnStatus = "add";
      break;
    case "move":
      pawnStatus = "delete";
      break;
    default:
      console.error("Switch case reached to default");
      break;
  }
}

function toggleCellGroupBtns(elements, disabled, ...args) {
  elements.forEach((element) => {
    for (let i = 0; i < args.length; i++) {
      if (args[i] === element.dataset.value) {
        toggleCellButton(element, disabled);
        break;
      }
    }
  });
}

// diable opponents milli position so to prevent deletion
function toggleMillis(value) {
  const millisCellPosition = newGameBoard.getMillis(value);
  millisCellPosition.forEach((positions) => {
    if (Array.isArray(positions[0])) {
      const boxIndexes = positions[0];
      const btnPosition = positions[1];
      return boxIndexes.forEach((boxIndex) => {
        const cellEl = getCellBtnEl(boxIndex, btnPosition);
        toggleCellButton(cellEl, true);
      });
    }
    const boxIndex = positions[0];
    const btnPositions = positions[1];
    return btnPositions.forEach((btnPosition) => {
      const cellEl = getCellBtnEl(boxIndex, btnPosition);
      toggleCellButton(cellEl, true);
    });
  });
}

function deleteOpponentJumpPosition(oldMovePosition, newMovePosition) {
  const newIndex = newMovePosition[0];
  const newPosition = newMovePosition[1];
  const isOddPosition = newPosition % 2 === 0 ? false : true;
  const opponentsValue = getOpponetsValue();
  if (isOddPosition) return deletePosition(1, newPosition, opponentsValue);
  const oldPosition = oldMovePosition[1];
  if (newPosition === 0) {
    const opponentPosition = oldPosition === 2 ? 1 : 7;
    return deletePosition(newIndex, opponentPosition, opponentsValue);
  }
  if (newPosition === 6) {
    const opponentPosition = oldPosition === 0 ? 7 : 5;
    return deletePosition(newIndex, opponentPosition, opponentsValue);
  }
  const opponentPosition =
    +oldPosition > +newPosition ? +newPosition + 1 : +newPosition - 1;
  return deletePosition(newIndex, opponentPosition, opponentsValue);

  function deletePosition(index, position, value) {
    newGameBoard.removeOpponentsPawn(index, position, value);
    const cellEl = getCellBtnEl(index, position);
    const opponentsValue = currentPlayerValue === "X" ? "O" : "X";
    const playerEl = opponentsValue === "X" ? player1El : player2El;
    updatePawnBoard(
      playerEl,
      getCurrentPlayerName(opponentsValue),
      newGameBoard.getPlayersPawnCount(opponentsValue)
    );
    return setElementTargetDataValue(cellEl, "");
  }
}

function getOpponetsValue(value = currentPlayerValue) {
  return value === "X" ? "O" : "X";
}

function getCellBtnEl(index, position) {
  return document.querySelector(`input[data-id=\"${index}${position}\"`);
}

function setHeading(message) {
  return (headingEl.innerText = message);
}

function setElementTargetDataValue(element, value) {
  element.dataset.value = value;
}
