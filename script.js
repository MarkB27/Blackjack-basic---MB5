let dealerSum = 0;
let yourSum = 0;
let dealerScore = 0;
let playerScore = 0;
let draws = 0;
let dealerAceCount = 0;
let yourAceCount = 0;

let hidden = null;
let deck = [];

let playerName = "";

function resetGame() {
  dealerSum = 0;
  yourSum = 0;
  dealerAceCount = 0;
  yourAceCount = 0;
  canHit = true;
  hidden = null;
  deck = [];

  document.getElementById("dealer-cards").innerHTML = "";
  document.getElementById("your-cards").innerHTML = "";
  document.getElementById("hidden").src = "";
  document.getElementById("dealer-sum").innerText = "";
  document.getElementById("your-sum").innerText = "";
  document.getElementById("results").innerText = "";

  buildDeck();
  shuffleDeck();
}

function reset() {
  location.reload();
}

buildDeck();
shuffleDeck();
startGame();

document.getElementById("resetBtn").style.display = "inline";

const welcomeMessageDisplay = document.getElementById("welcome-message");

document.addEventListener("DOMContentLoaded", function () {
  const playerNameForm = document.getElementById("player-name-form");
  const gameDisplay = document.getElementById("game-display");
  const startButton = document.getElementById("start-game");
  const playerNameDisplay = document.getElementById("player-name-display");

  document.getElementById("start-game").addEventListener("click", startGame);
  playerNameForm.addEventListener("submit", function (e) {
    e.preventDefault();
    playerName = playerNameInput.value.trim();

    if (playerName !== "") {
      playerNameForm.style.display = "none";
      playerNameDisplay.innerText = "Player Name: " + playerName;
      playerNameDisplay.style.display = "block";
      gameDisplay.style.display = "block";

      // You don't need to call startGame(playerName) here again.
    }
  });
});

document.getElementById("start-game").addEventListener("click", function () {
  resetGame(); // Call resetGame() when the "start" button is clicked.
  // Also call startGame() to begin a new game.
});

function buildDeck() {
  let values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  let types = ["C", "D", "H", "S"];
  deck = [];

  for (let i = 0; i < types.length; i++) {
    for (let j = 0; j < values.length; j++) {
      deck.push(values[j] + "-" + types[i]);
    }
  }
  deck = [...new Set(deck)]; // Remove duplicates using a Set
}

function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
  console.log(deck);
}

function startGame() {
  // Clear the dealer-cards and your-cards divs
  document.getElementById("dealer-cards").innerHTML = "";
  document.getElementById("your-cards").innerHTML = "";
  document.getElementById("hidden").src = "";
  document.getElementById("dealer-sum").innerText = "";
  document.getElementById("your-sum").innerText = "";
  document.getElementById("results").innerText = "";

  hidden = deck.pop();
  dealerSum += getValue(hidden);
  dealerAceCount += checkAce(hidden);

  canHit = true; // Initialize canHit to true at the start of each game.

  // Deal one hidden card to the dealer
  let hiddenCardImg = document.createElement("img");
  hiddenCardImg.src = "./cards/Back.PNG";
  document.getElementById("dealer-cards").append(hiddenCardImg);

  // Deal one visible card to the dealer
  let cardImg = document.createElement("img");
  let card = deck.pop();
  cardImg.src = "./cards/" + card + ".PNG";
  dealerSum += getValue(card);
  dealerAceCount += checkAce(card);
  document.getElementById("dealer-cards").append(cardImg);

  // Deal two cards to the player
  for (let i = 0; i < 2; i++) {
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".PNG";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);
  }
}

function hit() {
  if (!canHit || yourSum >= 21) {
    return;
  }

  let cardImg = document.createElement("img");
  let card = deck.pop();
  cardImg.src = "./cards/" + card + ".PNG";
  yourSum += getValue(card);
  yourAceCount += checkAce(card);
  document.getElementById("your-cards").append(cardImg);

  if (reduceAce(yourSum, yourAceCount) > 21) {
    canHit = false;
    document.getElementById("message").textContent = "You busted! You lose. 👾";
  }
}
document.getElementById("hit").addEventListener("click", hit);
document.getElementById("stay").addEventListener("click", stay);

function stay() {
  dealerSum = reduceAce(dealerSum, dealerAceCount);
  yourSum = reduceAce(yourSum, yourAceCount);

  canHit = false;
  document.getElementById("hidden").src = "./cards/" + hidden + ".PNG";

  let message = "";

  if (yourSum > 21) {
    message = "You busted! You lose. 👾";
    dealerScore++;
  } else if (dealerSum > 21) {
    message = "Dealer busted! You win! 🎉";
    playerScore++;
  } else if (yourSum == dealerSum) {
    message = "It's a tie! 🙈";
    draws++;
  } else if (yourSum > dealerSum) {
    message = "You win! 🎉";
    playerScore++;
  } else {
    message = "You lose! 👾";
    dealerScore++;
  }

  document.getElementById("dealer-sum").innerText = dealerSum;
  document.getElementById("your-sum").innerText = yourSum;
  document.getElementById("results").innerText = message;

  updateScoreboard(); // Update the scoreboard after each game round
}

function getValue(card) {
  let data = card.split("-"); // "4-C" -> ["4", "C"]
  let value = data[0];

  if (isNaN(value)) {
    //A J Q K
    if (value == "A") {
      return 11;
    }
    return 10;
  }
  return parseInt(value);
}

function checkAce(card) {
  if (card[0] == "A") {
    return 1;
  }
  return 0;
}

function reduceAce(playerSum, playerAceCount) {
  while (playerSum > 21 && playerAceCount > 0) {
    playerSum -= 10;
    playerAceCount -= 1;
  }
  return playerSum;
}
function updateScoreboard() {
  document.getElementById("player-wins").textContent = playerScore;
  document.getElementById("dealer-wins").textContent = dealerScore;
  document.getElementById("draws").textContent = draws; // Make sure you have a variable named "draws" to keep track of draws.
}

// Call updateScoreboard when the game starts
updateScoreboard();
