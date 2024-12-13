// Initialize amounts
let availableMoney = 1000; // starting available money

let livretA = 0;
let livretAProfit = 0;
const MAX_LIVRET_A = 950; // Plafond d'investissement pour le Livret A et LDD en euros: 34950
const monthlyLivretARates = [
  // 1980–1988: 96 months at 0.0070833
  0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,
  0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,0.0070833,
  // 1988–1996: 96 months at 0.0041667
  0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,
  0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,
  0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,0.0041667,
  // 1996–2004: 96 months at 0.0029167
  0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,
  0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,
  0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,0.0029167,
  // 2004–2012: 96 months at 0.0016667
  0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,
  0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,
  0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,0.0016667,
  // 2012–2020: 96 months at 0.000625
  0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,
  0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,
  0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625,0.000625
];

let obligations = 0;

let actions = 0;
let actionsProfit = 0;
const monthlyActionsRates = [
  -0.007536, -0.007536, -0.007536, -0.007536, -0.007536, -0.007536,-0.007536, -0.007536, -0.007536, -0.007536, -0.007536, -0.007536,0.011034, 0.011034, 0.011034, 0.011034, 0.011034, 0.011034,0.011034, 0.011034, 0.011034, 0.011034, 0.011034, 0.011034,0.013229, 0.013229, 0.013229, 0.013229, 0.013229, 0.013229,0.013229, 0.013229, 0.013229, 0.013229, 0.013229, 0.013229,0.004872, 0.004872, 0.004872, 0.004872, 0.004872, 0.004872,0.004872, 0.004872, 0.004872, 0.004872, 0.004872,
  0.004872,  0.022839, 0.022839, 0.022839, 0.022839, 0.022839, 0.022839,0.022839, 0.022839, 0.022839, 0.022839, 0.022839, 0.022839,0.014696, 0.014696, 0.014696, 0.014696, 0.014696, 0.014696,0.014696, 0.014696, 0.014696, 0.014696, 0.014696, 0.014696,
  0.004075, 0.004075, 0.004075, 0.004075, 0.004075, 0.004075,0.004075, 0.004075, 0.004075, 0.004075, 0.004075, 0.004075,0.01246, 0.01246, 0.01246, 0.01246, 0.01246, 0.01246,0.01246, 0.01246, 0.01246, 0.01246, 0.01246, 0.01246,0.020202, 0.020202, 0.020202, 0.020202, 0.020202, 0.020202,0.020202, 0.020202, 0.020202, 0.020202, 0.020202, 0.020202,-0.006000, -0.006000, -0.006000, -0.006000, -0.006000, -0.006000,-0.006000, -0.006000, -0.006000, -0.006000, -0.006000, -0.006000,
  0.013229, 0.013229, 0.013229, 0.013229, 0.013229, 0.013229,0.013229, 0.013229, 0.013229, 0.013229, 0.013229, 0.013229,0.007942, 0.007942, 0.007942, 0.007942, 0.007942, 0.007942,0.007942, 0.007942, 0.007942, 0.007942, 0.007942, 0.007942,0.007942, 0.007942, 0.007942, 0.007942, 0.007942, 0.007942,0.007942, 0.007942, 0.007942, 0.007942, 0.007942, 0.007942,0.001665, 0.001665, 0.001665, 0.001665, 0.001665, 0.001665,0.001665, 0.001665, 0.001665, 0.001665, 0.001665, 0.001665,
  0.013229, 0.013229, 0.013229, 0.013229, 0.013229, 0.013229,0.013229, 0.013229, 0.013229, 0.013229, 0.013229, 0.013229,0.014696, 0.014696, 0.014696, 0.014696, 0.014696, 0.014696,0.014696, 0.014696, 0.014696, 0.014696, 0.014696, 0.014696,0.014696, 0.014696, 0.014696, 0.014696, 0.014696, 0.014696,0.014696, 0.014696, 0.014696, 0.014696, 0.014696, 0.014696,0.013229, 0.013229, 0.013229, 0.013229, 0.013229, 0.013229,0.013229, 0.013229, 0.013229, 0.013229, 0.013229, 0.013229,
  0.014696, 0.014696, 0.014696, 0.014696, 0.014696, 0.014696,0.014696, 0.014696, 0.014696, 0.014696, 0.014696, 0.014696,-0.0087, -0.0087, -0.0087, -0.0087, -0.0087, -0.0087,-0.0087, -0.0087, -0.0087, -0.0087, -0.0087, -0.0087,-0.0060, -0.0060, -0.0060, -0.0060, -0.0060, -0.0060,-0.0060, -0.0060, -0.0060, -0.0060, -0.0060, -0.0060,-0.0154, -0.0154, -0.0154, -0.0154, -0.0154, -0.0154,-0.0154, -0.0154, -0.0154, -0.0154, -0.0154, -0.0154,0.020202, 0.020202, 0.020202, 0.020202, 
  0.020202, 0.020202,0.020202, 0.020202, 0.020202, 0.020202, 0.020202, 0.020202,0.00644, 0.00644, 0.00644, 0.00644, 0.00644, 0.00644,0.00644, 0.00644, 0.00644, 0.00644, 0.00644, 0.00644,0.00721, 0.00721, 0.00721, 0.00721, 0.00721, 0.00721,0.00721, 0.00721, 0.00721, 0.00721, 0.00721, 0.00721,0.01323, 0.01323, 0.01323, 0.01323, 0.01323, 0.01323,0.01323, 0.01323, 0.01323, 0.01323, 0.01323, 0.01323,0.0110, 0.0110, 0.0110, 0.0110, 0.0110, 0.0110,0.0110, 0.0110, 0.0110, 0.0110,
  0.0110, 0.0110,-0.0420, -0.0420, -0.0420, -0.0420, -0.0420, -0.0420,-0.0420, -0.0420, -0.0420, -0.0420, -0.0420, -0.0420,0.0284, 0.0284, 0.0284, 0.0284, 0.0284, 0.0284,0.0284, 0.0284, 0.0284, 0.0284, 0.0284, 0.0284,0.0095, 0.0095, 0.0095, 0.0095, 0.0095, 0.0095,0.0095, 0.0095, 0.0095, 0.0095, 0.0095, 0.0095,-0.00425, -0.00425, -0.00425, -0.00425, -0.00425, -0.00425,-0.00425, -0.00425, -0.00425, -0.00425, -0.00425, -0.00425,0.01178, 0.01178, 0.01178, 0.01178, 0.01178, 0.01178,0.01178, 0.01178, 0.01178, 0.01178, 0.01178, 0.01178,0.0146, 0.0146, 0.0146, 0.0146, 0.0146, 0.0146,0.0146, 0.0146, 0.0146, 0.0146, 0.0146, 0.0146,0.0057, 0.0057, 0.0057, 0.0057, 0.0057, 0.0057,0.0057, 0.0057, 0.0057, 0.0057, 0.0057, 0.0057,-0.000837, -0.000837, -0.000837, -0.000837, -0.000837, -0.000837,-0.000837, -0.000837, -0.000837, -0.000837, -0.000837, -0.000837,0.00721, 0.00721, 0.00721, 0.00721, 0.00721, 0.00721,0.00721, 0.00721, 0.00721, 0.00721, 0.00721, 0.00721,0.0167, 0.0167, 0.0167, 0.0167, 0.0167, 0.0167,0.0167, 0.0167, 0.0167, 0.0167, 0.0167, 0.0167,-0.0069, -0.0069, -0.0069, -0.0069, -0.0069, -0.0069,-0.0069, -0.0069, -0.0069, -0.0069, -0.0069, -0.0069,0.0208, 0.0208, 0.0208, 0.0208, 0.0208, 0.0208,0.0208, 0.0208, 0.0208, 0.0208, 0.0208, 0.0208,
];

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
  const actionsProfitEl = document.getElementById('actions-profit');
  actionsProfitEl.textContent = `${actionsProfit.toFixed(2)} € de profit`;

  // Show/hide withdraw buttons
  withdrawButtonLivretA.style.display = (livretA < 100) ? 'none' : 'inline-block';
  withdrawButtonObligations.style.display = (obligations < 100) ? 'none' : 'inline-block';
  withdrawButtonActions.style.display = (actions < 100) ? 'none' : 'inline-block';

  // Desable invest button if threshold reached
  if (livretA >= MAX_LIVRET_A) {
    investButtonLivretA.disabled = true;
    investButtonLivretA.style.background = '#95a5a6'; // Changer la couleur pour indiquer l'état désactivé
    investButtonLivretA.style.cursor = 'pointer';
  } else {
    investButtonLivretA.disabled = false;
    investButtonLivretA.style.background = '#2ecc71';
    investButtonLivretA.style.cursor = 'pointer';
  }
}

