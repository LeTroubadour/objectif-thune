// Initialize amounts
let availableMoney = 1000; // starting available money
let livretA = 0;          // starting money in livret A

let currentYear = 1;      // Année courante
const totalYears = 40;    // Valeur fixe

// Get references to the DOM elements
const availableMoneyEl = document.getElementById('available-money');
const livretAEl = document.getElementById('livret-a-amount');
const investButton = document.getElementById('invest-button');
const withdrawButton = document.getElementById('withdraw-button');
const currentYearEl = document.getElementById('current-year');
const totalWealthEl = document.getElementById('total-wealth');

// Update the UI to reflect current amounts
function updateUI() {
  availableMoneyEl.textContent = `${availableMoney} €`;
  livretAEl.textContent = `${livretA} € investis`;
  currentYearEl.textContent = `Année ${currentYear} sur ${totalYears}`;

  // Update total wealth
  const totalWealth = availableMoney + livretA;
  totalWealthEl.textContent = `${totalWealth} €`;

  // Show or hide the "Retirer" button based on livretA amount
  if (livretA < 100) {
    withdrawButton.style.display = 'none';
  } else {
    withdrawButton.style.display = 'inline-block';
  }
}

// Simulate a monthly increment in available money
// For demonstration, we’ll just increase it every 5 seconds by 100€
setInterval(() => {
  availableMoney += 100;
  if (currentYear < totalYears) {
    currentYear++;
  }
  updateUI();
}, 5000);

// Handle livret A investment
investButton.addEventListener('click', () => {
  const investAmount = 100; // Example fixed investment amount
  if (availableMoney >= investAmount) {
    availableMoney -= investAmount;
    livretA += investAmount;
    updateUI();
  } else {
    alert("Pas assez d'argent disponible pour investir !");
  }
});

// Handle wlivret A withdrawal
withdrawButton.addEventListener('click', () => {
  const withdrawAmount = 100;
  if (livretA >= withdrawAmount) {
    livretA -= withdrawAmount;
    availableMoney += withdrawAmount;
    updateUI();
  } else {
    // This case should not occur since we hide the button if livretA < 100
    alert("Pas assez d'argent sur le Livret A pour retirer !");
  }
});

// Initial UI update on page load
updateUI();
