const participants = [];
const bingoNumbers = generateBingoNumbers();
let drawnNumbers = [];

function addParticipant() {
  const participantNameInput = document.getElementById('participant-name');
  const participantName = participantNameInput.value.trim();

  if (participantName !== '') {
    const card = generateBingoCard(participantName);
    participants.push(card);
    participantNameInput.value = '';
    displayBingoCards();
  }
}

function generateBingoCard(participantName) {
  const numbers = [];
  const shuffledNumbers = shuffleArray(bingoNumbers);

  for (let i = 0; i < 25; i++) {
    numbers.push({
      value: shuffledNumbers[i],
      marked: false
    });
  }

  return { name: participantName, numbers: numbers, hasBingo: false };
}

function displayBingoCards() {
  const bingoCardsDiv = document.getElementById('bingo-cards');
  bingoCardsDiv.innerHTML = '';

  participants.forEach((participant) => {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('bingo-card');
    cardDiv.setAttribute('data-name', participant.name);
    cardDiv.innerHTML = `
      <h3>${participant.name}</h3>
      <table>
          ${generateBingoTable(participant.numbers)}
      </table>
    `;

    bingoCardsDiv.appendChild(cardDiv);
  });
}

function generateBingoTable(numbers) {
  let tableHtml = '';

  for (let i = 0; i < 5; i++) {
    tableHtml += '<tr>';
    for (let j = 0; j < 5; j++) {
      const index = i * 5 + j;
      const number = numbers[index].value;
      const marked = numbers[index].marked ? 'marked' : '';

      tableHtml += `<td class="${marked}">${number}</td>`;
    }
    tableHtml += '</tr>';
  }

  return tableHtml;
}

function startBingo() {
  document.getElementById('start-bingo').disabled = true;
  drawnNumbers = [];
  displayDrawnNumbers();
  participants.forEach((participant) => {
    participant.hasBingo = false;
  });
 
  updateBingoCards();

  const bingoInterval = setInterval(() => {
    if (drawnNumbers.length === bingoNumbers.length || participants.some(participant => participant.hasBingo)) {
      clearInterval(bingoInterval);
      document.getElementById('start-bingo').disabled = false;
      showWinnerMessage();
      return;
    }

    const randomIndex = Math.floor(Math.random() * (bingoNumbers.length - drawnNumbers.length));
    const drawnNumber = bingoNumbers.filter((number) => !drawnNumbers.includes(number))[randomIndex];
    drawnNumbers.push(drawnNumber);
    checkBingo();
    displayDrawnNumbers();
    updateBingoCards();
  }, 100);
}

function checkBingo() {
  participants.forEach((participant) => {
    const numbers = participant.numbers;

    // Verificar linhas horizontais
    for (let i = 0; i < 5; i++) {
      const rowStartIndex = i * 5;
      const rowNumbers = numbers.slice(rowStartIndex, rowStartIndex + 5);
      if (rowNumbers.every((number) => number.marked)) {
        participant.hasBingo = true;
        return;
      }
    }

    // Verificar colunas verticais
    for (let i = 0; i < 5; i++) {
      const colNumbers = [];
      for (let j = 0; j < 5; j++) {
        colNumbers.push(numbers[i + j * 5]);
      }
      if (colNumbers.every((number) => number.marked)) {
        participant.hasBingo = true;
        return;
      }
    }

    // Verificar diagonal principal
    const diag1Numbers = [
      numbers[0],
      numbers[6],
      numbers[12],
      numbers[18],
      numbers[24]
    ];
    if (diag1Numbers.every((number) => number.marked)) {
      participant.hasBingo = true;
      return;
    }

    // Verificar diagonal secundária
    const diag2Numbers = [
      numbers[4],
      numbers[8],
      numbers[12],
      numbers[16],
      numbers[20]
    ];
    if (diag2Numbers.every((number) => number.marked)) {
      participant.hasBingo = true;
      return;
    }
  });
}

function showWinnerMessage() {
  const winnerMessage = document.getElementById('winner-message');
  const winner = participants.find((participant) => participant.hasBingo);

  if (winner) {
    winnerMessage.textContent = `O vencedor é ${winner.name}!`;
  } else {
    // Se não houver vencedor, seleciona um participante aleatoriamente
    const randomIndex = Math.floor(Math.random() * participants.length);
    const randomWinner = participants[randomIndex];
    winnerMessage.textContent = `O vencedor é ${randomWinner.name}!`;
  }
}

function displayDrawnNumbers() {
  const drawnNumbersList = document.getElementById('drawn-numbers');
  drawnNumbersList.innerHTML = '';
  drawnNumbers.forEach((number) => {
    const listItem = document.createElement('li');
    listItem.textContent = number;
    drawnNumbersList.appendChild(listItem);
  });
}

function updateBingoCards() {
  const bingoCards = document.querySelectorAll('.bingo-card');
  bingoCards.forEach((card) => {
    const name = card.getAttribute('data-name');
    const participant = participants.find((p) => p.name === name);

    if (participant) {
      const table = card.querySelector('table');
      const cells = table.getElementsByTagName('td');

      for (let i = 0; i < cells.length; i++) {
        const marked = participant.numbers[i].marked;
        cells[i].classList.toggle('marked', marked);
      }
    }
  });
}

function generateBingoNumbers() {
  const numbers = [];
  for (let i = 1; i <= 75; i++) {
    numbers.push(i);
  }
  return numbers;
}

function shuffleArray(array) {
  const shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}