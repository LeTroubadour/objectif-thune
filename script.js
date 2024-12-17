// Importation des données
import { MonthlyLivretAReturns } from './livretA_rates.js';
import { MonthlyActionsReturns } from './actions_rates.js';

// Initialisation des montants
const totalYears = 20;      // Durée de la simulation en années
let currentYearIndex = 1;   // 1 = première année
let currentMonthIndex = 0;  // 0 = premier mois

let availableMoney = 10000; // Argent à investir

let livretA = 0;            // Argent investi sur cet actif
let obligations = 0;
let actions = 0;

let livretAProfit = 0;      // Profit cumulé sur cet actif
let actionsProfit = 0;
let obligationsProfit = 0;

const MAX_LIVRET_A = 9950;   // Plafond d'investissement (34950)

// Construction des tables de rendements mensualisés
// Dates de début comprises entre 1980-01 et 2004-01 pour une partie de 20 ans et des données allant de 1980-01 à 2023-12
const randomYear = Math.floor(Math.random() * (2004 - 1980 + 1)) + 1980;
const randomMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
const TARGET_START_DATE = `${randomYear}-${randomMonth}`;
const NUMBER_OF_ENTRIES = totalYears * 12;
    /**
    * Finds the index of the target date in a Monthly Returns array.
    * @param {Array} returns - Array of [date, rate] entries.
    * @param {string} targetDate - Date string in "YYYY-MM" format.
    * @returns {number} - Index of the target date or -1 if not found.
    */
    function findStartIndex(returns, targetDate) {
      return returns.findIndex(entry => entry[0] === targetDate);
    }

const LivretAStartIndex = findStartIndex(MonthlyLivretAReturns, TARGET_START_DATE);
const LivretAEndIndex = LivretAStartIndex + NUMBER_OF_ENTRIES;
const LivretASelectedEntries = MonthlyLivretAReturns.slice(LivretAStartIndex, LivretAEndIndex);
const monthlyLivretARates = LivretASelectedEntries.map(entry => entry[1]);   // Rendements Livret A mensualisés

const ActionsStartIndex = findStartIndex(MonthlyActionsReturns, TARGET_START_DATE);
const ActionsEndIndex = ActionsStartIndex + NUMBER_OF_ENTRIES;
const ActionsSelectedEntries = MonthlyActionsReturns.slice(ActionsStartIndex, ActionsEndIndex);
const monthlyActionsRates = ActionsSelectedEntries.map(entry => entry[1]);   // Rendements S&P 500 mensualisés

// Références aux éléments du DOM
const currentYearEl = document.getElementById('current-year');
const availableMoneyEl = document.getElementById('available-money');
const totalWealthEl = document.getElementById('total-wealth');

const livretAEl = document.getElementById('livret-a-amount');
const livretAProfitEl = document.getElementById('livret-a-profit');
document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggle-view-livretA');
  toggleButton.addEventListener('click', () => {
    const isAmountVisible = livretAEl.classList.contains('active');

    if (isAmountVisible) {
      livretAEl.classList.remove('active');
      livretAProfitEl.classList.add('active');
    } else {
      livretAProfitEl.classList.remove('active');
      livretAEl.classList.add('active');
    }
  });
});
const investButtonLivretA = document.getElementById('invest-button-livretA');
const withdrawButtonLivretA = document.getElementById('withdraw-button-livretA');
const livretAModal = document.getElementById('livretA-modal');
const livretAClose = document.getElementById('livretA-close');
const livretAAmountEl = document.getElementById('livretA-amount');
const livretAModalConfirmAction = document.getElementById('livretA-confirm-action');

const obligationsEl = document.getElementById('obligations-amount');
const investButtonObligations = document.getElementById('invest-button-obligations');
const withdrawButtonObligations = document.getElementById('withdraw-button-obligations');

const actionsEl = document.getElementById('actions-amount');
const actionsProfitEl = document.getElementById('actions-profit');
document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggle-view-actions');
  toggleButton.addEventListener('click', () => {
    const isAmountVisible = actionsEl.classList.contains('active');
    if (isAmountVisible) {
      actionsEl.classList.remove('active');
      actionsProfitEl.classList.add('active');
    } else {
      actionsProfitEl.classList.remove('active');
      actionsEl.classList.add('active');
    }
  });
});
const investButtonActions = document.getElementById('invest-button-actions');
const withdrawButtonActions = document.getElementById('withdraw-button-actions');


