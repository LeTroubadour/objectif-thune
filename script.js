// Initialize amounts
let availableMoney = 1000; // starting available money
let livretA = 0;          // starting money in livret A

let currentYear = 1;      // Année courante
const totalYears = 40;    // Valeur fixe

// Get references to the DOM elements
const availableMoneyEl = document.getElementById('available-money');
const livretAEl = document.getElementById('livret-a-amount');
const investButton = document.getElementById('invest-button');
const currentYearEl = document.getElementById('current-year');

// Update the UI to reflect current amounts
function updateUI() {
  availableMoneyEl.textContent = `${availableMoney} €`;
  livretAEl.textContent = `${livretA} € investis`;
  currentYearEl.textContent = `Année ${currentYear} sur ${totalYears}`;
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

// Handle the "Investir" button click
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

// Initial UI update on page load
updateUI();
