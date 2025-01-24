const startButton = document.getElementById("start-button");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const averageTimeDisplay = document.getElementById("average-time");
const letterDisplay = document.getElementById("letter");

let timeLeft = 10;
let score = 0;
let currentLetter = "";
let gameInterval;
let startTime = 0;
let reactionTimes = [];

const getRandomLetter = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return letters[Math.floor(Math.random() * letters.length)];
};

const updateLetter = () => {
  currentLetter = getRandomLetter();
  letterDisplay.textContent = currentLetter;
  startTime = Date.now(); // Start timing for the next letter
};

const startGame = () => {
  timeLeft = 10;
  score = 0;
  reactionTimes = [];
  scoreDisplay.textContent = `Score: ${score}`;
  averageTimeDisplay.textContent = `Average Reaction Time: N/A`;
  timerDisplay.textContent = `Time Left: ${timeLeft}s`;
  updateLetter();

  document.addEventListener("keydown", handleKeyPress);

  gameInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(gameInterval);
      document.removeEventListener("keydown", handleKeyPress);
      const averageReactionTime = reactionTimes.length
        ? (
            reactionTimes.reduce((a, b) => a + b) /
            reactionTimes.length /
            1000
          ).toFixed(2) // Convert ms to seconds
        : 0;
      alert(
        `Time's up! Your score is ${score}. Average reaction time: ${averageReactionTime} seconds.`
      );
    }
  }, 1000);
};

const handleKeyPress = (event) => {
  const pressedKey = event.key.toUpperCase();
  const reactionTime = Date.now() - startTime;

  if (pressedKey === currentLetter) {
    score++;
    reactionTimes.push(reactionTime);
    scoreDisplay.textContent = `Score: ${score}`;

    // Calculate average reaction time in seconds
    const averageReactionTime = (
      reactionTimes.reduce((a, b) => a + b) /
      reactionTimes.length /
      1000
    ).toFixed(2); // Convert ms to seconds
    averageTimeDisplay.textContent = `Average Reaction Time: ${averageReactionTime} seconds`;

    updateLetter();
  } else {
    letterDisplay.classList.add("wrong");
    setTimeout(() => {
      letterDisplay.classList.remove("wrong");
    }, 200);
  }
};

startButton.addEventListener("click", startGame);
