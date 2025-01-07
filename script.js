// Importation des données
import { MonthlyLivretAReturns } from './livretA_rates.js';
import { MonthlyActionsReturns } from './actions_rates.js';

// Initialisation des variables communes
const initialAge = 22;
const totalYears = 20;      // Durée de la simulation en années
let currentYearIndex = 1;   // 1 = première année
let currentMonthIndex = 0;  // 0 = premier mois
let gameInterval;           // Variable pour stocker l'intervalle du jeu
let availableMoney = 10000; // Argent disponible initial

// Initialisation des variables pour le module livret A
let livretA = 0;
let livretAProfit = 0;
const MAX_LIVRET_A = 9950;

// Initialisation des variables pour le module obligations
let obligations = 0;
let obligationsProfit = 0;

// Initialisation des variables pour le module actions
let actions = 0;
let actionsProfit = 0;

// Initialisation des variables pour le module résidence Principale
let residenceInvested = false;
let residenceInvestedAmount = 0;
let residenceProfit = 0;
const residenceSurfaceCible = 50;         // Montant en m2 par défaut avant création table
const residenceArgentNecessaire = 10000;  // Montant en € par défaut avant création table

// Construction des tables de rendements mensualisés
// Dates de début comprises entre 1980-01 et 2004-01 pour une partie de 20 ans et des données allant de 1980-01 à 2023-12
const randomYear = Math.floor(Math.random() * (2004 - 1980 + 1)) + 1980;
const randomMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
const TARGET_START_DATE = `${randomYear}-${randomMonth}`;
const NUMBER_OF_ENTRIES = totalYears * 12;
  /**
  * Trouve l'index de la date cible dans un tableau de rendements mensuels.
  * @param {Array} returns - Tableau des rendements mensuels [date, taux].
  * @param {string} targetDate - Date cible au format "YYYY-MM".
  * @returns {number} - Index de la date cible ou -1 si non trouvé.
  */
  function findStartIndex(returns, targetDate) {
   return returns.findIndex(entry => entry[0] === targetDate);
  }
  // Table de rendements du Livret A mensualisés
  const LivretAStartIndex = findStartIndex(MonthlyLivretAReturns, TARGET_START_DATE);
  const LivretAEndIndex = LivretAStartIndex + NUMBER_OF_ENTRIES;
  const LivretASelectedEntries = MonthlyLivretAReturns.slice(LivretAStartIndex, LivretAEndIndex);
  const monthlyLivretARates = LivretASelectedEntries.map(entry => entry[1]);
  // Table de rendements du module Actions (S&P 500) mensualisés
  const ActionsStartIndex = findStartIndex(MonthlyActionsReturns, TARGET_START_DATE);
  const ActionsEndIndex = ActionsStartIndex + NUMBER_OF_ENTRIES;
  const ActionsSelectedEntries = MonthlyActionsReturns.slice(ActionsStartIndex, ActionsEndIndex);
  const monthlyActionsRates = ActionsSelectedEntries.map(entry => entry[1]);

// Références aux éléments du DOM
  const currentYearEl = document.getElementById('current-year');
  const availableMoneyEl = document.getElementById('available-money');
  const totalWealthEl = document.getElementById('total-wealth');

  const livretAEl = document.getElementById('livret-a-amount');
  const livretAProfitEl = document.getElementById('livret-a-profit');
  const investButtonLivretA = document.getElementById('invest-button-livretA');
  const withdrawButtonLivretA = document.getElementById('withdraw-button-livretA');

  const obligationsEl = document.getElementById('obligations-amount');
  const investButtonObligations = document.getElementById('invest-button-obligations');
  const withdrawButtonObligations = document.getElementById('withdraw-button-obligations');

  const actionsEl = document.getElementById('actions-amount');
  const actionsProfitEl = document.getElementById('actions-profit');
  const investButtonActions = document.getElementById('invest-button-actions');
  const withdrawButtonActions = document.getElementById('withdraw-button-actions');

  const residenceEL= document.getElementById('residence-investedAmount');
  const residenceProfitEL= document.getElementById('residence-profit');

  const overlay = document.getElementById('overlay');
  const continueButton = document.getElementById('continue-button');

