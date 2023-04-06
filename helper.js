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

function setBackgroundColorOfCell(color, element, disabled) {
  const disabledColor = ["#9b000081", "#009b0d85", "#00629b7e"];
  const darkColor = ["#9b0000", "#009b0d", "#00629b", "#924404"];
  const colorName = ["red", "green", "blue", "brown"];
  if (disabled === true)
    return (element.style.backgroundColor =
      disabledColor[colorName.indexOf(color)]);
  return (element.style.backgroundColor = darkColor[colorName.indexOf(color)]);
}

function nextPlayersTurn(value) {
  currentPlayerValue = value === "X" ? "O" : "X";
  const playerName = getPlayersName(currentPlayerValue);
  const messages = [
    `${playerName} place your ${currentPlayerValue}`,
    `${playerName} move your ${currentPlayerValue}`,
  ];
  return (headingEl.innerText =
    pawnStatus === "move" ? messages[1] : messages[0]);
}

function toggleCellButton(element, disabled) {
  if (disabled) return element.setAttribute("disabled", true);
  return element.removeAttribute("disabled");
}

function getPlayersName(currentPlayerValue) {
  return newPlayers.players[0].value == currentPlayerValue
    ? newPlayers.players[0].name
    : newPlayers.players[1].name;
}

function updatePawnBoard(playerEl, playerName, pawnCount) {
  return (playerEl.innerText = `${playerName}: ${pawnCount}`);
}

function createMoveBoard(value) {
  value = value === "X" ? "O" : "X";
  const color = value === "X" ? "green" : "red";
  // console.log("value :>> ", value);
  toggleCellGroupBtns([...cellsEl], true, "");
  toggleCellGroupBtns([...cellsEl], false, value);
}

function changePawnStatus(value, isWinner = null) {
  const isAllPawnPlaced =
    newPlayers.players[0].pawn === 0 && newPlayers.players[1].pawn === 0;
  // console.log("isAllPawnPlaced :>> ", isAllPawnPlaced);
  switch (value) {
    case "add":
      // console.log("isWinner :>> ", isWinner);
      if (isAllPawnPlaced && isWinner === false) return (pawnStatus = "move");
      pawnStatus = "delete";
      break;
    case "delete":
      if (isAllPawnPlaced) {
        createMoveBoard(currentPlayerValue);
        return (pawnStatus = "move");
      }
      pawnStatus = "add";
      break;
    case "move":
      pawnStatus = "delete";
    default:
      break;
  }
}

function toggleCellGroupBtns(elements, disabled, ...args) {
  elements.forEach((element) => {
    args.forEach((value) => {
      if (element.value === value) toggleCellButton(element, disabled);
    });
  });
}

function toggleMillis(value) {
  const millisCellPosition = newGameBoard.getMillis(value);
  millisCellPosition.forEach((positions) => {
    if (Array.isArray(positions[0])) {
      const boxIndexes = positions[0];
      const btnPosition = positions[1];
      boxIndexes.forEach((boxIndex) => {
        const cellEl = document.querySelector(
          `input[data-id = \"${boxIndex}${btnPosition}\"`
        );
        toggleCellButton(cellEl, true);
      });
      return;
    }
    const boxIndex = positions[0];
    const btnPositions = positions[1];
    btnPositions.forEach((btnPosition) => {
      const cellEl = document.querySelector(
        `input[data-id = \"${boxIndex}${btnPosition}\"`
      );
      toggleCellButton(cellEl, true);
    });
  });
}

function deleteOpponentOfJumpPosition(oldPosition, newPosition) {
  console.log("deleteOpponentOfJumpPosition called", oldPosition, newPosition);
  const index = newPosition[0];
  const position = newPosition[1];
  const isOddPosition = position % 2 === 0 ? false : true;
  if (isOddPosition) {
    console.log("odd position");
    const opponentsValue = currentPlayerValue === "X" ? "O" : "X";
    newGameBoard.deleteOpponentsPawn(1, position, opponentsValue);
    const cellEl = document.querySelector(
      `input[data-id = \"${1}${position}\"`
    );
    return (cellEl.value = "");
  }
  const position2 = oldPosition[1];
  if (position === 0) {
    const index2 = position2 === 2 ? 1 : 7;
    newGameBoard.board[index][index2] = "-";
    const opponentsValue = currentPlayerValue === "X" ? "O" : "X";
    newGameBoard.deleteOpponentsPawn(index, index2, opponentsValue);
    const cellEl = document.querySelector(
      `input[data-id = \"${index}${index2}\"`
    );
    return (cellEl.value = "");
  }
  if (position === 6) {
    const index2 = position2 === 0 ? 7 : 5;
    newGameBoard.board[index][index2] = "-";
    const opponentsValue = currentPlayerValue === "X" ? "O" : "X";
    newGameBoard.deleteOpponentsPawn(index, index2, opponentsValue);
    const cellEl = document.querySelector(
      `input[data-id = \"${index}${index2}\"`
    );
    return (cellEl.value = "");
  }
  console.log("position2", position2, "position", position);
  const index2 = +position2 > +position ? +position + 1 : +position - 1;
  console.log("delete move", index, index2);
  newGameBoard.board[index][index2] = "-";
  const opponentsValue = currentPlayerValue === "X" ? "O" : "X";
  newGameBoard.deleteOpponentsPawn(index, index2, opponentsValue);
  const cellEl = document.querySelector(
    `input[data-id = \"${index}${index2}\"`
  );
  return (cellEl.value = "");
}
