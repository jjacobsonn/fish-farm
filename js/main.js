// --- Start/Instructions Screen Logic ---
const startScreen = document.getElementById('start-screen');
const howToPlayScreen = document.getElementById('how-to-play-screen');
const startBtn = document.getElementById('start-btn');
const howToPlayBtn = document.getElementById('how-to-play-btn');
const backBtn = document.getElementById('back-btn');
const aquariumEffect = document.getElementById('aquarium-effect');
const aquariumEffectHowto = document.getElementById('aquarium-effect-howto');
const hud = document.getElementById('hud');
const aquarium = document.getElementById('aquarium');
const gameContainer = document.getElementById('game-container');
const fishLayer = document.getElementById('fish-layer');
const bubbleLayer = document.getElementById('bubble-layer');
const cogBtn = document.getElementById('cog-btn');
const controlsModal = document.getElementById('controls-modal');
const closeModal = document.getElementById('close-modal');
const siteBg = document.getElementById('site-bg');
const backToStartBtn = document.getElementById('back-to-start-btn');
const messages = document.getElementById('messages');

// Helper to create bubbles for start/instructions
function createBubbles(container, num = 18) {
  container.innerHTML = '';
  for (let i = 0; i < num; i++) {
    const size = 16 + Math.random() * 32;
    const left = Math.random() * 98;
    const duration = 4 + Math.random() * 5;
    const delay = Math.random() * 3;
    container.innerHTML += `<div class="bubble" style="width:${size}px;height:${size}px;left:${left}%;animation-duration:${duration}s;animation-delay:${delay}s;"></div>`;
  }
}
createBubbles(aquariumEffect, 18);
createBubbles(aquariumEffectHowto, 18);

// Hide game UI by default
startScreen.style.display = '';
howToPlayScreen.style.display = 'none';
gameContainer.style.display = 'none';
siteBg.style.display = 'none';
hud.style.display = 'none';
aquarium.style.display = 'none';

// Navigation logic
startBtn.onclick = () => {
  startScreen.style.display = 'none';
  howToPlayScreen.style.display = 'none';
  siteBg.style.display = '';
  gameContainer.style.display = '';
  hud.style.display = '';
  aquarium.style.display = '';
};
howToPlayBtn.onclick = () => {
  startScreen.style.display = 'none';
  howToPlayScreen.style.display = 'flex';
  siteBg.style.display = 'none';
  gameContainer.style.display = 'none';
};
backBtn.onclick = () => {
  howToPlayScreen.style.display = 'none';
  startScreen.style.display = 'flex';
  siteBg.style.display = 'none';
  gameContainer.style.display = 'none';
};

if (backToStartBtn) {
  backToStartBtn.onclick = () => {
    document.getElementById('start-screen').style.display = '';
    document.getElementById('how-to-play-screen').style.display = 'none';
    document.getElementById('site-bg').style.display = 'none';
    document.getElementById('game-container').style.display = 'none';
  };
}

// --- Tap Tap Fish–style UI rendering ---

// Emoji pools
const fishEmojis = ['🐠', '🐟', '🐡', '🦑', '🦐', '🦀', '🐬', '🐳', '🐋'];
const decorEmojis = ['🌱', '🪨', '🏝️', '🪸', '🌊', '🪷', '🪵', '🧜‍♂️'];

// Modal controls
if (cogBtn) cogBtn.onclick = () => controlsModal.classList.remove('hidden');
if (closeModal) closeModal.onclick = () => controlsModal.classList.add('hidden');

// Render bubbles
function renderBubbles() {
  bubbleLayer.innerHTML = '';
  for (let i = 0; i < 16; i++) {
    const size = 12 + Math.random() * 24;
    const left = Math.random() * 98;
    const duration = 3 + Math.random() * 5;
    const delay = Math.random() * 3;
    bubbleLayer.innerHTML += `<div class="bubble" style="width:${size}px;height:${size}px;left:${left}%;animation-duration:${duration}s;animation-delay:${delay}s;"></div>`;
  }
}

// Render fish
function renderFish(tank) {
  fishLayer.innerHTML = '';
  tank.forEach((f, i) => {
    const emoji = fishEmojis[i % fishEmojis.length];
    const top = 20 + Math.random() * 60;
    const left = 2 + Math.random() * 90; // wider range for wider tank
    const direction = Math.random() > 0.5 ? 1 : -1;
    const style = `top:${top}%;left:${left}%;animation-direction:${direction === 1 ? 'normal' : 'reverse'};`;
    fishLayer.innerHTML += `
      <div class="fish-emoji fish-dropin" style="${style}" title="${f.name}">
        ${emoji}
      </div>
    `;
  });
}

// Render decor
function renderDecor(decor) {
  const decorLayer = document.getElementById('decor-layer');
  if (decorLayer) {
    decorLayer.innerHTML = '';
    decor.forEach((d, i) => {
      const emoji = decorEmojis[i % decorEmojis.length];
      decorLayer.innerHTML += `<div class="text-3xl">${emoji}</div>`;
    });
  }
}