// Mise à jour de l'interface utilisateur avec les nouvelles valeurs
function updateUI() {

  const age = initialAge + currentYearIndex - 1;

  // MAJ Dashboard
  currentYearEl.innerHTML = `
  <span class="dashboard-title">Année</span>
  <span class="dashboard-amount">${currentYearIndex}</span> 
  <span class="dashboard-title">sur</span> 
  <span class="dashboard-amount">${totalYears}</span>
  `;
  availableMoneyEl.textContent = `€${availableMoney.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, "'")}`;
  const totalWealth = availableMoney + livretA + obligations + actions;
  totalWealthEl.textContent = `€${totalWealth.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, "'")}`;

  // MAJ module livret A
  livretAEl.textContent = `€${livretA.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, "'")} investis`;
  livretAProfitEl.textContent = `€${livretAProfit.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, "'")} de profit`;
  withdrawButtonLivretA.style.display = (livretA < 0.01) ? 'none' : 'inline-block';
  if (livretA >= MAX_LIVRET_A) {investButtonLivretA.disabled = true;} else {investButtonLivretA.disabled = false;}

  // MAJ module obligations
  obligationsEl.textContent = `€${obligations.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, "'")} investis`;
  withdrawButtonObligations.style.display = (obligations < 100) ? 'none' : 'inline-block';

  // MAJ module actions
  actionsEl.textContent = `€${actions.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, "'")} investis`;
  actionsProfitEl.textContent = `€${actionsProfit.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, "'")} de profit`;
  withdrawButtonActions.style.display = (actions < 100) ? 'none' : 'inline-block';

  // MAJ module résidence principale
  document.getElementById('residence-age').textContent = age;
  document.getElementById('residence-taille').textContent = residenceSurfaceCible;

  if (residenceInvested) {
    document.getElementById('residence-investedAmount').textContent = `${residenceInvestedAmount.toLocaleString('fr-FR')} € investis`;
    document.getElementById('residence-profit').textContent = `${residenceProfit.toLocaleString('fr-FR')} € de profit`;
  }

}

