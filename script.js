// Initialize amounts
let availableMoney = 1000; // starting available money

let livretA = 0;
let obligations = 0;
let actions = 0;

let currentYear = 1;      // Année courante
const totalYears = 40;    // Durée de la partie en années

// Get references to the DOM elements
const availableMoneyEl = document.getElementById('available-money');

const livretAEl = document.getElementById('livret-a-amount');
const investButtonLivretA = document.getElementById('invest-button-livretA');
const withdrawButtonLivretA = document.getElementById('withdraw-button-livretA');

const obligationsEl = document.getElementById('obligations-amount');
const investButtonObligations = document.getElementById('invest-button-obligations');
const withdrawButtonObligations = document.getElementById('withdraw-button-obligations');

const actionsEl = document.getElementById('actions-amount');
const investButtonActions = document.getElementById('invest-button-actions');
const withdrawButtonActions = document.getElementById('withdraw-button-actions');

const currentYearEl = document.getElementById('current-year');
const totalWealthEl = document.getElementById('total-wealth');

// Update the UI to reflect current amounts
function updateUI() {
  currentYearEl.textContent = `Année ${currentYear} sur ${totalYears}`;
  availableMoneyEl.textContent = `${availableMoney} €`;
  const totalWealth = availableMoney + livretA + obligations + actions;
  totalWealthEl.textContent = `${totalWealth} €`;

  livretAEl.textContent = `${livretA} € investis`;
  obligationsEl.textContent = `${obligations} € investis`;
  actionsEl.textContent = `${actions} € investis`;

  // Show/hide withdraw button for Livret A
  withdrawButtonLivretA.style.display = (livretA < 100) ? 'none' : 'inline-block';

  // Show/hide withdraw button for Obligations
  withdrawButtonObligations.style.display = (obligations < 100) ? 'none' : 'inline-block';

  // Show/hide withdraw button for Actions
  withdrawButtonActions.style.display = (actions < 100) ? 'none' : 'inline-block';
}

// Simulate a monthly increment in available money
setInterval(() => {
  availableMoney += 100;
  if (currentYear < totalYears) {
    currentYear++;
  }
  updateUI();
}, 5000); // Every 5 seconds

// Invest in Livret A
investButtonLivretA.addEventListener('click', () => {
  const investAmount = 100;
  if (availableMoney >= investAmount) {
    availableMoney -= investAmount;
    livretA += investAmount;
    updateUI();
  } else {
    alert("Pas assez d'argent disponible pour investir !");
  }
});

// Withdraw from Livret A
withdrawButtonLivretA.addEventListener('click', () => {
  const withdrawAmount = 100;
  if (livretA >= withdrawAmount) {
    livretA -= withdrawAmount;
    availableMoney += withdrawAmount;
    updateUI();
  } else {
    alert("Pas assez d'argent sur le Livret A pour retirer !");
  }
});

// Invest in Obligations
investButtonObligations.addEventListener('click', () => {
  const investAmount = 100;
  if (availableMoney >= investAmount) {
    availableMoney -= investAmount;
    obligations += investAmount;
    updateUI();
  } else {
    alert("Pas assez d'argent disponible pour investir !");
  }
});

// Withdraw from Obligations
withdrawButtonObligations.addEventListener('click', () => {
  const withdrawAmount = 100;
  if (obligations >= withdrawAmount) {
    obligations -= withdrawAmount;
    availableMoney += withdrawAmount;
    updateUI();
  } else {
    alert("Pas assez d'argent sur les Obligations pour retirer !");
  }
});

// Invest in Actions
investButtonActions.addEventListener('click', () => {
  const investAmount = 100;
  if (availableMoney >= investAmount) {
    availableMoney -= investAmount;
    actions += investAmount;
    updateUI();
  } else {
    alert("Pas assez d'argent disponible pour investir !");
  }
});

// Withdraw from Actions
withdrawButtonActions.addEventListener('click', () => {
  const withdrawAmount = 100;
  if (actions >= withdrawAmount) {
    actions -= withdrawAmount;
    availableMoney += withdrawAmount;
    updateUI();
  } else {
    alert("Pas assez d'argent sur les Actions pour retirer !");
  }
});

// Initial UI update
updateUI();