// Render HUD with enhanced information
function renderHUD(player) {
  const tankStats = game.getTankStats();
  
  // Update the prominent coins display in the header
  const coinsAmount = document.getElementById('coins-amount');
  if (coinsAmount) {
    const oldCoins = parseInt(coinsAmount.textContent) || 0;
    const newCoins = player.coins;
    
    coinsAmount.textContent = newCoins;
    
    // Add animation if coins changed
    if (oldCoins !== newCoins) {
      animateCoinChange(coinsAmount);
    }
  }
  
  // Update the HUD with other stats (coins are now prominently displayed in header)
  hud.innerHTML = `
    <span>Level: <b id='hud-level'>${player.level}</b></span> 
    <span>XP: <b id='hud-xp'>${player.xp}</b></span> 
    <span>Fish: <b>${tankStats.fishCount}</b></span>
    <span>Value: <b>${tankStats.totalValue}</b></span>
  `;
}

// Animate coin amount changes
function animateCoinChange(coinsElement) {
  coinsElement.classList.add('coin-change');
  setTimeout(() => {
    coinsElement.classList.remove('coin-change');
  }, 600);
}

// Show message to user
function showMessage(text, type = 'info') {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type} p-3 rounded-lg mb-2 text-center transition-opacity duration-500`;
  messageDiv.textContent = text;
  
  // Style based on type
  if (type === 'success') {
    messageDiv.style.backgroundColor = '#10b981';
    messageDiv.style.color = 'white';
  } else if (type === 'error') {
    messageDiv.style.backgroundColor = '#ef4444';
    messageDiv.style.color = 'white';
  } else {
    messageDiv.style.backgroundColor = '#3b82f6';
    messageDiv.style.color = 'white';
  }
  
  messages.appendChild(messageDiv);
  
  // Remove message after 3 seconds
  setTimeout(() => {
    messageDiv.style.opacity = '0';
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.parentNode.removeChild(messageDiv);
      }
    }, 500);
  }, 3000);
}

// Create fish selection dropdown with costs
function createFishDropdown() {
  const availableFish = game.currentBiome.fish.filter(
    fishName => !game.tank.some(f => f.name === fishName)
  );
  
  if (availableFish.length === 0) {
    showMessage('No more fish available in this biome!', 'error');
    return;
  }
  
  const dropdown = document.createElement('div');
  dropdown.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  dropdown.innerHTML = `
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
      <h3 class="text-lg font-bold mb-4 text-gray-800">Buy Fish</h3>
      <div class="text-sm text-gray-600 mb-4">Your coins: ${game.player.coins}</div>
      <div class="space-y-2">
        ${availableFish.map(fishName => {
          const fishData = game.getFishData(fishName);
          const canAfford = game.player.coins >= fishData.cost;
          const biomeData = game.biomes.find(b => b.name === fishData.biome);
          const levelUnlocked = !biomeData || game.player.level >= biomeData.unlock.level;
          
          return `
            <button class="w-full text-left p-3 rounded-lg border hover:bg-gray-100 transition fish-option ${canAfford && levelUnlocked ? '' : 'opacity-50'}" data-fish="${fishName}" ${canAfford && levelUnlocked ? '' : 'disabled'}>
              <div class="flex items-center justify-between">
                <div>
                  <span class="font-semibold">${fishName}</span>
                  <div class="text-sm text-gray-600">
                    Cost: ${fishData.cost} coins | Reward: ${fishData.baseReward} coins
                    ${!levelUnlocked ? ` | Requires level ${biomeData.unlock.level}` : ''}
                  </div>
                </div>
                <span class="text-sm ${canAfford && levelUnlocked ? 'text-green-600' : 'text-red-600'}">
                  ${canAfford && levelUnlocked ? '✓' : '✗'}
                </span>
              </div>
            </button>
          `;
        }).join('')}
      </div>
      <button class="w-full mt-4 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition close-dropdown">Cancel</button>
    </div>
  `;
  
  document.body.appendChild(dropdown);
  
  // Add event listeners
  dropdown.querySelectorAll('.fish-option').forEach(btn => {
    btn.onclick = () => {
      const fishName = btn.dataset.fish;
      const fishData = game.getFishData(fishName);
      
      if (game.player.coins < fishData.cost) {
        showMessage(`Not enough coins! ${fishName} costs ${fishData.cost} coins.`, 'error');
        return;
      }
      
      if (game.addFish(fishName)) {
        showMessage(`Purchased ${fishName} for ${fishData.cost} coins!`, 'success');
        render();
      } else {
        showMessage('Failed to purchase fish!', 'error');
      }
      document.body.removeChild(dropdown);
    };
  });
  
  dropdown.querySelector('.close-dropdown').onclick = () => {
    document.body.removeChild(dropdown);
  };
  
  dropdown.onclick = (e) => {
    if (e.target === dropdown) {
      document.body.removeChild(dropdown);
    }
  };
}

// Create decor selection dropdown with enhanced info
function createDecorDropdown() {
  const availableDecor = game.currentBiome.decor.filter(
    decorName => !game.decor.some(d => d.name === decorName)
  );
  
  if (availableDecor.length === 0) {
    showMessage('No more decor available in this biome!', 'error');
    return;
  }
  
  const dropdown = document.createElement('div');
  dropdown.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  dropdown.innerHTML = `
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
      <h3 class="text-lg font-bold mb-4 text-gray-800">Buy Decor</h3>
      <div class="text-sm text-gray-600 mb-4">Your coins: ${game.player.coins}</div>
      <div class="space-y-2">
        ${availableDecor.map(decorName => {
          const decorData = game.getDecorData(decorName);
          const canAfford = game.player.coins >= decorData.unlock.cost;
          const levelUnlocked = game.player.level >= decorData.unlock.level;
          
          return `
            <button class="w-full text-left p-3 rounded-lg border hover:bg-gray-100 transition decor-option ${canAfford && levelUnlocked ? '' : 'opacity-50'}" data-decor="${decorName}" ${canAfford && levelUnlocked ? '' : 'disabled'}>
              <div class="flex items-center justify-between">
                <div>
                  <span class="font-semibold">${decorName}</span>
                  <div class="text-sm text-gray-600">
                    Cost: ${decorData.unlock.cost} coins
                    ${decorData.effect.happiness ? `| +${decorData.effect.happiness} happiness` : ''}
                    ${decorData.effect.cleanliness ? `| +${decorData.effect.cleanliness} cleanliness` : ''}
                    ${!levelUnlocked ? ` | Requires level ${decorData.unlock.level}` : ''}
                  </div>
                </div>
                <span class="text-sm ${canAfford && levelUnlocked ? 'text-green-600' : 'text-red-600'}">
                  ${canAfford && levelUnlocked ? '✓' : '✗'}
                </span>
              </div>
            </button>
          `;
        }).join('')}
      </div>
      <button class="w-full mt-4 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition close-dropdown">Cancel</button>
    </div>
  `;
  
  document.body.appendChild(dropdown);
  
  // Add event listeners
  dropdown.querySelectorAll('.decor-option').forEach(btn => {
    btn.onclick = () => {
      const decorName = btn.dataset.decor;
      const decorData = game.getDecorData(decorName);
      
      if (game.player.coins < decorData.unlock.cost) {
        showMessage(`Not enough coins! ${decorName} costs ${decorData.unlock.cost} coins.`, 'error');
        return;
      }
      
      if (game.addDecor(decorName)) {
        showMessage(`Purchased ${decorName} for ${decorData.unlock.cost} coins!`, 'success');
        render();
      } else {
        showMessage('Failed to purchase decor!', 'error');
      }
      document.body.removeChild(dropdown);
    };
  });
  
  dropdown.querySelector('.close-dropdown').onclick = () => {
    document.body.removeChild(dropdown);
  };
  
  dropdown.onclick = (e) => {
    if (e.target === dropdown) {
      document.body.removeChild(dropdown);
    }
  };
}

// --- Game logic integration ---
import { Game } from './game/Game.js';
import { startGameLoop } from './game/GameLoop.js';

const game = new Game();
game.init();

function render() {
  renderBubbles();
  renderFish(game.tank);
  renderHUD(game.player);
}

// Button actions with enhanced functionality
const feedBtn = document.getElementById('feed-btn');
const cleanBtn = document.getElementById('clean-btn');
const addDecorBtn = document.getElementById('add-decor-btn');
const restBtn = document.getElementById('rest-btn');
const addFishBtn = document.getElementById('add-fish-btn');

// Add button click effects
function addButtonEffect(button) {
  button.addEventListener('click', function() {
    this.style.transform = 'scale(0.98)';
    setTimeout(() => {
      this.style.transform = '';
    }, 150);
  });
}

// Apply effects to all buttons
[feedBtn, cleanBtn, addDecorBtn, restBtn, addFishBtn].forEach(addButtonEffect);

feedBtn.onclick = () => {
  if (game.tank.length === 0) {
    showMessage('No fish to feed! Buy some fish first.', 'error');
    return;
  }
  
  const coinsEarned = game.feedFish();
  showMessage(`Fed all fish! Earned ${coinsEarned} coins.`, 'success');
  render();
};

cleanBtn.onclick = () => {
  if (game.tank.length === 0) {
    showMessage('No fish to clean! Buy some fish first.', 'error');
    return;
  }
  
  const coinsEarned = game.cleanTank();
  showMessage(`Cleaned all fish! Earned ${coinsEarned} coins.`, 'success');
  render();
};

addDecorBtn.onclick = () => {
  createDecorDropdown();
};

restBtn.onclick = () => {
  showMessage('Fish are resting peacefully...', 'info');
  // Could add rest logic here in the future
};

addFishBtn.onclick = () => {
  createFishDropdown();
};

render();
startGameLoop(game, render); 