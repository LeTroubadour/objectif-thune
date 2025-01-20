// script.js

// Importation des données
import { MonthlyLivretAReturns } from './livretA_rates.js';
import { MonthlyActionsReturns } from './actions_rates.js';

// Classe pour gérer chaque module d'investissement
class InvestmentModule {
  constructor(moduleName, options = {}) {
    this.moduleName = moduleName;
    this.element = document.querySelector(`.module[data-module="${moduleName}"]`);
    this.investButton = this.element.querySelector('.invest-button');         // Pour les modules avec un bouton "Investir"
    this.withdrawButton = this.element.querySelector('.withdraw-button');     // Pour les modules avec un bouton "Retirer"
    this.actionForm = this.element.querySelector('.action-form');             // Pour les modules avec un formulaire de validation de montant à investir ou retirer
      this.closeIcon = this.actionForm?.querySelector('.close-icon');           
      this.actionAmountInput = this.actionForm?.querySelector('.action-amount');
      this.maxButton = this.actionForm?.querySelector('.max-button');           
      this.confirmButton = this.actionForm?.querySelector('.confirm-button');
    this.toggleButton = this.element.querySelector('.toggle-button');         // Pour les modules avec un affichage au choix du montant investi ou des profits
      this.toggleContent = this.element.querySelector('.toggle-content');
      this.amountEl = this.element.querySelector('.module-amount.active');
      this.profitEl = this.element.querySelector('.module-amount:not(.active)');
    this.sellButton = this.element.querySelector('.sell-button');             // Pour le module résidence principale
    this.durationButtons = this.element.querySelectorAll('.duration-button'); // Pour les boutons de durée du mocule actifs alternatifs
      this.durationSelected = 3;                                              // Durée par défaut pour le mocule actifs alternatifs

    // Options pour comportements spécifiques
    this.customInvestHandler = options.customInvestHandler || null;
    this.customWithdrawHandler = options.customWithdrawHandler || null;

    // Propriété pour gérer l'activation d'un overlay
    this.activated = false;
    
    // Initialisation spécifique selon le module
    this.init();
  }

  init() {
    // Gestionnaire pour les boutons Investir (livret A, Actions)
    if (this.investButton) {
      if (this.customInvestHandler) {
        this.investButton.addEventListener('click', this.customInvestHandler);          // Pour les modules obligations et Fonds immobiliers pour l'instant
      } else {
        this.investButton.addEventListener('click', () => this.openActionForm('invest'));
      }
    }

    // Gestionnaire pour Retirer (livret A, Actions)
    if (this.withdrawButton) {
      if (this.customWithdrawHandler) {
        this.withdrawButton.addEventListener('click', this.customWithdrawHandler);      // Pour le module obligations et Fonds immobiliers pour l'instant
      } else {
        this.withdrawButton.addEventListener('click', () => this.openActionForm('withdraw'));
      }
    }

    // Gestionnaire pour Vendre (Résidence Principale)
    if (this.sellButton) {
      if (this.customWithdrawHandler && this.moduleName === 'residencePrincipale') {
        this.sellButton.addEventListener('click', this.customWithdrawHandler);
      }
    }

    // Gestionnaire pour Fermer le Formulaire
    if (this.closeIcon && this.actionForm) {
      this.closeIcon.addEventListener('click', () => this.closeActionForm());
    }

    // Gestionnaire pour le bouton MAX
    if (this.maxButton) {
      this.maxButton.addEventListener('click', () => this.setMaxAmount());
    }

    // Gestionnaire pour Confirmer l'Action
    if (this.confirmButton) {
      this.confirmButton.addEventListener('click', () => this.confirmAction());
    }

    // Gestionnaire pour le Toggle de Montant/Profit
    if (this.toggleButton) {
      this.toggleButton.addEventListener('click', () => this.toggleAmountProfit());
    }

    // Gestion des Durées (pour Actifs Alternatifs)
    if (this.durationButtons.length > 0) {
      this.durationButtons.forEach(button => {
        button.addEventListener('click', () => this.selectDuration(button));
      });
    }

    // Chargement des données depuis localStorage
    this.loadData();
  }