// Mise à jour de l'interface utilisateur avec les nouvelles valeurs
function updateUI() {
  currentYearEl.innerHTML = `
  <span class="dashboard-title">Année</span>
  <span class="dashboard-amount">${currentYearIndex}</span> 
  <span class="dashboard-title">sur</span> 
  <span class="dashboard-amount">${totalYears}</span>
  `;
  availableMoneyEl.textContent = `€${availableMoney.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, "'")}`;
  
  const totalWealth = availableMoney + livretA + obligations + actions;
  totalWealthEl.textContent = `€${totalWealth.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, "'")}`;

  livretAEl.textContent = `€${livretA.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, "'")} investis`;
  obligationsEl.textContent = `€${obligations.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, "'")} investis`;
  actionsEl.textContent = `€${actions.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, "'")} investis`;

  livretAProfitEl.textContent = `€${livretAProfit.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, "'")} de profit`;
  actionsProfitEl.textContent = `€${actionsProfit.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, "'")} de profit`;

  // Afficher ou masquer les boutons de retrait en fonction des montants
  withdrawButtonLivretA.style.display = (livretA < 0.01) ? 'none' : 'inline-block';
  withdrawButtonObligations.style.display = (obligations < 100) ? 'none' : 'inline-block';
  withdrawButtonActions.style.display = (actions < 100) ? 'none' : 'inline-block';

  // Désactiver le bouton "Investir" du livret A si le plafond est atteint
  if (livretA >= MAX_LIVRET_A) {
    investButtonLivretA.disabled = true;
  } else {
    investButtonLivretA.disabled = false;
  }
}


// Incrément mensuel de l'argent disponible et calcul des intérêts
setInterval(() => {
  if (currentMonthIndex < (totalYears * 12) - 1) {
    currentMonthIndex++;
  }else {
    // Fin de partie (code temporaire)
    alert("Fin de partie");
  }
  //console.log(`currentMonthIndex: ${currentMonthIndex}`);
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
}, 1250); // Interval en ms qui représente un mois

// Fonction pour ouvrir la modale avec l'action spécifiée
function openLivretAModal(action) {
  livretAModal.style.display = 'block';
  livretAAmountEl.value = '';

  if (action === 'invest') {
    livretAModalConfirmAction.textContent = 'Investir';
    livretAModalConfirmAction.setAttribute('data-action', 'invest');
  } else if (action === 'withdraw') {
    livretAModalConfirmAction.textContent = 'Retirer';
    livretAModalConfirmAction.setAttribute('data-action', 'withdraw');
  }
}
// Gestionnaire d'événements pour ouvrir la modale d'investissement
investButtonLivretA.addEventListener('click', () => {
  openLivretAModal('invest');
});
// Gestionnaire d'événements pour ouvrir la modale de retrait
withdrawButtonLivretA.addEventListener('click', () => {
  openLivretAModal('withdraw');
});
// Gestionnaire d'événements pour fermer la modale avec l'icone
livretAClose.addEventListener('click', () => {
  livretAModal.style.display = 'none';
});
// Gestionnaire d'événements pour fermer la modale en cliquant en dehors
window.addEventListener('click', (event) => {
  if (event.target == livretAModal) {
    livretAModal.style.display = 'none';
  }
});

// Gestionnaire d'événements pour confirmer l'action (invest ou withdraw)
livretAModalConfirmAction.addEventListener('click', () => {
  const action = livretAModalConfirmAction.getAttribute('data-action');
  const amount = parseFloat(livretAAmountEl.value);

  // Vérifier si la saisie est un nombre valide
  if (isNaN(amount) || amount <= 0) {
    alert("Veuillez entrer un montant valide à retirer (supérieur à 0).");
    return;
  }

  if (action === 'invest') {
    // Vérifier si le plafond est déjà atteint ou dépassé
    if (livretA >= MAX_LIVRET_A) {
      alert(`Vous avez atteint le plafond d'investissement dans le Livret A (${MAX_LIVRET_A.toFixed(2)} €).`);
      return;
    }

    // Vérifier si l'investissement actuel dépasserait le plafond
    if (livretA + amount > MAX_LIVRET_A) {
      const montantPossible = MAX_LIVRET_A - livretA;
      alert(`Vous ne pouvez investir que ${montantPossible.toFixed(2)} € supplémentaires dans le Livret A.`);
      return;
    }

    // Vérifier si l'utilisateur a suffisamment d'argent disponible
    if (availableMoney >= amount) {
      availableMoney -= amount;
      livretA += amount;
      updateUI();
      livretAModal.style.display = 'none';
    } else {
      alert("Pas assez d'argent disponible pour investir !");
    }
  } else if (action === 'withdraw') {
    // Vérifier si l'utilisateur a suffisamment d'argent dans le Livret A
    if (livretA >= amount) {
      availableMoney += amount;
      livretA -= amount;
      updateUI();
      livretAModal.style.display = 'none';
    } else {
      alert("Pas assez d'argent sur le Livret A pour retirer !");
    }
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