// Gestion des interactions
document.addEventListener('DOMContentLoaded', () => {

  // Affichage montant investis / profits livret A
  const toggleButtonLivretA = document.getElementById('toggle-view-livretA');
  toggleButtonLivretA.addEventListener('click', () => {
    const isAmountVisible = livretAEl.classList.contains('active');
    if (isAmountVisible) {
      livretAEl.classList.remove('active');
      livretAProfitEl.classList.add('active');
    } else {
      livretAProfitEl.classList.remove('active');
      livretAEl.classList.add('active');
    }
  });

  // Affichage montant investis / profits actions
  const toggleButtonActions = document.getElementById('toggle-view-actions');
  toggleButtonActions.addEventListener('click', () => {
    const isAmountVisible = actionsEl.classList.contains('active');
    if (isAmountVisible) {
      actionsEl.classList.remove('active');
      actionsProfitEl.classList.add('active');
    } else {
      actionsProfitEl.classList.remove('active');
      actionsEl.classList.add('active');
    }
  });

  // Affichage montant investis / profits residence principale
  const toggleButtonResidence = document.getElementById('toggle-view-residence');
  toggleButtonResidence.addEventListener('click', () => {
    const isAmountVisible = residenceEL.classList.contains('active');
    if (isAmountVisible) {
      residenceEL.classList.remove('active');
      residenceProfitEL.classList.add('active');
    } else {
      residenceProfitEL.classList.remove('active');
      residenceEL.classList.add('active');
    }
  });

  /**
 * Ouvre le formulaire d'action ppour définir le montant à investir ou retirer des modules livret A et Actions
 * @param {HTMLElement} button - Le bouton cliqué.
 */
  function openActionForm(button) {
    // Trouver le bouton parent
    const module = button.getAttribute('data-module');
    const action = button.getAttribute('data-action');
    // Trouver le module parent
    const moduleElement = button.closest('.module');
    // Trouver le formulaire parent
    const actionForm = moduleElement.querySelector('.action-form');
    
    // Masquer les boutons Investir et Retirer
    const investButton = moduleElement.querySelector(`.action-button[data-action="invest"]`);
    const withdrawButton = moduleElement.querySelector(`.action-button[data-action="withdraw"]`);
    investButton.classList.add('hidden');
    withdrawButton.classList.add('hidden');

    // Trouver les éléments dans le formulaire parent
    const actionFormClose = actionForm.querySelector('.close-icon');
    const actionAmountInput = actionForm.querySelector('.action-amount');
    const actionMaxButton = actionForm.querySelector('.max-button');
    const actionConfirmButton = actionForm.querySelector('.confirm-button');

    // Afficher et configurer le formulaire
    actionForm.classList.add('show');
    actionAmountInput.value = '';
    actionAmountInput.placeholder = `Montant`;
    actionAmountInput.focus();
    
    // Gestionnaire pour fermer le formulaire via la croix
    actionFormClose.onclick = () => {
      closeActionForm(actionForm, investButton, withdrawButton);
    };
  
    // Gestionnaire pour fermer le formulaire en cliquant en dehors
    document.addEventListener('click', function handleOutsideClick(event) {
      if (!actionForm.contains(event.target) && !button.contains(event.target)) {
        closeActionForm(actionForm, investButton, withdrawButton);
        document.removeEventListener('click', handleOutsideClick);
      }
    });
  
    // Gestionnaire du bouton MAX
    actionMaxButton.onclick = () => {
      let maxAmount = 0;
      if (action === 'invest') {
        if (module === 'livretA') {
          maxAmount = Math.min(availableMoney, MAX_LIVRET_A - livretA);
        } else if (module === 'actions') {
          maxAmount = availableMoney;
        }
      } else if (action === 'withdraw') {
        if (module === 'livretA') {
          maxAmount = livretA;
        } else if (module === 'actions') {
          maxAmount = actions;
        }
      }
      maxAmount = Math.max(maxAmount, 0);
      actionAmountInput.value = maxAmount;
    };
  
    // Gestionnaire pour la confirmation de l'action
    actionConfirmButton.onclick = () => {
      const amount = parseFloat(actionAmountInput.value);
    
      if (isNaN(amount) || amount <= 0) {
        alert("Veuillez entrer un montant valide (supérieur à 0).");
        return;
      }
      
      if (action === 'invest') {
        if (module === 'livretA') {
          if (livretA >= MAX_LIVRET_A) {
            alert(`Vous avez atteint le plafond d'investissement dans le Livret A (${MAX_LIVRET_A.toFixed(2)} €).`);
            return;
          }

          if (livretA + amount > MAX_LIVRET_A) {
            const montantPossible = MAX_LIVRET_A - livretA;
            alert(`Vous ne pouvez investir que ${montantPossible.toFixed(2)} € supplémentaires dans le Livret A.`);
            return;
          }
        }
        if (availableMoney >= amount) {
          availableMoney -= amount;
          if (module === 'livretA') {
            livretA += amount;
          } else if (module === 'actions') {
            actions += amount;
          }
          updateUI();
          closeActionForm(actionForm, investButton, withdrawButton);
        } else {
          alert("Pas assez d'argent disponible pour investir !");
        }
      } else if (action === 'withdraw') {
        if (module === 'livretA') {
          if (livretA >= amount) {
            livretA -= amount;
            availableMoney += amount;
            updateUI();
            closeActionForm(actionForm, investButton, withdrawButton);
          } else {
            alert("Pas assez d'argent sur le Livret A pour retirer !");
          }
        } else if (module === 'actions') {
          if (actions >= amount) {
            actions -= amount;
            availableMoney += amount;
            updateUI();
            closeActionForm(actionForm, investButton, withdrawButton);
          } else {
            alert("Pas assez d'argent sur les Actions pour retirer !");
          }
        }
      }
    }
  };

  /**
   * Ferme le formulaire d'action et affiche les boutons Investir et Retirer.
   * @param {HTMLElement} actionForm - Le formulaire d'action à fermer.
   * @param {HTMLElement} investButton - Le bouton Investir à réafficher.
   * @param {HTMLElement} withdrawButton - Le bouton Retirer à réafficher.
   */
  function closeActionForm(actionForm, investButton, withdrawButton) {
    actionForm.classList.remove('show');
    investButton.classList.remove('hidden');
    withdrawButton.classList.remove('hidden');
  }

  // Gestion des clics sur les boutons d'action du module du livret A et du module Actions
  document.querySelectorAll('.action-button[data-module="livretA"][data-action="invest"], .action-button[data-module="livretA"][data-action="withdraw"], .action-button[data-module="actions"][data-action="invest"], .action-button[data-module="actions"][data-action="withdraw"]').forEach(button => {
    button.addEventListener('click', () => {
      openActionForm(button);
    });
  });

});