  // Ouvre le formulaire d'action avec l'action spécifiée (invest, withdraw)
  openActionForm(actionType) {
    // Masquer les boutons Investir/Retirer si nécessaire
    if (actionType === 'invest' || actionType === 'withdraw' || actionType === 'sell') {
      if (this.investButton) this.investButton.classList.add('hidden');
      if (this.withdrawButton) this.withdrawButton.classList.add('hidden');
    }

    // Définir l'attribut 'data-action-type' sur le bouton Confirmer
    if (this.confirmButton) {
      this.confirmButton.setAttribute('data-action-type', actionType);
    }

    // Afficher le formulaire d'action
    this.actionForm.classList.remove('hidden');
    this.actionForm.classList.add('show');
    this.actionAmountInput.value = '';
    this.actionAmountInput.focus();

    // Gestion spécifique pour Actifs Alternatifs
    if (this.moduleName === 'actifsAlternatifs') {
      this.actionAmountInput.value = '10000';
      this.element.querySelector('.actifs-state-1').classList.add('hidden');
      this.element.querySelector('.actifs-state-2').classList.remove('hidden');
      // Pré-sélectionner la durée de 3 ans
      this.durationSelected = 3;
      this.durationButtons.forEach(button => {
        const duration = parseInt(button.getAttribute('data-duration'), 10);
        if (duration === 3) {
          button.classList.add('active');
          button.setAttribute('aria-pressed', 'true');
        } else {
          button.classList.remove('active');
          button.setAttribute('aria-pressed', 'false');
        }
      });
    }

    // Gestion spécifique pour Fonds Immobiliers
    if (this.moduleName === 'fondsImmobiliers') {
      console.log("Fonds Immobiliers : Passage à l'état 2 (formulaire affiché)");1
      this.element.querySelector('.fondsImmobiliers-state-1')?.classList.add('hidden');
      this.element.querySelector('.fondsImmobiliers-state-2')?.classList.remove('hidden');

      // Vous pouvez ajouter des sélections spécifiques si nécessaire
    }
  }

  // Ferme le formulaire d'action et réaffiche les boutons Investir/Retirer
  closeActionForm() {
    this.actionForm.classList.remove('show');
    this.actionForm.classList.add('hidden');
    if (this.investButton) this.investButton.classList.remove('hidden');
    if (this.withdrawButton) this.withdrawButton.classList.remove('hidden');

    // Gestion spécifique pour Actifs Alternatifs
    if (this.moduleName === 'actifsAlternatifs') {
      this.element.querySelector('.actifs-state-1').classList.remove('hidden');
      this.element.querySelector('.actifs-state-2').classList.add('hidden');
    }
  }

  // Définit le montant maximal disponible pour l'action
  setMaxAmount() {
    let maxAmount = 0;
    const actionType = this.confirmButton.getAttribute('data-action-type'); // Custom attribute to store action type
    if (actionType === 'invest') {
      if (this.moduleName === 'livretA') {
        maxAmount = Math.min(availableMoney, MAX_LIVRET_A - livretA);
      } else if (this.moduleName === 'actions') {
        maxAmount = availableMoney;
      } else if (this.moduleName === 'actifsAlternatifs') {
        maxAmount = Math.max(availableMoney, ACTIVITE_ALTERNATIF_MIN_INVEST);
      }
    } else if (actionType === 'withdraw') {
      if (this.moduleName === 'livretA') {
        maxAmount = livretA;
      } else if (this.moduleName === 'actions') {
        maxAmount = actions;
      }
    } 
    maxAmount = Math.max(maxAmount, 0);
    maxAmount = Math.floor(maxAmount * 100) / 100;
    this.actionAmountInput.value = maxAmount.toFixed(2);
  }

