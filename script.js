// Importation des données
import { yearlyLivretAReturns } from './livretA_rates.js';
import { yearlyMSCIWorldReturns } from './actions_rates.js';

// Initialisation des montants
const totalYears = 40;      // Durée de la simulation en années
let currentYearIndex = 1;   // 1 = première année
let currentMonthIndex = 0;  // 0 = premier mois

let availableMoney = 10000; // Argent à investir

let livretA = 0;            // Argent investi sur cet actif
let obligations = 0;
let actions = 0;

let livretAProfit = 0;      // Profit cumulé sur cet actif
let actionsProfit = 0;
let obligationsProfit = 0;

const MAX_LIVRET_A = 950;   // Plafond d'investissement (34950)

const monthlyLivretARates = convertAnnualToMonthly(yearlyLivretAReturns);   // Rendements Livret A mensualisés
const monthlyActionsRates = convertAnnualToMonthly(yearlyMSCIWorldReturns); // Rendements MSCI World (1980-2019) mensualisés

// Références aux éléments du DOM
const currentYearEl = document.getElementById('current-year');
const availableMoneyEl = document.getElementById('available-money');
const totalWealthEl = document.getElementById('total-wealth');

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
    investButtonLivretA.style.cursor = 'not-allowed';
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
  if (currentMonthIndex < (totalYears * 12) - 1) {
    currentMonthIndex++;
  }
  console.log(`currentMonthIndex: ${currentMonthIndex}`);
  currentYearIndex = Math.floor(currentMonthIndex / 12) + 1; 

  availableMoney += 100; 

  // Appliquer les rendements mensuels pour Livret A
  const livretAMonthlyRate = monthlyLivretARates[currentMonthIndex];
  const livretAResult = applyMonthlyReturn(livretA, livretAMonthlyRate, livretAProfit);
  livretA = livretAResult.newBalance;
  livretAProfit = livretAResult.newProfit;

  // Appliquer les rendements mensuels pour Actions
  const actionsMonthlyRate = monthlyActionsRates[currentMonthIndex];
  const actionsResult = applyMonthlyReturn(actions, actionsMonthlyRate, actionsProfit);
  actions = actionsResult.newBalance;
  actionsProfit = actionsResult.newProfit;

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

/**
 * Convertit un tableau de rendements annuels en rendements mensuels.
 * @param {number[]} annualReturns - Tableau des rendements annuels (par exemple, [0.17, -0.09]).
 * @returns {number[]} - Tableau des rendements mensuels, avec chaque rendement annuel converti en 12 rendements mensuels équivalents.
 */
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

/**
 * Calcule le rendement mensuel d'un investissement.
 * @param {number} balance - Le solde actuel de l'investissement.
 * @param {number} rate - Le taux de rendement mensuel (ex. 0.005 pour 0,5%).
 * @param {number} profit - Le profit cumulé jusqu'à présent.
 * @returns {Object} - Un objet contenant le nouveau solde et le nouveau profit cumulé.
 */
function applyMonthlyReturn(balance, rate, profit) {
  const interestEarned = balance * rate;
  const newBalance = balance + interestEarned;
  const newProfit = profit + interestEarned;
  return { newBalance, newProfit };
}

// Mise à jour initiale de l'interface utilisateur
updateUI();
