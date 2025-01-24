// script.js

/* -----------------------------
   Importations des Données
   ----------------------------- */
   import { MonthlyLivretAReturns } from './livretA_rates.js';
   import { MonthlyActionsReturns } from './actions_rates.js';
   import { actifsAlternatifsROIs } from './actifsAlternatifs_rates.js';
   
   /* -----------------------------
      Variables Globales
      ----------------------------- */
   
   // Informations de base
   const initialAge = 22;
   const totalYears = 12; // Durée de la simulation en années
   
   // Indices temporels
   let currentYearIndex = 1;   // 1 = première année
   let currentMonthIndex = 0;  // 0 = premier mois
   
   // Gestion de l'intervalle du jeu
   let gameInterval;
   
   // Argent disponible initial
   let availableMoney = 100000;
   let totalWealth = availableMoney;
   let totalProfit = 0;
   let isShowingTotalWealth = true;
   
   // Modules d'investissement spécifiques
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
   const residenceArgentNecessaire = 10000;  // Argent en € par défaut (à rendre dynamique)fondsImmobiliers
   
   let fondsImmobiliers = 0;
   let fondsImmobiliersProfit = 0;
   
   let actifsAlternatifsInvestments = [];    // Tableau pour stocker les investissements
   let actifsAlternatifsTotalProfit = 0;
   const MAX_ACTIFS_INVESTMENTS = 3;
   const ACTIVITE_ALTERNATIF_MIN_INVEST = 10000;
   
   // Gestion des overlays
   let isOverlayActive = false;
   
   /* -----------------------------
      Tables de Rendements Mensuels
      ----------------------------- */
   
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
   
   // Rendements du Livret A
   const LivretAStartIndex = findStartIndex(MonthlyLivretAReturns, TARGET_START_DATE);
   const LivretAEndIndex = LivretAStartIndex + NUMBER_OF_ENTRIES;
   const LivretASelectedEntries = MonthlyLivretAReturns.slice(LivretAStartIndex, LivretAEndIndex);
   const monthlyLivretARates = LivretASelectedEntries.map(entry => entry[1]);
   
   // Rendements des Actions
   const ActionsStartIndex = findStartIndex(MonthlyActionsReturns, TARGET_START_DATE);
   const ActionsEndIndex = ActionsStartIndex + NUMBER_OF_ENTRIES;
   const ActionsSelectedEntries = MonthlyActionsReturns.slice(ActionsStartIndex, ActionsEndIndex);
   const monthlyActionsRates = ActionsSelectedEntries.map(entry => entry[1]);
   
   /* -----------------------------
      Références aux Éléments du DOM
      ----------------------------- */
   
   // Écran d'introduction
   const introScreen = document.getElementById('intro-screen');
   const playButton = document.getElementById('play-button');
   
   // Dashboard
   const gameContainer = document.getElementById('game-container');
   const currentYearEl = document.getElementById('current-year');
   const availableMoneyEl = document.getElementById('available-money');
   const dashboardToggleButton = document.getElementById('dashboard-toggle-button');
   const dashboardToggleTitle = document.getElementById('dashboard-toggle-title');
   const dashboardToggleContent = document.getElementById('dashboard-toggle-content');
   
   // Conteneurs de modules
   const modulesContainer = document.getElementById('modules-container');
   const bottomModules = document.getElementById('bottom-modules');
   
   // Actifs Alternatifs
   const actifsInvestedAmountsEl = document.getElementById('actifs-investedAmounts');
   const actifsTotalProfitEl = document.getElementById('actifs-totalProfit');
   
   // Overlays
   const overlayLivretA = document.getElementById('overlay-livretA');
   const overlayObligations = document.getElementById('overlay-obligations');
   const overlayActions = document.getElementById('overlay-actions');
   const overlayResidencePrincipale = document.getElementById('overlay-residencePrincipale');
   const overlayFondsImmobiliers = document.getElementById('overlay-fondsImmobiliers');
   const overlayActifsAlternatifs = document.getElementById('overlay-actifsAlternatifs');
   
   // Écran de Fin
   const endScreen = document.getElementById('end-screen');
   const restartButton = document.getElementById('restart-button');
   
   /* -----------------------------
      Fonctions Utilitaires
      ----------------------------- */
   
    /**
     * Calcule le Patrimoine Total (Total Assets)
     * @returns {number}
     */
    function calculateTotalWealth() {
      return availableMoney + livretA + actions + obligations + residenceInvestedAmount + fondsImmobiliers + actifsAlternatifsInvestments.reduce((sum, inv) => sum + inv.amount, 0);
    }

    /**
     * Calcule le Profit Total (Total Profit)
     * @returns {number}
     */
    function calculateTotalProfit() {
      return livretAProfit + actionsProfit + obligationsProfit + residenceProfit + fondsImmobiliersProfit + actifsAlternatifsTotalProfit;
    }

    /**
     * Met à Jour l'Affichage du Dashboard en Fonction de l'État du Toggle
     */
    function updateDashboardToggle() {
      totalWealth = calculateTotalWealth();
      totalProfit = calculateTotalProfit();
      if (isShowingTotalWealth) {
        dashboardToggleTitle.textContent = 'Patrimoine Total';
        dashboardToggleContent.textContent = `€${totalWealth.toLocaleString('fr-FR')}`;
        dashboardToggleButton.setAttribute('aria-pressed', 'true');
      } else {
        dashboardToggleTitle.textContent = 'Profit Total';
        dashboardToggleContent.textContent = `€${totalProfit.toLocaleString('fr-FR')}`;
        dashboardToggleButton.setAttribute('aria-pressed', 'false');
      }
    }
    
    /**
     * Gestionnaire spécifique pour le toggle du Dashboard.
     */
    function handleDashboardToggle() {
      isShowingTotalWealth = !isShowingTotalWealth;
      updateDashboardToggle();
      saveData();
    }

    /**
     * Sélectionne un ROI final basé sur les probabilités pour les Actifs Alternatifs.
     * @param {string} duree - Durée de l'investissement ("3ans" ou "7ans").
     * @returns {number} - ROI final sélectionné.
     */
    function selectFinalROI(duree) {
      const rois = actifsAlternatifsROIs[duree];
      const rand = Math.random() * 100;
      let cumulative = 0;

      for (let roi of rois) {
        cumulative += roi.probability;
        if (rand < cumulative) {
          return roi.roiFinal;
        }
      }

      // Fallback au dernier ROI si rien n'est sélectionné
      return rois[rois.length - 1].roiFinal;
    }

    /**
     * Calcule le ROI mensuel basé sur le ROI final et la durée.
     * @param {number} roiFinal - ROI final en pourcentage.
     * @param {number} dureeEnMois - Durée de l'investissement en mois.
     * @returns {number} - ROI mensuel en décimal.
     */
    function calculateMonthlyROI(roiFinal, dureeEnMois) {
      return Math.pow(1 + roiFinal / 100, 1 / dureeEnMois) - 1;
    }

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
     const ActifsTotalProfit = actifsAlternatifsInvestments.reduce((acc, investment) => acc + investment.profit, 0);
     actifsTotalProfitEl.textContent = `${ActifsTotalProfit.toLocaleString('fr-FR')} €`;
   }
   
   /**
    * Met à jour les profits cumulés pour Actifs Alternatifs.
    */
   function updateActifsProfits() {
     actifsAlternatifsInvestments.forEach(investment => {
       const monthsElapsed = currentMonthIndex - investment.startMonth;
   
       if (monthsElapsed >= investment.duration * 12) {
         availableMoney += investment.amount + investment.profit;
         // Supprimer l'investissement du tableau
         actifsAlternatifsInvestments = actifsAlternatifsInvestments.filter(inv => inv.id !== investment.id);
         // Supprimer la ligne de l'UI
         const li = document.getElementById(`actifs-investment-${investment.id}`);
         if (li) li.remove();
       } else {
         const interestEarned = investment.amount * investment.monthlyROI;
         investment.profit += interestEarned;
         actifsAlternatifsTotalProfit += interestEarned;
   
         // Mettre à jour l'UI pour cette ligne
         const li = document.getElementById(`actifs-investment-${investment.id}`);
         if (li) {
           li.querySelector('span:nth-child(2)').textContent = `Profit : ${investment.profit.toLocaleString('fr-FR')} €`;
         }
       }
     });
   
     calculateActifsTotalProfit();
     saveData();
   }
   
   /**
    * Met à jour l'interface utilisateur avec les nouvelles valeurs.
    */
   function updateUI() {
     const age = initialAge + currentYearIndex - 1;
   
     // Mise à jour du Dashboard
     currentYearEl.innerHTML = `
       <span class="dashboard-title">Année</span>
       <span class="dashboard-amount">${currentYearIndex}</span> 
       <span class="dashboard-title">sur</span> 
       <span class="dashboard-amount">${totalYears}</span>
     `;
     availableMoneyEl.textContent = `€${availableMoney.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, "'")}`;
     updateDashboardToggle();
   
     // Mise à jour des modules d'investissement
     livretAModule.updateModuleUI();
     obligationsModule.updateModuleUI();
     actionsModule.updateModuleUI();
     residenceModule.updateModuleUI(age);
     fondsImmobiliersModule.updateModuleUI();
     actifsAlternatifsModule.updateModuleUI();
   }
   
   /**
    * Sauvegarde toutes les données dans le localStorage.
    */
   function saveData() {
     try {
       // Sauvegarde des autres modules
       localStorage.setItem('currentYearIndex', currentYearIndex);
       localStorage.setItem('currentMonthIndex', currentMonthIndex);
       localStorage.setItem('availableMoney', availableMoney);
       localStorage.setItem('dashboardToggleState', isShowingTotalWealth ? 'assets' : 'profit');
       localStorage.setItem('totalWealth', totalWealth);
       localStorage.setItem('totalProfit', totalProfit);
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
       localStorage.setItem('actifsAlternatifsInvestments', JSON.stringify(actifsAlternatifsInvestments));
       localStorage.setItem('actifsAlternatifsTotalProfit', actifsAlternatifsTotalProfit);
     } catch (error) {
       console.error('Erreur lors de la sauvegarde des données:', error);
     }
   }
   
   /**
    * Charge toutes les données depuis le localStorage.
    */
   function loadData() {
     try {
       currentYearIndex = parseInt(localStorage.getItem('currentYearIndex'), 10) || 1;
       currentMonthIndex = parseInt(localStorage.getItem('currentMonthIndex'), 10) || 0;
       availableMoney = parseFloat(localStorage.getItem('availableMoney')) || 0;
       const savedToggleState = localStorage.getItem('dashboardToggleState');
       if (savedToggleState === 'profit') {
         isShowingTotalWealth = false;
       } else {
         isShowingTotalWealth = true;
       }
       totalWealth = parseFloat(localStorage.getItem('totalWealth')) || 0;
       totalProfit = parseFloat(localStorage.getItem('totalProfit')) || 0;
       livretA = parseFloat(localStorage.getItem('livretA')) || 0;
       livretAProfit = parseFloat(localStorage.getItem('livretAProfit')) || 0;
       obligations = parseFloat(localStorage.getItem('obligations')) || 0;
       obligationsProfit = parseFloat(localStorage.getItem('obligationsProfit')) || 0;
       actions = parseFloat(localStorage.getItem('actions')) || 0;
       actionsProfit = parseFloat(localStorage.getItem('actionsProfit')) || 0;
       residenceInvested = localStorage.getItem('residenceInvested') === 'true';
       if (residenceInvested) {
        residenceModule.showInvestedState();
       }
       residenceInvestedAmount = parseFloat(localStorage.getItem('residenceInvestedAmount')) || 0;
       residenceProfit = parseFloat(localStorage.getItem('residenceProfit')) || 0;
       fondsImmobiliers = parseFloat(localStorage.getItem('fondsImmobiliers')) || 0;
       fondsImmobiliersProfit = parseFloat(localStorage.getItem('fondsImmobiliersProfit')) || 0;
       actifsAlternatifsTotalProfit = parseFloat(localStorage.getItem('actifsAlternatifsTotalProfit')) || 0;
       const actifsData = localStorage.getItem('actifsAlternatifsInvestments');
       if (actifsData) {
         actifsAlternatifsInvestments = JSON.parse(actifsData);
         actifsAlternatifsInvestments.forEach(investment => {
           addActifsInvestmentToUI(investment);
         });
         calculateActifsTotalProfit();
       }
       actifsAlternatifsTotalProfit = parseFloat(localStorage.getItem('actifsAlternatifsTotalProfit')) || 0;

      updateUI();

     } catch (error) {
       console.error('Erreur lors du chargement des données:', error);
     }
   }
   
   /* -----------------------------
      Classe InvestmentModule
      ----------------------------- */
   
   /**
    * Classe pour gérer chaque module d'investissement.
    */
   class InvestmentModule {
     constructor(moduleName, options = {}) {
       this.moduleName = moduleName;
       this.element = document.querySelector(`[data-module="${moduleName}"]`);
       if (!this.element) {
        console.warn(`Élément DOM pour l'instance' "${moduleName}" non trouvé.`);
        return;
      }
   
       // Boutons et éléments des modules
       this.investButton = this.element?.querySelector('.invest-button');         // Bouton "Investir"
       this.withdrawButton = this.element?.querySelector('.withdraw-button');     // Bouton "Retirer"
       this.sellButton = this.element?.querySelector('.sell-button');             // Bouton "Vendre" (Résidence Principale)
       this.toggleButton = this.element?.querySelector('.toggle-button');         // Bouton pour basculer montant/profit
       this.toggleContent = this.element?.querySelector('.toggle-content');
       this.amountEl = this.element?.querySelector('.module-amount.active');      // Élément affichant le montant investi
       this.profitEl = this.element?.querySelector('.module-amount:not(.active)'); // Élément affichant les profits
   
       // Formulaire d'action (investir/retirer)
       this.actionForm = this.element?.querySelector('.action-form');
       this.closeIcon = this.actionForm?.querySelector('.close-icon');           
       this.actionAmountInput = this.actionForm?.querySelector('.action-amount');
       this.maxButton = this.actionForm?.querySelector('.max-button');           
       this.confirmButton = this.actionForm?.querySelector('.confirm-button');
   
       // Boutons de durée (pour module Actifs Alternatifs)
       this.durationButtons = this.element.querySelectorAll('.duration-button'); 
       this.durationSelected = 3; // Durée par défaut pour Actifs Alternatifs
   
       // Options pour comportements spécifiques
       this.customInvestHandler = options.customInvestHandler || null;
       this.customWithdrawHandler = options.customWithdrawHandler || null;
   
       // Propriété pour gérer l'activation d'un overlay
       this.overlayActivated = false;
   
       // Initialisation des gestionnaires d'événements
       this.init();
     }
   
     /**
      * Initialise les gestionnaires d'événements pour les modules.
      */
     init() {
      if (this.moduleName !== 'dashboard') {
        // Gestionnaire pour le bouton Investir
        if (this.investButton) {
          if (this.customInvestHandler) {
            this.investButton.addEventListener('click', this.customInvestHandler);
          } else {
            this.investButton.addEventListener('click', () => this.openActionForm('invest'));
          }
        }
    
        // Gestionnaire pour le bouton Retirer
        if (this.withdrawButton) {
          if (this.customWithdrawHandler) {
            this.withdrawButton.addEventListener('click', this.customWithdrawHandler);
          } else {
            this.withdrawButton.addEventListener('click', () => this.openActionForm('withdraw'));
          }
        }
    
        // Gestionnaire pour le bouton Vendre (Résidence Principale)
        if (this.sellButton) {
          if (this.customWithdrawHandler && this.moduleName === 'residencePrincipale') {
            this.sellButton.addEventListener('click', this.customWithdrawHandler);
          }
        }
    
        // Gestionnaire pour fermer le formulaire d'action
        if (this.closeIcon && this.actionForm) {
          this.closeIcon.addEventListener('click', () => this.closeActionForm());
        }
    
        // Gestionnaire pour le bouton MAX
        if (this.maxButton) {
          this.maxButton.addEventListener('click', () => this.setMaxAmount());
        }
    
        // Gestionnaire pour confirmer l'action
        if (this.confirmButton) {
          this.confirmButton.addEventListener('click', () => this.confirmAction());
        }
    
        // Gestionnaire pour le toggle montant/profit
        if (this.toggleButton) {
          this.toggleButton.addEventListener('click', () => this.toggleAmountProfit());
        }
    
        // Gestion des Durées (pour Actifs Alternatifs)
        if (this.durationButtons.length > 0) {
          this.durationButtons.forEach(button => {
            button.addEventListener('click', () => this.selectDuration(button));
          });
        }
      } else {
        // Gestion spécifique pour le toggle du Dashboard (pas d'element)
        if (this.toggleButton) {
          this.toggleButton.addEventListener('click', this.customInvestHandler);
        }
      }

       // Charger l'état d'activation depuis les données sauvegardées
       this.overlayActivated = checkModuleActivation(this.moduleName);
       if (this.overlayActivated) {
        this.activate();
       }
   
       // Charger les données depuis localStorage
       this.loadData();
     }
   
     /**
      * Met à jour l'interface utilisateur spécifique au module.
      */
     updateModuleUI(age = null) {
       switch (this.moduleName) {
         case 'livretA':
           this.amountEl.textContent = `€${livretA.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, "'")} investis`;
           this.profitEl.textContent = `€${livretAProfit.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, "'")} de profit`;
           this.investButton.disabled = livretA >= MAX_LIVRET_A;
           this.withdrawButton.style.display = (livretA < 0.01) ? 'none' : 'inline-block';
           break;
   
         case 'obligations':
           this.amountEl.textContent = `€${obligations.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, "'")} investis`;
           this.withdrawButton.style.display = (obligations < 100) ? 'none' : 'inline-block';
           break;
   
         case 'actions':
           this.amountEl.textContent = `€${actions.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, "'")} investis`;
           this.profitEl.textContent = `€${actionsProfit.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, "'")} de profit`;
           this.withdrawButton.style.display = (actions < 100) ? 'none' : 'inline-block';
           break;
   
         case 'residencePrincipale':
           if (age !== null) {
             this.element.querySelector('#residence-age').textContent = age;
           }
           this.element.querySelector('#residence-taille').textContent = residenceSurfaceCible;
   
           if (residenceInvested) {
             this.element.querySelector('#residence-investedAmount').textContent = `${residenceInvestedAmount.toLocaleString('fr-FR')} € investis`;
             this.element.querySelector('#residence-profit').textContent = `${residenceProfit.toLocaleString('fr-FR')} € de profit`;
           }
           break;
   
         case 'fondsImmobiliers':
           this.amountEl.textContent = `€${fondsImmobiliers.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, "'")} investis`;
           this.withdrawButton.style.display = (fondsImmobiliers < 100) ? 'none' : 'inline-block';
           break;
   
         case 'actifsAlternatifs':
           this.investButton.disabled = actifsAlternatifsInvestments.length >= MAX_ACTIFS_INVESTMENTS || availableMoney < ACTIVITE_ALTERNATIF_MIN_INVEST;
           break;
   
         default:
           console.warn(`Mise à jour UI non implémentée pour le module: ${this.moduleName}`);
       }
     }
   
     /**
      * Active le module en l'affichant et en mettant à jour l'état.
      */
     activate() {
       this.overlayActivated = true;
       this.element.classList.remove('hidden');
       updateModulesLayout();
     }
   
     /**
      * Ouvre le formulaire d'action avec l'action spécifiée (invest, withdraw, sell).
      * @param {string} actionType - Type d'action ("invest", "withdraw", "sell").
      */
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
       if (this.actionForm) {
         this.actionForm.classList.remove('hidden');
         this.actionForm.classList.add('show');
         this.actionAmountInput.value = '';
         this.actionAmountInput.focus();
       }
   
       // Gestion spécifique pour Actifs Alternatifs
       if (this.moduleName === 'actifsAlternatifs') {
         if (this.actionAmountInput) this.actionAmountInput.value = '10000';
         const state1 = this.element.querySelector('.actifs-state-1');
         const state2 = this.element.querySelector('.actifs-state-2');
         if (state1 && state2) {
           state1.classList.add('hidden');
           state2.classList.remove('hidden');
         }
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
   
     }
   
     /**
      * Ferme le formulaire d'action et réaffiche les boutons Investir/Retirer.
      */
     closeActionForm() {
       if (this.actionForm) {
         this.actionForm.classList.remove('show');
         this.actionForm.classList.add('hidden');
       }
       if (this.investButton) this.investButton.classList.remove('hidden');
       if (this.withdrawButton) this.withdrawButton.classList.remove('hidden');
   
       // Gestion spécifique pour Actifs Alternatifs
       if (this.moduleName === 'actifsAlternatifs') {
         const state1 = this.element.querySelector('.actifs-state-1');
         const state2 = this.element.querySelector('.actifs-state-2');
         if (state1 && state2) {
           state1.classList.remove('hidden');
           state2.classList.add('hidden');
         }
       }
     }
   
     /**
      * Définit le montant maximal disponible pour l'action.
      */
     setMaxAmount() {
       let maxAmount = 0;
       const actionType = this.confirmButton?.getAttribute('data-action-type'); // Type d'action
   
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
       if (this.actionAmountInput) {
         this.actionAmountInput.value = maxAmount.toFixed(2);
       }
     }
   
     /**
      * Confirme l'action (investir, retirer, vendre).
      */
     confirmAction() {
       const amount = parseFloat(this.actionAmountInput?.value);
       const actionType = this.confirmButton?.getAttribute('data-action-type');
   
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
   
     /**
      * Gestion spécifique pour Livret A.
      * @param {number} amount - Montant de l'action.
      * @param {string} actionType - Type d'action ("invest", "withdraw").
      */
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
   
     /**
      * Gestion spécifique pour Actions.
      * @param {number} amount - Montant de l'action.
      * @param {string} actionType - Type d'action ("invest", "withdraw").
      */
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
   
     /**
      * Gestion spécifique pour Actifs Alternatifs.
      * @param {number} amount - Montant de l'investissement.
      */
     handleActifsAlternatifsAction(amount) {
       if (isNaN(amount) || amount < ACTIVITE_ALTERNATIF_MIN_INVEST) {
         alert(`Veuillez entrer un montant valide (minimum ${ACTIVITE_ALTERNATIF_MIN_INVEST.toLocaleString('fr-FR')} €).`);
         return;
       }
   
       if (availableMoney < amount) {
         alert("Pas assez d'argent disponible pour investir !");
         return;
       }
   
       const duree = this.durationSelected === 3 ? "3ans" : "7ans";
       const roiFinal = selectFinalROI(duree);
       const dureeEnMois = this.durationSelected * 12;
       const monthlyROI = calculateMonthlyROI(roiFinal, dureeEnMois);

       const investment = {
         amount: amount,
         duration: this.durationSelected,
         startMonth: currentMonthIndex,
         profit: 0,
         roiFinal: roiFinal,
         monthlyROI: monthlyROI,
         id: Date.now() // Identifiant unique
       };
   
       actifsAlternatifsInvestments.push(investment);
       availableMoney -= amount;
       addActifsInvestmentToUI(investment);
       saveData();
       updateUI();
       this.closeActionForm();
     }
   
     /**
      * Sélectionne la durée pour Actifs Alternatifs.
      * @param {HTMLElement} button - Bouton de durée cliqué.
      */
     selectDuration(button) {
       this.durationSelected = parseInt(button.getAttribute('data-duration'), 10);
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
   
     /**
      * Bascule entre l'affichage du montant investi et des profits.
      */
     toggleAmountProfit() {
       if (this.amountEl.classList.contains('active')) {
         this.amountEl.classList.remove('active');
         this.profitEl.classList.add('active');
       } else {
         this.profitEl.classList.remove('active');
         this.amountEl.classList.add('active');
       }
     }
   
     /**
      * Sauvegarde les données spécifiques du module dans le localStorage.
      */
     saveData() {
       try {
         localStorage.setItem(`${this.moduleName}Investments`, JSON.stringify(actifsAlternatifsInvestments));
       } catch (error) {
         console.error(`Erreur lors de la sauvegarde des données pour ${this.moduleName}:`, error);
       }
     }
   
     /**
      * Charge les données spécifiques du module depuis le localStorage.
      */
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
   
     /**
      * Affiche l'état investi pour la Résidence Principale.
      */
     showInvestedState() {
       if (this.moduleName === 'residencePrincipale') {
         const state1 = this.element.querySelector('.residence-state.state-1');
         const state2 = this.element.querySelector('.residence-state.state-2');
         if (state1 && state2) {
           state1.classList.add('hidden');
           state2.classList.remove('hidden');
         }
       }
     }
   }
   
   /* -----------------------------
      Instances
      ----------------------------- */
   
   const dashboardModule = new InvestmentModule('dashboard', {
     customInvestHandler: handleDashboardToggle
   });
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
   
   /* -----------------------------
      Fonctions Spécifiques des Modules
      ----------------------------- */
   
   // Module Obligations
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
   
   // Module Résidence Principale
   function handleResidenceInvest() {
     if (availableMoney >= residenceArgentNecessaire) {
       availableMoney -= residenceArgentNecessaire;
       residenceInvestedAmount += residenceArgentNecessaire;
       residenceProfit = 0;
       residenceInvested = true; // Marquer comme investi
       residenceModule.showInvestedState();
   
       saveData();
       updateUI();
     } else {
       alert("Pas assez d'argent disponible pour investir dans la Résidence Principale !");
     }
   }
   
   function handleResidenceSell() {
     if (residenceInvested) {
       const sellAmount = residenceInvestedAmount; // Inclus déjà le Profit
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
   
   // Module Fonds Immobiliers
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
   
   /* -----------------------------
      Fonctions de Gestion des Overlays
      ----------------------------- */
   
   /**
    * Affiche un overlay et met en pause le jeu.
    * @param {HTMLElement} overlayElement - Élément de l'overlay à afficher.
    */
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
   
   /**
    * Cache un overlay et reprend le jeu.
    * @param {HTMLElement} overlayElement - Élément de l'overlay à masquer.
    */
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
   
   /**
    * Initialise la navigation des overlays (Précédent, Suivant, Continuer).
    * @param {HTMLElement} overlayElement - Élément de l'overlay.
    */
   function initializeOverlayNavigation(overlayElement) {
     const messages = overlayElement.querySelectorAll('.overlay-message');
     const prevButton = overlayElement.querySelector('.prev-button');
     const nextButton = overlayElement.querySelector('.next-button');
     const continueButton = overlayElement.querySelector('.overlay-continue-button');
     const dots = overlayElement.querySelectorAll('.nav-dot');
     let currentMessageIndex = 0;
   
     /**
      * Affiche le message courant dans l'overlay.
      * @param {number} index - Index du message à afficher.
      */
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

     /**
      * Animation des points pour indiquer le message actif
      */
     function updateDots() {
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentMessageIndex);
      });
    }
   
     // Initialiser l'affichage
     showMessage(currentMessageIndex);
   
     // Gestionnaire pour le bouton Précédent
     prevButton.onclick = () => {
       if (currentMessageIndex > 0) {
         messages[currentMessageIndex].classList.remove('active');
         currentMessageIndex--;
         messages[currentMessageIndex].classList.add('active');
         showMessage(currentMessageIndex);
         updateDots();
       }
     };
   
     // Gestionnaire pour le bouton Suivant
     nextButton.onclick = () => {
       if (currentMessageIndex < messages.length - 1) {
        messages[currentMessageIndex].classList.remove('active');        
        currentMessageIndex++;
        messages[currentMessageIndex].classList.add('active');
         showMessage(currentMessageIndex);
         updateDots();
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
   
   /* -----------------------------
      Fonctions de Gestion des Modules et du Jeu
      ----------------------------- */
   
   /**
    * Vérifie si un module doit être activé en fonction du nom du module et du temps écoulé.
    * @param {string} moduleName - Nom du module.
    * @returns {boolean} - True si le module doit être activé, sinon False.
    */
   function checkModuleActivation(moduleName) {
     switch(moduleName) {
       case 'livretA':
         return true; // Toujours activé
       case 'obligations':
         return currentYearIndex >= 2;
       case 'actions':
         return currentYearIndex >= 3;
       case 'residencePrincipale':
         return currentYearIndex >= 5;
       case 'fondsImmobiliers':
         return currentYearIndex >= 7;
       case 'actifsAlternatifs':
         return currentYearIndex >= 10;
       default:
         return false;
     }
   }
   
   /**
    * Met à jour la disposition des modules en fonction des modules activés et des jalons temporels.
    */
   function updateModulesLayout() {
     if (currentYearIndex >= 5) {
       bottomModules.classList.remove('hidden');
     }
   
     if (currentYearIndex >= 7) {
       fondsImmobiliersModule.element.classList.remove('hidden');
     }
   
     if (currentYearIndex >= 10) {
       actifsAlternatifsModule.element.classList.remove('hidden');
     }
   
     // Adapter l'orientation des modules en haut selon l'état
     const topModules = document.querySelector('.top-modules');
     if (currentYearIndex >= 5) {
       topModules.style.flexDirection = 'row';
       topModules.style.justifyContent = 'center';
     } else {
       topModules.style.flexDirection = 'column';
       topModules.style.justifyContent = 'flex-start';
     }
   }
   
   /**
    * Vérifie les jalons temporels et active les modules si nécessaire.
    */
   function checkTimeMilestones() {
     if (currentYearIndex === 5 && currentMonthIndex % 12 === 0) {
       residenceModule.activate();
     }
   
     if (currentYearIndex === 7 && currentMonthIndex % 12 === 0) {
       fondsImmobiliersModule.activate();
     }
   
     if (currentYearIndex === 10 && currentMonthIndex % 12 === 0) {
       actifsAlternatifsModule.activate();
     }
   }
   
   /**
    * Active un module en le rendant visible.
    * @param {string} moduleName - Nom du module à activer.
    */
   function activateModule(moduleName) {
     const module = document.querySelector(`.module[data-module="${moduleName}"]`);
     if (module) {
       module.classList.remove('hidden');
     } else {
       console.warn(`Module ${moduleName} non trouvé.`);
     }
   }
   
   /**
    * Fonction de calcul du rendement mensuel.
    * @param {number} balance - Solde actuel.
    * @param {number} rate - Taux de rendement mensuel.
    * @param {number} profit - Profit actuel.
    * @returns {Object} - Nouvel équilibre et profit.
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
          // Fin de partie
          clearInterval(gameInterval);
          showEndScreen();
          return;
        }
      
   
       currentYearIndex = Math.floor(currentMonthIndex / 12) + 1;
   
       // Augmenter l'argent disponible chaque mois
       availableMoney += 1000;

       // Calculer le total de la richesse et du profit
       totalWealth = calculateTotalWealth();
       totalProfit = calculateTotalProfit();
   
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
         const residenceMonthlyRate = 0.003; // Exemple de taux de rendement mensuel pour la résidence
         const residenceResult = applyMonthlyReturn(residenceInvestedAmount, residenceMonthlyRate, residenceProfit);
         residenceInvestedAmount = residenceResult.newBalance;
         residenceProfit = residenceResult.newProfit;
       }
   
       // Appliquer les rendements mensuels pour Actifs Alternatifs
       if (actifsAlternatifsInvestments.length > 0) {
         updateActifsProfits();
       }
   
       // Mettre à jour l'interface utilisateur et sauvegarder les données
       updateUI();
       saveData();
   
       // Vérifier et afficher les overlays si nécessaire
       checkAndShowOverlays();
   
       // Vérifier les jalons temporels pour mettre à jour la disposition des modules d'investissement
       checkTimeMilestones();
       updateModulesLayout();
   
     }, 500); // Intervalle en ms qui représente un mois
   }

    /* -----------------------------
    Fonctions de Fin de Partie
    ----------------------------- */

    /**
     * Affiche la page de fin de partie avec les statistiques.
     */
    function showEndScreen() {
      pauseGame();
      gameContainer.classList.add('hidden');

      document.getElementById('stats-years').textContent = currentYearIndex;
      document.getElementById('stats-totalMoney').textContent = formatNumber(availableMoney + livretA + obligations + actions + residenceInvestedAmount + fondsImmobiliers);
      document.getElementById('stats-livretA').textContent = formatNumber(livretA);
      document.getElementById('stats-actions').textContent = formatNumber(actions);
      document.getElementById('stats-obligations').textContent = formatNumber(obligations);
      document.getElementById('stats-residence').textContent = formatNumber(residenceInvestedAmount + residenceProfit);
      document.getElementById('stats-fondsImmobiliers').textContent = formatNumber(fondsImmobiliers);
      document.getElementById('stats-actifsProfit').textContent = formatNumber(actifsAlternatifsTotalProfit);
      document.getElementById('end-message').textContent = `Félicitations ! Vous avez complété la simulation en ${currentYearIndex} années. Voici vos résultats :`;

      endScreen.classList.remove('hidden');

      restartButton.removeEventListener('click', restartGame); // Éviter les doublons
      restartButton.addEventListener('click', restartGame);
    }

    /**
     * Redémarre le jeu en réinitialisant les variables et l'interface.
     */
    function restartGame() {
      // Réinitialiser les variables globales
      currentYearIndex = 1;
      currentMonthIndex = 0;
      availableMoney = 100000;
      totalWealth = 100000;
      totalProfit = 0;
      livretA = 0;
      livretAProfit = 0;
      obligations = 0;
      obligationsProfit = 0;
      actions = 0;
      actionsProfit = 0;
      residenceInvested = false;
      residenceInvestedAmount = 0;
      residenceProfit = 0;
      fondsImmobiliers = 0;
      fondsImmobiliersProfit = 0;
      actifsAlternatifsInvestments = [];
      actifsAlternatifsTotalProfit = 0;
      isOverlayActive = false;

      // Réinitialiser l'affichage du Dashboard
      isShowingTotalWealth = true;
      updateDashboardToggle();
      
      // Réinitialiser l'affichage des modules d'investissement
      if (obligationsModule.element) obligationsModule.element.classList.add('hidden');
      if (actionsModule.element) actionsModule.element.classList.add('hidden');
      if (bottomModules) bottomModules.classList.add('hidden');
      if (fondsImmobiliersModule.element) fondsImmobiliersModule.element.classList.add('hidden');
      if (actifsAlternatifsModule.element) actifsAlternatifsModule.element.classList.add('hidden');

      // Réinitialiser l'état du module Résidence Principale
      const residenceState1 = residenceModule.element.querySelector('.residence-state.state-1');
      const residenceState2 = residenceModule.element.querySelector('.residence-state.state-2');
      if (residenceState1) residenceState1.classList.remove('hidden');
      if (residenceState2) residenceState2.classList.add('hidden');

      // Réinitialiser les overlays
      livretAModule.overlayActivated = false;
      hideOverlay(overlayLivretA);
      obligationsModule.overlayActivated = false;
      hideOverlay(overlayObligations);
      actionsModule.overlayActivated = false;
      hideOverlay(overlayActions);
      residenceModule.overlayActivated = false;
      hideOverlay(overlayResidencePrincipale);
      fondsImmobiliersModule.overlayActivated = false;
      hideOverlay(overlayFondsImmobiliers);
      actifsAlternatifsModule.overlayActivated = false;
      hideOverlay(overlayActifsAlternatifs);

      // Sauvegarder les données réinitialisées dans le localStorage
      saveData();

      updateUI();
      endScreen.classList.add('hidden');
      gameContainer.classList.remove('hidden');
      startGame();
    }

    /**
     * Formate un nombre avec des séparateurs de milliers.
     * @param {number} number - Le nombre à formater.
     * @returns {string} - Le nombre formaté.
     */
    function formatNumber(number) {
      return number.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\s/g, "'");
    }

   /* -----------------------------
      Fonctions de Contrôle du Jeu
      ----------------------------- */
   
   /**
    * Met en pause le jeu en arrêtant l'intervalle.
    */
   function pauseGame() {
     clearInterval(gameInterval);
   }
   
   /**
    * Reprend le jeu en redémarrant l'intervalle.
    */
   function resumeGame() {
     startGame();
   }
   
   /* -----------------------------
      Fonctions Spécifiques de l'Écran d'Introduction
      ----------------------------- */
   
   /**
    * Affiche l'écran d'introduction et cache le jeu.
    */
   function showIntroScreen() {
     introScreen.classList.remove('hidden');
     gameContainer.classList.add('hidden');
   }
   
   /**
    * Cache l'écran d'introduction et affiche le jeu.
    */
   function hideIntroScreen() {
     introScreen.classList.add('hidden');
     gameContainer.classList.remove('hidden');
   }
   
   /**
    * Gestionnaire de clic pour le bouton "Jouer".
    */
   function handlePlayButtonClick() {
     hideIntroScreen();
     init();

     // Afficher l'overlay du Livret A dès le début
     setTimeout(() => {
       showOverlay(overlayLivretA);
       livretAModule.overlayActivated = true;
     }, 100); // Petit délai pour assurer que l'interface est prête
  }
   
   /**
    * Initialisation spécifique pour l'écran d'introduction.
    */
   function initIntro() {
     showIntroScreen();
     playButton.addEventListener('click', handlePlayButtonClick);
   }
   
   /* -----------------------------
      Fonctions de Gestion des Overlays
      ----------------------------- */
   
   /**
    * Vérifie et affiche les overlays en fonction de l'année écoulée.
    */
   function checkAndShowOverlays() {
     if (currentYearIndex === 1 && currentMonthIndex % 12 === 0 && !livretAModule.overlayActivated) {
       showOverlay(overlayLivretA);
       livretAModule.overlayActivated = true;
     }

     if (currentYearIndex === 2 && currentMonthIndex % 12 === 0 && !obligationsModule.overlayActivated) {
       showOverlay(overlayObligations);
       obligationsModule.overlayActivated = true;
     }
   
     if (currentYearIndex === 3 && currentMonthIndex % 12 === 0 && !actionsModule.overlayActivated) {
       showOverlay(overlayActions);
       actionsModule.overlayActivated = true;
     }
  
     if (currentYearIndex === 5 && currentMonthIndex % 12 === 0 && !residenceModule.overlayActivated) {
       showOverlay(overlayResidencePrincipale);
       residenceModule.overlayActivated = true;
     }
  
     if (currentYearIndex === 7 && currentMonthIndex % 12 === 0 && !fondsImmobiliersModule.overlayActivated) {
       showOverlay(overlayFondsImmobiliers);
       fondsImmobiliersModule.overlayActivated = true;
     }
  
     if (currentYearIndex === 10 && currentMonthIndex % 12 === 0 && !actifsAlternatifsModule.overlayActivated) {
       showOverlay(overlayActifsAlternatifs);
       actifsAlternatifsModule.overlayActivated = true;
     }
   }
   
   /* -----------------------------
      Initialisation de l'Application
      ----------------------------- */
   
   /**
    * Initialise le jeu en chargeant les données et en démarrant l'intervalle de jeu.
    */
   function init() {
     restartGame();
     /*loadData();
     updateUI();
     startGame();*/
   }
   
   // Appel de l'initialisation de l'intro au chargement de la page
   document.addEventListener('DOMContentLoaded', initIntro);
   