// Simulate a monthly increment in available money
setInterval(() => {
  if (currentMonthIndex < (totalYears * 12)) {
    currentMonthIndex++;
  }
  currentYearIndex = Math.floor(currentMonthIndex / 12) + 1; 

  // Add monthly income
  availableMoney += 100; 

  // Calculate monthly interest/gains
  calculateLivretAInterest();
  calculateActionsReturns();

  updateUI();
}, 1000); // Every 5 seconds

// Invest in Livret A
investButtonLivretA.addEventListener('click', () => {
  const investAmount = 100;
  // Vérifier si le plafond est déjà atteint ou dépassé
  if (livretA >= MAX_LIVRET_A) {
    alert("Vous avez atteint le plafond d'investissement dans le Livret A (34 950 €).");
    return;
  }
  // Vérifier si l'investissement actuel dépasserait le plafond
  if (livretA + investAmount > MAX_LIVRET_A) {
    const montantPossible = MAX_LIVRET_A - livretA;
    alert(`Vous ne pouvez investir que ${montantPossible.toFixed(2)} € supplémentaires dans le Livret A.`);
    return;
  }
  // Vérifier si l'utilisateur a suffisamment d'argent disponible
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

function calculateActionsReturns() {
  const monthlyRate = monthlyActionsRates[currentMonthIndex];
  const interestEarned = actions * monthlyRate;
  actions += interestEarned;
  actionsProfit += interestEarned;
}

// Initial UI update
updateUI();