// Gestion d'événements sur le module obligations
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

// Gestion d'événements sur le module résidence principale.
document.getElementById('invest-button-residence').addEventListener('click', () => {
  investResidence();
});

document.getElementById('sell-button-residence').addEventListener('click', () => {
  sellResidence();
});

function investResidence() {
  if (availableMoney >= residenceArgentNecessaire) {
    availableMoney -= residenceArgentNecessaire;
    residenceInvested = true;
    residenceInvestedAmount = residenceArgentNecessaire;
    residenceProfit = 0;
    document.querySelector('#module-residencePrincipale .residence-state.state-1').classList.add('hidden');
    document.querySelector('#module-residencePrincipale .residence-state.state-2').classList.remove('hidden');
    updateUI();
  } else {
    alert("Pas assez d'argent disponible pour investir dans la résidence principale !");
  }
}

function sellResidence() {
  const totalRecovered = residenceInvestedAmount + residenceProfit;
  availableMoney += totalRecovered;
  residenceInvested = false;
  residenceInvestedAmount = 0;
  residenceProfit = 0;
  document.querySelector('#module-residencePrincipale .residence-state.state-1').classList.remove('hidden');
  document.querySelector('#module-residencePrincipale .residence-state.state-2').classList.add('hidden');
  updateUI();
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

/**
 * Démarre le jeu en initialisant l'intervalle.
 */
function startGame() {
  gameInterval = setInterval(() => {
    if (currentMonthIndex < (totalYears * 12) - 1) {
      currentMonthIndex++;
    } else {
      // Fin de partie (code temporaire)
      alert("Fin de partie");
      clearInterval(gameInterval);
      return;
    }

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

    // Appliquer les rendements mensuels pour la Résidence Principale
    if (residenceInvested) {
      // Exemple de taux de rendement mensuel pour la résidence (par exemple, 0.3%)
      const residenceMonthlyRate = 0.003;
      const residenceResult = applyMonthlyReturn(residenceInvestedAmount, residenceMonthlyRate, residenceProfit);
      residenceInvestedAmount = residenceResult.newBalance;
      residenceProfit = residenceResult.newProfit;
    }

    updateUI();

    // **Détecter le début de la deuxième année pour afficher l'overlay**
    if (currentYearIndex === 2 && currentMonthIndex % 12 === 0) {
      pauseGame();
      showOverlay();
    }
  }, 5000); // Interval en ms qui représente un mois
}

/* Met en pause le jeu en arrêtant l'intervalle. */
function pauseGame() {
  clearInterval(gameInterval);
}

/* Reprend le jeu en redémarrant l'intervalle. */
function resumeGame() {
  startGame();
}

/* Affiche l'overlay et bloque le jeu. */
function showOverlay() {
  overlay.classList.remove('hidden');
}

/* Cache l'overlay et reprend le jeu, en affichant le module "Actions". */
function hideOverlay() {
  overlay.classList.add('hidden');
  
  // Afficher le module "Actions"
  const actionsModule = document.getElementById('module-actions');
  actionsModule.classList.remove('hidden');

  updateUI();
  resumeGame();
}

// Ajouter un gestionnaire d'événement pour le bouton "Continuer" de l'overlay
continueButton.addEventListener('click', () => {
  hideOverlay();
});

// Mise à jour initiale de l'interface utilisateur
updateUI();

// Démarrer le jeu au chargement de la page
startGame();
