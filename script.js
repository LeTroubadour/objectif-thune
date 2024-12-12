// Initialize amounts
let availableMoney = 1000; // starting available money
let livretA = 0;

// Get references to the DOM elements
const availableMoneyEl = document.getElementById('available-money');
const livretAEl = document.getElementById('livret-a-amount');
const investButton = document.getElementById('invest-button');

// Update the UI to reflect current amounts
function updateUI() {
  availableMoneyEl.textContent = `${availableMoney} €`;
  livretAEl.textContent = `${livretA} € investis`;
}

// Simulate a monthly increment in available money
// For demonstration, we’ll just increase it every 5 seconds by 100€
setInterval(() => {
  availableMoney += 100;
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