  // Confirme l'action (investir, retirer, vendre)
  confirmAction() {
    const amount = parseFloat(this.actionAmountInput.value);
    const actionType = this.confirmButton.getAttribute('data-action-type'); // Custom attribute to store action type

    if (isNaN(amount) || amount <= 0) {
      alert("Veuillez entrer un montant valide (supérieur à 0).");
      return;
    }

    switch (this.moduleName) {
      case 'livretA':
        this.handleLivretAAction(amount, actionType);
        break;
      case 'actions':
        this.handleActionsAction(amount, actionType);
        break;
      case 'actifsAlternatifs':
        this.handleActifsAlternatifsAction(amount);
        break;
      default:
        console.warn(`Action non gérée pour le module: ${this.moduleName}`);
    }
  }

  // Gestion spécifique pour Livret A
  handleLivretAAction(amount, actionType) {
    if (actionType === 'invest') {
      if (livretA >= MAX_LIVRET_A) {
        alert(`Vous avez atteint le plafond d'investissement dans le Livret A (${MAX_LIVRET_A.toFixed(2)} €).`);
        return;
      }

      if (livretA + amount > MAX_LIVRET_A) {
        const montantPossible = MAX_LIVRET_A - livretA;
        alert(`Vous ne pouvez investir que ${montantPossible.toFixed(2)} € supplémentaires dans le Livret A.`);
        return;
      }

      if (availableMoney >= amount) {
        availableMoney -= amount;
        livretA += amount;
        saveData();
        updateUI();
        this.closeActionForm();
      } else {
        alert("Pas assez d'argent disponible pour investir !");
      }
    } else if (actionType === 'withdraw') {
      if (livretA >= amount) {
        livretA -= amount;
        availableMoney += amount;
        saveData();
        updateUI();
        this.closeActionForm();
      } else {
        alert("Pas assez d'argent sur le Livret A pour retirer !");
      }
    }
  }

  // Gestion spécifique pour Actions
  handleActionsAction(amount, actionType) {
    if (actionType === 'invest') {
      if (availableMoney >= amount) {
        availableMoney -= amount;
        actions += amount;
        saveData();
        updateUI();
        this.closeActionForm();
      } else {
        alert("Pas assez d'argent disponible pour investir !");
      }
    } else if (actionType === 'withdraw') {
      if (actions >= amount) {
        actions -= amount;
        availableMoney += amount;
        saveData();
        updateUI();
        this.closeActionForm();
      } else {
        alert("Pas assez d'argent sur les Actions pour retirer !");
      }
    }
  }

  // Gestion spécifique pour Actifs Alternatifs
  handleActifsAlternatifsAction(amount) {
    if (isNaN(amount) || amount < ACTIVITE_ALTERNATIF_MIN_INVEST) {
      alert(`Veuillez entrer un montant valide (minimum ${ACTIVITE_ALTERNATIF_MIN_INVEST.toLocaleString('fr-FR')} €).`);
      return;
    }

    if (availableMoney < amount) {
      alert("Pas assez d'argent disponible pour investir !");
      return;
    }

    const investment = {
      amount: amount,
      duration: this.durationSelected,
      startMonth: currentMonthIndex,
      profit: 0,
      id: Date.now() // Identifiant unique
    };

    actifsAlternatifsInvestments.push(investment);
    availableMoney -= amount;
    addActifsInvestmentToUI(investment);
    saveData();
    updateUI();
    this.closeActionForm();
  }

