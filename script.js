// Initialisation des montants
let availableMoney = 10000; // Argent à investir

let livretA = 0;            // Argent investi sur cet actif
let obligations = 0;
let actions = 0;

let livretAProfit = 0;      // Profit cumulé sur cet actif
let actionsProfit = 0;
let obligationsProfit = 0

const MAX_LIVRET_A = 950;   // Plafond d'investissement (34950)

const totalYears = 40;      // Durée de la simulation en années
let currentYearIndex = 1;   // 1 = première année
let currentMonthIndex = 0;  // 0 = premier mois

// Rendements Livret A 
const yearlyLivretAReturns = [0.0070833, 0.0070833, 0.0070833, 0.0070833,0.0070833, 0.0070833, 0.0070833, 0.0070833,0.0041667, 0.0041667, 0.0041667, 0.0041667,0.0041667, 0.0041667, 0.0041667, 0.0041667,0.0029167, 0.0029167, 0.0029167, 0.0029167,0.0029167, 0.0029167, 0.0029167, 0.0029167,0.0016667, 0.0016667, 0.0016667, 0.0016667,0.0016667, 0.0016667, 0.0016667, 0.0016667,0.000625, 0.000625, 0.000625, 0.000625,0.000625, 0.000625, 0.000625, 0.000625
];
const monthlyLivretARates = convertAnnualToMonthly(yearlyLivretAReturns);

// Rendements MSCI World (1980-2019)
const yearlyMSCIWorldReturns = [0.17, -0.09, 0.14, 0.17, 0.06, 0.31, 0.19, 0.05, 0.16, 0.27, -0.07, 0.17, 0.10, 0.10, 0.02, 0.17, 0.19, 0.19, 0.17, 0.19,-0.10, -0.07, -0.17, 0.27, 0.08, 0.09, 0.17,0.14, -0.40, 0.40, 0.12, -0.05, 0.15, 0.19, 0.07, -0.01, 0.09, 0.22, -0.08, 0.28, 
];
const monthlyActionsRates = convertAnnualToMonthly(yearlyMSCIWorldReturns);


// Références aux éléments du DOM
const availableMoneyEl = document.getElementById('available-money');

const livretAEl = document.getElementById('livret-a-amount');
const livretAProfitEl = document.getElementById('livret-a-profit');
const livretAInvestAmountEl = document.getElementById('livretA-invest-amount');
const investButtonLivretA = document.getElementById('invest-button-livretA');
const withdrawButtonLivretA = document.getElementById('withdraw-button-livretA');

const obligationsEl = document.getElementById('obligations-amount');
const investButtonObligations = document.getElementById('invest-button-obligations');
const withdrawButtonObligations = document.getElementById('withdraw-button-obligations');

const actionsEl = document.getElementById('actions-amount');
const actionsProfitEl = document.getElementById('actions-profit');
const investButtonActions = document.getElementById('invest-button-actions');
const withdrawButtonActions = document.getElementById('withdraw-button-actions');

const currentYearEl = document.getElementById('current-year');
const totalWealthEl = document.getElementById('total-wealth');


// Mise à jour de l'interface utilisateur avec les nouvelles valeurs
function updateUI() {
  currentYearEl.textContent = `Année ${currentYearIndex} sur ${totalYears}`;
  availableMoneyEl.textContent = `${availableMoney.toFixed(2)} €`;
  
  const totalWealth = availableMoney + livretA + obligations + actions;
  totalWealthEl.textContent = `${totalWealth.toFixed(2)} €`;

  livretAEl.textContent = `${livretA.toFixed(2)} € investis`;
  obligationsEl.textContent = `${obligations.toFixed(2)} € investis`;
  actionsEl.textContent = `${actions.toFixed(2)} € investis`;

  livretAProfitEl.textContent = `${livretAProfit.toFixed(2)} € de profit`;
  actionsProfitEl.textContent = `${actionsProfit.toFixed(2)} € de profit`;

  // Afficher ou masquer les boutons de retrait en fonction des montants
  withdrawButtonLivretA.style.display = (livretA < 100) ? 'none' : 'inline-block';
  withdrawButtonObligations.style.display = (obligations < 100) ? 'none' : 'inline-block';
  withdrawButtonActions.style.display = (actions < 100) ? 'none' : 'inline-block';

  // Désactiver le bouton "Investir" du livret A si le plafond est atteint
  if (livretA >= MAX_LIVRET_A) {
    investButtonLivretA.disabled = true;
    investButtonLivretA.style.background = '#95a5a6'; // Couleur grise pour indiquer l'état désactivé
    investButtonLivretA.style.cursor = 'pointer';
  } else {
    investButtonLivretA.disabled = false;
    investButtonLivretA.style.background = '#2ecc71';
    investButtonLivretA.style.cursor = 'pointer';
  }
  // Afficher ou masquer le message de plafond du livret A
  const livretACapMessageEl = document.getElementById('livret-a-cap-message');
  if (livretA >= MAX_LIVRET_A) {
    livretACapMessageEl.style.display = 'block';
  } else {
    livretACapMessageEl.style.display = 'none';
  }
}


// Incrément mensuel de l'argent disponible et calcul des intérêts
setInterval(() => {
  if (currentMonthIndex < (totalYears * 12)) {
    currentMonthIndex++;
  }
  currentYearIndex = Math.floor(currentMonthIndex / 12) + 1; 

  availableMoney += 100; 

  calculateLivretAInterest();
  calculateActionsReturns();

  updateUI();
}, 1000); // Toutes les secondes représentent un mois


// Gestionnaire d'événements pour investir dans le Livret A
investButtonLivretA.addEventListener('click', () => {
  const investAmountInput = livretAInvestAmountEl.value; // Récupérer la valeur saisie
  const investAmount = parseFloat(investAmountInput);

  // Vérifier si la saisie est un nombre valide
  if (isNaN(investAmount) || investAmount <= 0) {
    alert("Veuillez entrer un montant valide à investir (supérieur à 0).");
    return;
  }

  // Vérifier si le plafond est déjà atteint ou dépassé
  if (livretA >= MAX_LIVRET_A) {
    alert(`Vous avez atteint le plafond d'investissement dans le Livret A (${MAX_LIVRET_A.toFixed(2)} €).`);
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

// Gestionnaire d'événements pour retirer du Livret A
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

// Gestionnaire d'événements pour investir dans les Obligations
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

// Gestionnaire d'événements pour retirer des Obligations
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

// Gestionnaire d'événements pour investir dans les Actions
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

// Gestionnaire d'événements pour retirer des Actions
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

// Fonction pour convertir un tableau de rendements annuels en un tableau de rendements mensuels
function convertAnnualToMonthly(annualReturns) {
  const expandedMonthlyRates = [];
  annualReturns.forEach(annual => {
    const monthlyRate = Math.pow(1 + annual, 1 / 12) - 1;
    for (let i = 0; i < 12; i++) {
      expandedMonthlyRates.push(parseFloat(monthlyRate.toFixed(6)));
    }
  });
  return expandedMonthlyRates;
}

// Initial UI update
updateUI();
