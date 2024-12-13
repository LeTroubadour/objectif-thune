// Initialize amounts
let availableMoney = 1000; // starting available money

let livretA = 0;
let livretAProfit = 0;
const monthlyLivretARates = [
  // 1980–1988: 96 months at 0.0070833
  0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,
  0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,
  0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,
  0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,
  0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,
  0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,
  0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,
  0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,
  0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,
  0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,
  0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,
  0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,

  // 1988–1996: 96 months at 0.0041667
  0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,
  0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,
  0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,
  0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,
  0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,
  0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,
  0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,
  0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,
  0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,
  0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,
  0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,
  0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,

  // 1996–2004: 96 months at 0.0029167
  0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,
  0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,
  0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,
  0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,
  0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,
  0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,
  0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,
  0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,
  0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,
  0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,
  0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,
  0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,

  // 2004–2012: 96 months at 0.0016667
  0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,
  0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,
  0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,
  0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,
  0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,
  0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,
  0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,
  0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,
  0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,
  0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,
  0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,
  0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,

  // 2012–2020: 96 months at 0.000625
  0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,
  0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,
  0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,
  0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,
  0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,
  0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,
  0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,
  0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,
  0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,
  0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,
  0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,
  0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625
];

let obligations = 0;
let actions = 0;

let currentMonthIndex = 0; // 0 = first month
let currentYearIndex = 1;  // 1 = first year
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
  currentYearEl.textContent = `Année ${currentYearIndex} sur ${totalYears}`;
  availableMoneyEl.textContent = `${availableMoney.toFixed(2)} €`;
  
  const totalWealth = availableMoney + livretA + obligations + actions;
  totalWealthEl.textContent = `${totalWealth.toFixed(2)} €`;

  livretAEl.textContent = `${livretA.toFixed(2)} € investis`;
  const livretAProfitEl = document.getElementById('livret-a-profit');
  livretAProfitEl.textContent = `${livretAProfit.toFixed(2)} € de profit`;
  
  obligationsEl.textContent = `${obligations.toFixed(2)} € investis`;
  actionsEl.textContent = `${actions.toFixed(2)} € investis`;

  // Show/hide withdraw buttons
  withdrawButtonLivretA.style.display = (livretA < 100) ? 'none' : 'inline-block';
  withdrawButtonObligations.style.display = (obligations < 100) ? 'none' : 'inline-block';
  withdrawButtonActions.style.display = (actions < 100) ? 'none' : 'inline-block';
}

// Simulate a monthly increment in available money
setInterval(() => {
  if (currentMonthIndex < (totalYears * 12)) {
    currentMonthIndex++;
  }
  currentYear = Math.floor(currentMonthIndex / 12) + 1; 

  // Add monthly income
  availableMoney += 100; 

  // Calculate interest for Livret A
  calculateLivretAInterest();

  updateUI();
}, 1000); // Every 5 seconds

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

function calculateLivretAInterest() {
  const monthlyRate = monthlyLivretARates[currentMonthIndex];
  const interestEarned = livretA * monthlyRate;
  livretA += interestEarned;
  livretAProfit += interestEarned;
}

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