  // Sélectionne la durée pour Actifs Alternatifs
  selectDuration(button) {
    this.durationSelected = parseInt(button.getAttribute('data-duration'));
    this.durationButtons.forEach(btn => {
      if (btn === button) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  }

  // Toggle entre montant investi et profit
  toggleAmountProfit() {
    if (this.amountEl.classList.contains('active')) {
      this.amountEl.classList.remove('active');
      this.profitEl.classList.add('active');
    } else {
      this.profitEl.classList.remove('active');
      this.amountEl.classList.add('active');
    }
  }

  // Sauvegarde les données dans le localStorage
  saveData() {
    try {
      localStorage.setItem(`${this.moduleName}Investments`, JSON.stringify(actifsAlternatifsInvestments));
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde des données pour ${this.moduleName}:`, error);
    }
  }

  // Charge les données depuis le localStorage
  loadData() {
    try {
      const data = localStorage.getItem(`${this.moduleName}Investments`);
      if (data) {
        actifsAlternatifsInvestments = JSON.parse(data);
        // Recréer les lignes d'investissement dans l'UI
        actifsAlternatifsInvestments.forEach(investment => {
          addActifsInvestmentToUI(investment);
        });
        // Mettre à jour le total des profits
        calculateActifsTotalProfit();
      }
    } catch (error) {
      console.error(`Erreur lors du chargement des données pour ${this.moduleName}:`, error);
    }
  }
}

// Variables globales
const initialAge = 22;
const totalYears = 20;      // Durée de la simulation en années
let currentYearIndex = 1;   // 1 = première année
let currentMonthIndex = 0;  // 0 = premier mois
let gameInterval;           // Variable pour stocker l'intervalle du jeu
let availableMoney = 100000; // Argent disponible initial

// Variables pour les modules spécifiques
let livretA = 0;
let livretAProfit = 0;
const MAX_LIVRET_A = 9950;

let obligations = 0;
let obligationsProfit = 0;

let actions = 0;
let actionsProfit = 0;

let residenceInvested = false;
let residenceInvestedAmount = 0;
let residenceProfit = 0;
const residenceSurfaceCible = 50;         // Surface en m² par défaut (à rendre dynamique)
const residenceArgentNecessaire = 10000;  // Argent en € par défaut (à rendre dynamique)

let fondsImmobiliers = 0;
let fondsImmobiliersProfit = 0;

let actifsAlternatifsInvestments = [];    // Tableau pour stocker les investissements
let actifsAlternatifsTotalProfit = 0;
const MAX_ACTIFS_INVESTMENTS = 3;
const ACTIVITE_ALTERNATIF_MIN_INVEST = 10000;

// Variable pour la gestion des overlays
let isOverlayActive = false;

// Tables de rendements mensuels
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

  // Table de rendements du module Actions mensualisés
  const ActionsStartIndex = findStartIndex(MonthlyActionsReturns, TARGET_START_DATE);
  const ActionsEndIndex = ActionsStartIndex + NUMBER_OF_ENTRIES;
  const ActionsSelectedEntries = MonthlyActionsReturns.slice(ActionsStartIndex, ActionsEndIndex);
  const monthlyActionsRates = ActionsSelectedEntries.map(entry => entry[1]);

// Références aux éléments du DOM pour Dashboard
const currentYearEl = document.getElementById('current-year');
const availableMoneyEl = document.getElementById('available-money');
const totalWealthEl = document.getElementById('total-wealth');

// Références aux éléments du DOM pour Actifs Alternatifs
const actifsInvestedAmountsEl = document.getElementById('actifs-investedAmounts');
const actifsTotalProfitEl = document.getElementById('actifs-totalProfit');

// Références aux éléments du DOM pour Overlays
const overlayObligations = document.getElementById('overlay-obligations');
const overlayActions = document.getElementById('overlay-actions');

// Instances des modules d'investissement
const livretAModule = new InvestmentModule('livretA');
const actionsModule = new InvestmentModule('actions');
const obligationsModule = new InvestmentModule('obligations', {
  customInvestHandler: handleObligationsInvest,
  customWithdrawHandler: handleObligationsWithdraw
}); 
const residenceModule = new InvestmentModule('residencePrincipale', {
  customInvestHandler: handleResidenceInvest,
  customWithdrawHandler: handleResidenceSell
});
const fondsImmobiliersModule = new InvestmentModule('fondsImmobiliers', {
  customInvestHandler: handleFondsImmobiliersInvest,
  customWithdrawHandler: handleFondsImmobiliersWithdraw
}); 
const actifsAlternatifsModule = new InvestmentModule('actifsAlternatifs');

// Fonctions spécifiques du module Obligations
function handleObligationsInvest() {
  const investmentAmount = 100;

  if (availableMoney >= investmentAmount) {
    availableMoney -= investmentAmount;
    obligations += investmentAmount;

    saveData();
    updateUI();
  } else {
    alert("Pas assez d'argent disponible pour investir !");
  }
}

function handleObligationsWithdraw() {
  const withdrawalAmount = 100;

  if (obligations >= withdrawalAmount) {
    obligations -= withdrawalAmount;
    availableMoney += withdrawalAmount;

    saveData();
    updateUI();
  } else {
    alert("Pas assez d'argent sur les Obligations pour retirer !");
  }
}

// Fonctions spécifiques du module Résidence Principale
function handleResidenceInvest() {
  if (availableMoney >= residenceArgentNecessaire) {
    availableMoney -= residenceArgentNecessaire;
    residenceInvestedAmount += residenceArgentNecessaire;
    residenceProfit = 0;
    residenceInvested = true; // Marquer comme investi
    residenceModule.element.querySelector('.residence-state.state-1').classList.add('hidden');
    residenceModule.element.querySelector('.residence-state.state-2').classList.remove('hidden');

    saveData();
    updateUI();
  } else {
    alert("Pas assez d'argent disponible pour investir dans la Résidence Principale !");
  }
}

function handleResidenceSell() {
  if (residenceInvested) {
    const sellAmount = residenceInvestedAmount;           // inclus déjà le Profit
    availableMoney += sellAmount;
    residenceInvestedAmount = 0;
    residenceProfit = 0;
    residenceInvested = false;
    residenceModule.element.querySelector('.residence-state.state-1').classList.remove('hidden');
    residenceModule.element.querySelector('.residence-state.state-2').classList.add('hidden');

    saveData();
    updateUI();
  } else {
    alert("Aucune Résidence Principale à vendre !");
  }
}

// Fonctions spécifiques du module Fonds Immobiliers
function handleFondsImmobiliersInvest() {
  const investmentAmount = 100;

  if (availableMoney >= investmentAmount) {
    availableMoney -= investmentAmount;
    fondsImmobiliers += investmentAmount;

    saveData();
    updateUI();
  } else {
    alert("Pas assez d'argent disponible pour investir !");
  }
}

function handleFondsImmobiliersWithdraw() {
  const withdrawalAmount = 100;

  if (fondsImmobiliers >= withdrawalAmount) {
    fondsImmobiliers -= withdrawalAmount;
    availableMoney += withdrawalAmount;

    saveData();
    updateUI();
  } else {
    alert("Pas assez d'argent sur les Fonds Immobiliers pour retirer !");
  }
}

// Fonctions spécifiques du module Acrifs Alternatifs

/**
 * Ajoute une ligne d'investissement dans l'interface utilisateur pour Actifs Alternatifs.
 * @param {Object} investment - Objet d'investissement
 */
function addActifsInvestmentToUI(investment) {
  const li = document.createElement('li');
  li.id = `actifs-investment-${investment.id}`;
  li.innerHTML = `
    <span>Investissement de ${investment.amount.toLocaleString('fr-FR')} € pour ${investment.duration} ans</span>
    <span>Profit : ${investment.profit.toLocaleString('fr-FR')} €</span>
  `;
  actifsInvestedAmountsEl.appendChild(li);
}

/**
 * Calcule et met à jour le total des profits dans l'UI pour Actifs Alternatifs.
 */
function calculateActifsTotalProfit() {
  const totalProfit = actifsAlternatifsInvestments.reduce((acc, investment) => acc + investment.profit, 0);
  actifsTotalProfitEl.textContent = `${totalProfit.toLocaleString('fr-FR')} €`;
}

/**
 * Met à jour les profits cumulés pour Actifs Alternatifs.
 */
function updateActifsProfits() {
  actifsAlternatifsTotalProfit = 0;
  actifsAlternatifsInvestments.forEach(investment => {
    // Calculer le nombre de mois écoulés
    const monthsElapsed = currentMonthIndex - investment.startMonth;

    // Vérifier si la durée est atteinte
    if (monthsElapsed >= investment.duration * 12) {
      // Ajouter le profit et retirer l'investissement
      availableMoney += investment.amount + investment.profit;
      // Supprimer l'investissement du tableau
      actifsAlternatifsInvestments = actifsAlternatifsInvestments.filter(inv => inv.id !== investment.id);
      // Supprimer la ligne de l'UI
      const li = document.getElementById(`actifs-investment-${investment.id}`);
      if (li) li.remove();
    } else {
      // Appliquer un rendement mensuel (exemple: 0.5%)
      const monthlyRate = 0.005;
      const interestEarned = investment.amount * monthlyRate;
      investment.profit += interestEarned;
      actifsAlternatifsTotalProfit += interestEarned;

      // Mettre à jour l'UI pour cette ligne
      const li = document.getElementById(`actifs-investment-${investment.id}`);
      if (li) {
        li.querySelector('span:nth-child(2)').textContent = `Profit : ${investment.profit.toLocaleString('fr-FR')} €`;
      }
    }
  });

  // Mettre à jour le total des profits
  calculateActifsTotalProfit();

  // Sauvegarder les investissements mis à jour
  saveData();
}

/**
 * Met à jour l'interface utilisateur avec les nouvelles valeurs.
 */
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
  const totalWealth = availableMoney + livretA + obligations + actions + residenceInvestedAmount + fondsImmobiliers;
  totalWealthEl.textContent = `€${totalWealth.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, "'")}`;

  // MAJ module Livret A
  livretAModule.amountEl.textContent = `€${livretA.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, "'")} investis`;
  livretAModule.profitEl.textContent = `€${livretAProfit.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, "'")} de profit`;
  livretAModule.investButton.disabled = livretA >= MAX_LIVRET_A;
  livretAModule.withdrawButton.style.display = (livretA < 0.01) ? 'none' : 'inline-block';

  // MAJ module Obligations
  obligationsModule.amountEl.textContent = `€${obligations.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, "'")} investis`;
  obligationsModule.withdrawButton.style.display = (obligations < 100) ? 'none' : 'inline-block';

  // MAJ module Actions
  actionsModule.amountEl.textContent = `€${actions.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, "'")} investis`;
  actionsModule.profitEl.textContent = `€${actionsProfit.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, "'")} de profit`;
  actionsModule.withdrawButton.style.display = (actions < 100) ? 'none' : 'inline-block';

  // MAJ module Résidence Principale
  residenceModule.element.querySelector('#residence-age').textContent = age;
  residenceModule.element.querySelector('#residence-taille').textContent = residenceSurfaceCible;

  if (residenceInvested) {
    residenceModule.element.querySelector('#residence-investedAmount').textContent = `${residenceInvestedAmount.toLocaleString('fr-FR')} € investis`;
    residenceModule.element.querySelector('#residence-profit').textContent = `${residenceProfit.toLocaleString('fr-FR')} € de profit`;
  }

  // MAJ module Fonds Immobiliers
  fondsImmobiliersModule.amountEl.textContent = `€${fondsImmobiliers.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, "'")} investis`;
  fondsImmobiliersModule.withdrawButton.style.display = (fondsImmobiliers < 100) ? 'none' : 'inline-block';  

  // MAJ module Actifs Alternatifs
  actifsAlternatifsModule.investButton.disabled = actifsAlternatifsInvestments.length >= MAX_ACTIFS_INVESTMENTS;
  actifsAlternatifsModule.investButton.disabled = availableMoney < ACTIVITE_ALTERNATIF_MIN_INVEST;
}

/**
 * Sauvegarde toutes les données dans le localStorage.
 */
function saveData() {
  try {
    // Sauvegarde des investissements dans Actifs Alternatifs
    localStorage.setItem('actifsAlternatifsInvestments', JSON.stringify(actifsAlternatifsInvestments));

    // Sauvegarde des autres modules si nécessaire
    localStorage.setItem('livretA', livretA);
    localStorage.setItem('livretAProfit', livretAProfit);
    localStorage.setItem('obligations', obligations);
    localStorage.setItem('obligationsProfit', obligationsProfit);
    localStorage.setItem('actions', actions);
    localStorage.setItem('actionsProfit', actionsProfit);
    localStorage.setItem('residenceInvested', residenceInvested);
    localStorage.setItem('residenceInvestedAmount', residenceInvestedAmount);
    localStorage.setItem('residenceProfit', residenceProfit);
    localStorage.setItem('fondsImmobiliers', fondsImmobiliers);
    localStorage.setItem('fondsImmobiliersProfit', fondsImmobiliersProfit);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des données:', error);
  }
}

/**
 * Charge toutes les données depuis le localStorage.
 */
function loadData() {
  try {
    // Chargement des investissements dans Actifs Alternatifs
    const actifsData = localStorage.getItem('actifsAlternatifsInvestments');
    if (actifsData) {
      actifsAlternatifsInvestments = JSON.parse(actifsData);
      actifsAlternatifsInvestments.forEach(investment => {
        addActifsInvestmentToUI(investment);
      });
      calculateActifsTotalProfit();
    }

    // Chargement des autres modules
    const loadedLivretA = parseFloat(localStorage.getItem('livretA'));
    const loadedLivretAProfit = parseFloat(localStorage.getItem('livretAProfit'));
    if (!isNaN(loadedLivretA)) livretA = loadedLivretA;
    if (!isNaN(loadedLivretAProfit)) livretAProfit = loadedLivretAProfit;

    const loadedObligations = parseFloat(localStorage.getItem('obligations'));
    const loadedObligationsProfit = parseFloat(localStorage.getItem('obligationsProfit'));
    if (!isNaN(loadedObligations)) obligations = loadedObligations;
    if (!isNaN(loadedObligationsProfit)) obligationsProfit = loadedObligationsProfit;

    const loadedActions = parseFloat(localStorage.getItem('actions'));
    const loadedActionsProfit = parseFloat(localStorage.getItem('actionsProfit'));
    if (!isNaN(loadedActions)) actions = loadedActions;
    if (!isNaN(loadedActionsProfit)) actionsProfit = loadedActionsProfit;

    const loadedResidenceInvested = localStorage.getItem('residenceInvested') === 'true';
    const loadedResidenceInvestedAmount = parseFloat(localStorage.getItem('residenceInvestedAmount'));
    const loadedResidenceProfit = parseFloat(localStorage.getItem('residenceProfit'));
    residenceInvested = loadedResidenceInvested;
    residenceInvestedAmount = !isNaN(loadedResidenceInvestedAmount) ? loadedResidenceInvestedAmount : 0;
    residenceProfit = !isNaN(loadedResidenceProfit) ? loadedResidenceProfit : 0;

    const loadedFondsImmobiliers = parseFloat(localStorage.getItem('fondsImmobiliers'));
    const loadedFondsImmobiliersProfit = parseFloat(localStorage.getItem('fondsImmobiliersProfit'));
    if (!isNaN(loadedFondsImmobiliers)) fondsImmobiliers = loadedFondsImmobiliers;
    if (!isNaN(loadedFondsImmobiliersProfit)) fondsImmobiliersProfit = loadedFondsImmobiliersProfit;

    // Mise à jour de l'interface utilisateur après chargement
    updateUI();

    // Mise à jour des états des modules Résidence Principale
    if (residenceInvested) {
      residenceModule.element.querySelector('.residence-state.state-1').classList.add('hidden');
      residenceModule.element.querySelector('.residence-state.state-2').classList.remove('hidden');
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
  }
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

    // Appliquer les rendements mensuels pour Actifs Alternatifs
    if (actifsAlternatifsInvestments.length > 0) {
      updateActifsProfits();
    }

    // Mettre à jour l'interface utilisateur
    updateUI();

    // Vérifier et afficher les overlays si nécessaire
    checkAndShowOverlays();

  }, 500); // Interval en ms qui représente un mois
}

/* Met en pause le jeu en arrêtant l'intervalle. */
function pauseGame() {
  clearInterval(gameInterval);
}

/* Reprend le jeu en redémarrant l'intervalle. */
function resumeGame() {
  startGame();
}

// Fonction pour activer un module
function activateModule(moduleName) {
  const module = document.querySelector(`.module[data-module="${moduleName}"]`);
  if (module) {
    module.classList.remove('hidden');
    console.log(`Module ${moduleName} activé.`);
  } else {
    console.warn(`Module ${moduleName} non trouvé.`);
  }
}

/* Affiche l'overlay et bloque le jeu. */
function showOverlay(overlayElement) {
  if (isOverlayActive) return; // Empêche l'ouverture de plusieurs overlays simultanément

  isOverlayActive = true;
  pauseGame();

  // Appliquer le filtre au dashboard
  const dashboard = document.querySelector('.dashboard');
  dashboard.classList.add('overlay-active');

  // Afficher l'overlay
  overlayElement.classList.remove('hidden');
  overlayElement.classList.add('show');

  // Initialiser la navigation des overlays
  initializeOverlayNavigation(overlayElement);
}

/* Cache l'overlay et reprend le jeu, en affichant le module "Actions". */
function hideOverlay(overlayElement) {
  if (!isOverlayActive) return;

  // Masquer l'overlay
  overlayElement.classList.remove('show');

  // Enlever le filtre du dashboard
  const dashboard = document.querySelector('.dashboard');
  dashboard.classList.remove('overlay-active');

  isOverlayActive = false;
  resumeGame();
}

// Fonction pour initialiser la navigation des overlays
function initializeOverlayNavigation(overlayElement) {
  const messages = overlayElement.querySelectorAll('.overlay-message');
  const prevButton = overlayElement.querySelector('.prev-button');
  const nextButton = overlayElement.querySelector('.next-button');
  const continueButton = overlayElement.querySelector('.overlay-continue-button');
  let currentMessageIndex = 0;

  // Fonction pour afficher le message courant
  function showMessage(index) {
    messages.forEach((msg, idx) => {
      msg.classList.toggle('active', idx === index);
    });

    // Gérer l'affichage des flèches
    prevButton.style.display = index === 0 ? 'none' : 'block';
    nextButton.style.display = index === messages.length - 1 ? 'none' : 'block';

    // Afficher le bouton "J'ai compris" uniquement sur le dernier message
    if (index === messages.length - 1) {
      continueButton.classList.remove('hidden');
    } else {
      continueButton.classList.add('hidden');
    }
  }

  // Initialiser l'affichage
  showMessage(currentMessageIndex);

  // Gestionnaire pour le bouton Précédent
  prevButton.onclick = () => {
    if (currentMessageIndex > 0) {
      currentMessageIndex--;
      showMessage(currentMessageIndex);
    }
  };

  // Gestionnaire pour le bouton Suivant
  nextButton.onclick = () => {
    if (currentMessageIndex < messages.length - 1) {
      currentMessageIndex++;
      showMessage(currentMessageIndex);
    }
  };

  // Gestionnaire pour le bouton "J'ai compris"
  continueButton.onclick = () => {
    hideOverlay(overlayElement);

    // Activer le module correspondant après la fermeture de l'overlay
    if (overlayElement.id === 'overlay-obligations') {
      activateModule('obligations');
    } else if (overlayElement.id === 'overlay-actions') {
      activateModule('actions');
    }
  };
}

// Fonction pour vérifier et afficher les overlays en fonction de l'année écoulée
function checkAndShowOverlays() {
  if (currentYearIndex === 2 && currentMonthIndex % 12 === 0 && !obligationsModule.activated) {
    showOverlay(overlayObligations);
    obligationsModule.activated = true;
  }

  if (currentYearIndex === 3 && currentMonthIndex % 12 === 0 && !actionsModule.activated) {
    showOverlay(overlayActions);
    actionsModule.activated = true;
  }
}

// Fonction de calcul du rendement mensuel.
function applyMonthlyReturn(balance, rate, profit) {
  const interestEarned = balance * rate;
  const newBalance = balance + interestEarned;
  const newProfit = profit + interestEarned;
  return { newBalance, newProfit };
}

// Fonction pour initialiser l'application
function init() {
  loadData();
  updateUI();
  startGame();
}

// Appel de l'initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', init);
