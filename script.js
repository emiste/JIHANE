const startMissionButton = document.getElementById("startMission");
const newChallengeButton = document.getElementById("newChallenge");
const checkAnswerButton = document.getElementById("checkAnswer");
const answerInput = document.getElementById("answerInput");
const challengeText = document.getElementById("challengeText");
const feedback = document.getElementById("feedback");
const shieldsDisplay = document.getElementById("shields");
const starsDisplay = document.getElementById("stars");
const progressDisplay = document.getElementById("progress");

let shields = 3;
let stars = 0;
let progress = 0;
let currentChallenge = null;

const bonuses = [
  { label: "Turbo", effect: () => updateProgress(3) },
  { label: "Bouclier", effect: () => updateShields(1) },
  { label: "Table magique", effect: () => feedbackMessage("Tu choisis la prochaine table !", "success") },
  { label: "Pause", effect: () => feedbackMessage("Respire un coup avant le prochain défi.", "warning") },
];

function getRandomTable() {
  return Math.floor(Math.random() * 8) + 2;
}

function getRandomMultiplier() {
  return Math.floor(Math.random() * 9) + 1;
}

function updateDisplay() {
  shieldsDisplay.textContent = shields;
  starsDisplay.textContent = stars;
  progressDisplay.textContent = `${progress} / 30`;
}

function feedbackMessage(message, tone) {
  feedback.textContent = message;
  feedback.className = `feedback ${tone}`;
}

function updateProgress(amount) {
  progress = Math.min(30, progress + amount);
  updateDisplay();
  if (progress >= 30) {
    feedbackMessage("Bravo ! Tu as atteint la planète finale !", "success");
  }
}

function updateShields(amount) {
  shields = Math.min(3, Math.max(0, shields + amount));
  updateDisplay();
  if (shields === 0) {
    feedbackMessage("Oh non ! Plus de boucliers. Relance la mission !", "danger");
  }
}

function generateChallenge() {
  const table = getRandomTable();
  const multiplier = getRandomMultiplier();
  currentChallenge = { table, multiplier };
  challengeText.textContent = `${table} × ${multiplier} = ?`;
  answerInput.value = "";
  answerInput.focus();
  feedbackMessage("Bonne chance, astronaute !", "warning");
}

function applyBonus() {
  if (progress > 0 && progress % 5 === 0) {
    const bonus = bonuses[Math.floor(Math.random() * bonuses.length)];
    feedbackMessage(`Bonus obtenu : ${bonus.label} !`, "success");
    bonus.effect();
  }
}

function handleAnswer() {
  if (!currentChallenge) {
    feedbackMessage("Commence la mission pour obtenir un défi.", "warning");
    return;
  }

  const answer = Number(answerInput.value);
  if (!answerInput.value) {
    feedbackMessage("Entre une réponse pour continuer.", "warning");
    return;
  }

  const expected = currentChallenge.table * currentChallenge.multiplier;
  if (answer === expected) {
    stars += 1;
    updateProgress(1 + Math.floor(expected / 10));
    updateDisplay();
    feedbackMessage("Super ! Ton vaisseau avance !", "success");
    applyBonus();
    generateChallenge();
  } else {
    updateShields(-1);
    feedbackMessage(`Presque ! La bonne réponse était ${expected}.`, "danger");
  }
}

startMissionButton.addEventListener("click", () => {
  shields = 3;
  stars = 0;
  progress = 0;
  updateDisplay();
  feedbackMessage("Mission lancée !", "success");
  generateChallenge();
});

newChallengeButton.addEventListener("click", () => {
  generateChallenge();
});

checkAnswerButton.addEventListener("click", handleAnswer);

answerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleAnswer();
  }
});

updateDisplay();
