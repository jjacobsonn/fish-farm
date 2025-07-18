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
  
  // Re-initialize buttons when game screen is shown
  setTimeout(() => {
    initializeButtons();
  }, 100);
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

// Render fish with images instead of emojis
function renderFish(tank) {
  fishLayer.innerHTML = '';
  tank.forEach((f, i) => {
    const fishImage = assetManager.getFishImage(f.name);
    const top = 20 + Math.random() * 60;
    const left = 2 + Math.random() * 90;
    const direction = Math.random() > 0.5 ? 1 : -1;
    
    // Create fish element
    const fishElement = document.createElement('div');
    fishElement.className = 'fish-sprite fish-dropin';
    fishElement.style.cssText = `
      position: absolute;
      top: ${top}%;
      left: ${left}%;
      width: 64px;
      height: 64px;
      cursor: pointer;
      user-select: none;
      transition: transform 0.3s;
      z-index: 20;
      animation: fishSwimX 8s linear infinite alternate;
      animation-direction: ${direction === 1 ? 'normal' : 'reverse'};
    `;
    fishElement.dataset.fishIndex = i;
    
    if (fishImage && assetManager.hasImage(`fish-${f.name}`)) {
      // Use loaded image
      const img = document.createElement('img');
      img.src = fishImage.src;
      img.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: contain;
        filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
        transform: ${direction === -1 ? 'scaleX(-1)' : 'scaleX(1)'};
      `;
      img.alt = f.name;
      fishElement.appendChild(img);
    } else {
      // Fallback to emoji if image not loaded
      const fallbackEmojis = ['🐠', '🐟', '🐡', '🦑', '🐬'];
      fishElement.innerHTML = fallbackEmojis[i % fallbackEmojis.length];
      fishElement.style.fontSize = '2.5rem';
      fishElement.style.lineHeight = '64px';
      fishElement.style.textAlign = 'center';
    }
    
    // Add click handler for fish info popup
    fishElement.addEventListener('click', (e) => {
      showFishInfo(f, e);
    });
    
    fishLayer.appendChild(fishElement);
  });
}

// Show fish info popup
function showFishInfo(fish, event) {
  // Remove existing popup
  const existingPopup = document.querySelector('.fish-info-popup');
  if (existingPopup) {
    existingPopup.remove();
  }
  
  const popup = document.createElement('div');
  popup.className = 'fish-info-popup';
  
  // Calculate level progress
  const levelProgress = (game.player.xp % (game.player.level * 100)) / (game.player.level * 100) * 100;
  
  popup.innerHTML = `
    <h4>${fish.name}</h4>
    <div class="stat-row">
      <span class="stat-label">Happiness:</span>
      <span class="stat-value">${Math.round(fish.happiness)}%</span>
    </div>
    <div class="progress-bar">
      <div class="progress-fill progress-happiness" style="width: ${fish.happiness}%"></div>
    </div>
    
    <div class="stat-row">
      <span class="stat-label">Hunger:</span>
      <span class="stat-value">${Math.round(fish.hunger)}%</span>
    </div>
    <div class="progress-bar">
      <div class="progress-fill progress-hunger" style="width: ${fish.hunger}%"></div>
    </div>
    
    <div class="stat-row">
      <span class="stat-label">Cleanliness:</span>
      <span class="stat-value">${Math.round(fish.cleanliness)}%</span>
    </div>
    <div class="progress-bar">
      <div class="progress-fill progress-cleanliness" style="width: ${fish.cleanliness}%"></div>
    </div>
    
    <div class="stat-row">
      <span class="stat-label">Health:</span>
      <span class="stat-value">${Math.round(fish.getHealthPercentage())}%</span>
    </div>
    
    <div class="stat-row">
      <span class="stat-label">Reward:</span>
      <span class="stat-value">${fish.getCoinReward()} coins</span>
    </div>
    
    <hr style="margin: 8px 0; border-color: #374151;">
    
    <div class="stat-row">
      <span class="stat-label">Your Level:</span>
      <span class="stat-value">${game.player.level}</span>
    </div>
    <div class="progress-bar">
      <div class="progress-fill progress-level" style="width: ${levelProgress}%"></div>
    </div>
    <div class="stat-row">
      <span class="stat-label">XP:</span>
      <span class="stat-value">${game.player.xp}/${game.player.level * 100}</span>
    </div>
    
    <div class="stat-row">
      <span class="stat-label">Next Biome:</span>
      <span class="stat-value">${getNextBiomeName()}</span>
    </div>
  `;
  
  // Position popup near the fish
  const rect = event.target.getBoundingClientRect();
  popup.style.left = `${rect.left + rect.width + 10}px`;
  popup.style.top = `${rect.top}px`;
  
  document.body.appendChild(popup);
  
  // Remove popup when clicking outside
  setTimeout(() => {
    document.addEventListener('click', function removePopup(e) {
      if (!popup.contains(e.target) && !event.target.contains(e.target)) {
        popup.remove();
        document.removeEventListener('click', removePopup);
      }
    });
  }, 100);
}

function getNextBiomeName() {
  // Since we only have one Basic biome now, progression is just level-based
  return 'Max Level';
}

// Enhanced vitals dropdown with better error handling and display
function createVitalsDropdown() {
  if (game.tank.length === 0) {
    showMessage('No fish in tank! Add some fish first to view vitals.', 'error');
    return;
  }
  
  const dropdown = document.createElement('div');
  dropdown.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  
  // Calculate overall tank health
  const totalHealth = game.tank.reduce((sum, fish) => sum + fish.getHealthPercentage(), 0);
  const avgHealth = totalHealth / game.tank.length;
  
  // Count fish that need care
  const fishNeedingCare = game.tank.filter(fish => fish.needsCare()).length;
  
  // Calculate level progress
  const levelProgress = (game.player.xp % (game.player.level * 100)) / (game.player.level * 100) * 100;
  
  // Calculate tank statistics
  const tankHunger = game.tank.reduce((sum, fish) => sum + fish.hunger, 0) / game.tank.length;
  const tankCleanliness = game.tank.reduce((sum, fish) => sum + fish.cleanliness, 0) / game.tank.length;
  const tankHappiness = game.tank.reduce((sum, fish) => sum + fish.happiness, 0) / game.tank.length;
  
  dropdown.innerHTML = `
    <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
      <h3 class="text-xl font-bold mb-4 text-gray-800">Aquarium Vitals</h3>
      
      <!-- Overall Tank Health -->
      <div class="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 class="font-semibold text-gray-700 mb-2">Overall Tank Health</h4>
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-600">Average Health:</span>
          <span class="font-bold ${avgHealth > 70 ? 'text-green-600' : avgHealth > 40 ? 'text-yellow-600' : 'text-red-600'}">${Math.round(avgHealth)}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill progress-happiness" style="width: ${avgHealth}%"></div>
        </div>
        <div class="text-sm text-gray-600 mt-2">
          ${fishNeedingCare} of ${game.tank.length} fish need attention
        </div>
      </div>
      
      <!-- Tank Vital Statistics -->
      <div class="mb-6 p-4 bg-blue-50 rounded-lg">
        <h4 class="font-semibold text-gray-700 mb-2">Tank Vital Statistics</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span class="text-sm text-gray-600">Tank Hunger Level:</span>
            <div class="progress-bar" style="height: 8px;">
              <div class="progress-fill progress-hunger" style="width: ${tankHunger}%"></div>
            </div>
            <span class="text-xs text-gray-500">${Math.round(tankHunger)}%</span>
          </div>
          <div>
            <span class="text-sm text-gray-600">Tank Cleanliness:</span>
            <div class="progress-bar" style="height: 8px;">
              <div class="progress-fill progress-cleanliness" style="width: ${tankCleanliness}%"></div>
            </div>
            <span class="text-xs text-gray-500">${Math.round(tankCleanliness)}%</span>
          </div>
          <div>
            <span class="text-sm text-gray-600">Tank Happiness:</span>
            <div class="progress-bar" style="height: 8px;">
              <div class="progress-fill progress-happiness" style="width: ${tankHappiness}%"></div>
            </div>
            <span class="text-xs text-gray-500">${Math.round(tankHappiness)}%</span>
          </div>
        </div>
      </div>
      
      <!-- Individual Fish Stats -->
      <div class="mb-6">
        <h4 class="font-semibold text-gray-700 mb-3">Individual Fish Status</h4>
        <div class="space-y-3">
          ${game.tank.map((fish, index) => {
            const health = fish.getHealthPercentage();
            const needsCare = fish.needsCare();
            return `
              <div class="p-3 border rounded-lg ${needsCare ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'}">
                <div class="flex items-center justify-between mb-2">
                  <span class="font-semibold">${fish.name}</span>
                  <span class="text-sm ${needsCare ? 'text-red-600' : 'text-green-600'}">${Math.round(health)}%</span>
                </div>
                <div class="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span class="text-gray-600">Happiness:</span>
                    <div class="progress-bar" style="height: 6px;">
                      <div class="progress-fill progress-happiness" style="width: ${fish.happiness}%"></div>
                    </div>
                  </div>
                  <div>
                    <span class="text-gray-600">Hunger:</span>
                    <div class="progress-bar" style="height: 6px;">
                      <div class="progress-fill progress-hunger" style="width: ${fish.hunger}%"></div>
                    </div>
                  </div>
                  <div>
                    <span class="text-gray-600">Cleanliness:</span>
                    <div class="progress-bar" style="height: 6px;">
                      <div class="progress-fill progress-cleanliness" style="width: ${fish.cleanliness}%"></div>
                    </div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      
      <!-- Player Progress -->
      <div class="mb-6 p-4 bg-blue-50 rounded-lg">
        <h4 class="font-semibold text-gray-700 mb-2">Player Progress</h4>
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-600">Level ${game.player.level}</span>
          <span class="text-sm text-gray-600">${game.player.xp}/${game.player.level * 100} XP</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill progress-level" style="width: ${levelProgress}%"></div>
        </div>
        <div class="text-sm text-gray-600 mt-2">
          Next: ${getNextBiomeName()}
        </div>
      </div>
      
      <!-- Food Inventory -->
      <div class="mb-6 p-4 bg-yellow-50 rounded-lg">
        <h4 class="font-semibold text-gray-700 mb-2">Food Inventory</h4>
        ${Object.keys(game.player.inventory.food).length > 0 ? 
          Object.entries(game.player.inventory.food).map(([foodName, quantity]) => `
            <div class="flex justify-between text-sm">
              <span>${foodName}</span>
              <span class="font-semibold">${quantity}</span>
            </div>
          `).join('') :
          '<div class="text-sm text-gray-600">No food in inventory - use "Buy Food" to purchase food!</div>'
        }
      </div>
      
      <button class="w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition close-dropdown">Close</button>
    </div>
  `;
  
  document.body.appendChild(dropdown);
  
  // Add event listeners
  dropdown.querySelector('.close-dropdown').onclick = () => {
    document.body.removeChild(dropdown);
  };
  
  dropdown.onclick = (e) => {
    if (e.target === dropdown) {
      document.body.removeChild(dropdown);
    }
  };
}

// Render decor with images
function renderDecor(decor) {
  const decorLayer = document.getElementById('decor-layer');
  if (decorLayer) {
    decorLayer.innerHTML = '';
    decor.forEach((d, i) => {
      const decorImage = assetManager.getDecorImage(d.name);
      
      // Position decor items at the bottom of the tank
      const left = 10 + (i * 15) % 80; // Spread them across the bottom
      const bottom = 5 + Math.random() * 10; // Slight variation in bottom position
      
      const decorElement = document.createElement('div');
      decorElement.className = 'decor-sprite';
      decorElement.style.cssText = `
        position: absolute;
        bottom: ${bottom}%;
        left: ${left}%;
        width: 80px;
        height: 80px;
        z-index: 2;
        transition: transform 0.3s;
      `;
      
      if (decorImage && assetManager.hasImage(`decor-${d.name}`)) {
        // Use loaded image
        const img = document.createElement('img');
        img.src = decorImage.src;
        img.style.cssText = `
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.2));
        `;
        img.alt = d.name;
        decorElement.appendChild(img);
      } else {
        // Fallback to emoji if image not loaded
        const fallbackEmojis = ['🌱', '🪨', '💰', '🪸', '🏛️'];
        decorElement.innerHTML = fallbackEmojis[i % fallbackEmojis.length];
        decorElement.style.fontSize = '3rem';
        decorElement.style.lineHeight = '80px';
        decorElement.style.textAlign = 'center';
      }
      
      // Add hover effect
      decorElement.addEventListener('mouseenter', () => {
        decorElement.style.transform = 'scale(1.1)';
      });
      decorElement.addEventListener('mouseleave', () => {
        decorElement.style.transform = 'scale(1)';
      });
      
      decorLayer.appendChild(decorElement);
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
  const foodCount = Object.keys(player.inventory.food).length;
  hud.innerHTML = `
    <span>Level: <b id='hud-level'>${player.level}</b></span> 
    <span>XP: <b id='hud-xp'>${player.xp}</b></span> 
    <span>Fish: <b>${tankStats.fishCount}</b></span>
    <span>Food: <b>${foodCount}</b></span>
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
  
  // Ensure messages container exists
  if (!messages) {
    console.error('Messages container not found!');
    return;
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

// Create fish purchase dropdown with level gating
function createFishDropdown() {
  const availableFish = game.getAvailableFish();
  
  if (availableFish.length === 0) {
    showMessage('No new fish available! Level up to unlock more fish.', 'error');
    return;
  }
  
  const dropdown = document.createElement('div');
  dropdown.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  dropdown.innerHTML = `
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
      <h3 class="text-lg font-bold mb-4 text-gray-800">Buy Fish</h3>
      <div class="text-sm text-gray-600 mb-4">Your coins: ${game.player.coins}</div>
      <div class="space-y-2">
        ${availableFish.map(fish => {
          const canAfford = game.player.coins >= fish.cost;
          const levelUnlocked = game.player.level >= (fish.unlockLevel || 1);
          const alreadyOwned = game.tank.some(f => f.name === fish.name);
          
          return `
            <button class="w-full text-left p-3 rounded-lg border transition fish-option ${canAfford && levelUnlocked && !alreadyOwned ? 'hover:bg-gray-100 border-gray-300' : 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-100'}" data-fish="${fish.name}" ${canAfford && levelUnlocked && !alreadyOwned ? '' : 'disabled'}>
              <div class="flex items-center justify-between">
                <div>
                  <span class="font-semibold">${fish.name}</span>
                  <div class="text-sm text-gray-600">
                    Cost: ${fish.cost} coins | Reward: ${fish.baseReward} coins per care
                    ${!levelUnlocked ? ` | Requires level ${fish.unlockLevel}` : ''}
                    ${alreadyOwned ? ' | Already owned' : ''}
                  </div>
                </div>
                <span class="text-sm font-medium ${canAfford && levelUnlocked && !alreadyOwned ? 'text-green-600' : 'text-gray-400'}">
                  ${canAfford && levelUnlocked && !alreadyOwned ? 'Available' : 'Unavailable'}
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
      if (btn.disabled) return;
      
      const fishName = btn.dataset.fish;
      const purchaseSystem = new PurchaseSystem(game);
      const result = purchaseSystem.purchaseFish(fishName);
      
      if (result.success) {
        showMessage(result.message, 'success');
        render();
      } else {
        showMessage(result.message, 'error');
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

// Create food purchase dropdown
function createFoodDropdown() {
  console.log('createFoodDropdown called'); // DEBUG LOG
  const availableFood = game.getAvailableFood();
  
  if (availableFood.length === 0) {
    showMessage('No food available in this biome!', 'error');
    return;
  }
  
  const dropdown = document.createElement('div');
  dropdown.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  dropdown.innerHTML = `
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
      <h3 class="text-lg font-bold mb-4 text-gray-800">Buy Food</h3>
      <div class="text-sm text-gray-600 mb-4">Your coins: ${game.player.coins}</div>
      <div class="space-y-2">
        ${availableFood.map(food => {
          const canAfford = game.player.coins >= food.cost;
          const levelUnlocked = game.player.level >= food.unlockLevel;
          
          return `
            <button class="w-full text-left p-3 rounded-lg border transition food-option ${canAfford && levelUnlocked ? 'hover:bg-gray-100 border-gray-300' : 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-100'}" data-food="${food.name}" ${canAfford && levelUnlocked ? '' : 'disabled'}>
              <div class="flex items-center justify-between">
                <div>
                  <span class="font-semibold">${food.name}</span>
                  <div class="text-sm text-gray-600">
                    Cost: ${food.cost} coins
                    ${food.effect.hunger ? `| +${food.effect.hunger} hunger` : ''}
                    ${food.effect.happiness ? `| +${food.effect.happiness} happiness` : ''}
                    ${!levelUnlocked ? ` | Requires level ${food.unlockLevel}` : ''}
                  </div>
                </div>
                <span class="text-sm font-medium ${canAfford && levelUnlocked ? 'text-green-600' : 'text-gray-400'}">
                  ${canAfford && levelUnlocked ? 'Available' : 'Unavailable'}
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
  dropdown.querySelectorAll('.food-option').forEach(btn => {
    btn.onclick = () => {
      if (btn.disabled) return;
      
      console.log('Food option clicked:', btn.dataset.food); // DEBUG LOG
      const foodName = btn.dataset.food;
      const purchaseSystem = new PurchaseSystem(game);
      const result = purchaseSystem.purchaseFood(foodName, 1);
      
      if (result.success) {
        showMessage(result.message, 'success');
        render();
      } else {
        showMessage(result.message, 'error');
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

// Enhanced feed food selection dropdown with better error handling
function createFeedFoodDropdown() {
  const availableFood = game.player.getAvailableFood();
  
  if (availableFood.length === 0) {
    // No food available - show option to use basic food or buy food
    const dropdown = document.createElement('div');
    dropdown.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    dropdown.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
        <h3 class="text-lg font-bold mb-4 text-gray-800">Feed Fish</h3>
        <div class="text-sm text-gray-600 mb-4">No food in inventory!</div>
        <div class="p-4 bg-yellow-50 rounded-lg mb-4">
          <p class="text-sm text-gray-700 mb-2">You can:</p>
          <ul class="text-sm text-gray-600 list-disc pl-4">
            <li>Use basic food (free but less effective)</li>
            <li>Buy food for better results</li>
          </ul>
        </div>
        <button class="w-full py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition basic-food-btn mb-2">Use Basic Food (Free)</button>
        <button class="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition buy-food-btn mb-2">Buy Food</button>
        <button class="w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition close-dropdown">Cancel</button>
      </div>
    `;
    
    document.body.appendChild(dropdown);
    
    // Add event listeners
    dropdown.querySelector('.basic-food-btn').onclick = () => {
      const coinsEarned = game.feedFish();
      showMessage(`Fed all fish with basic food! Earned ${coinsEarned} coins.`, 'success');
      render();
      document.body.removeChild(dropdown);
    };
    
    dropdown.querySelector('.buy-food-btn').onclick = () => {
      document.body.removeChild(dropdown);
      createFoodDropdown();
    };
    
    dropdown.querySelector('.close-dropdown').onclick = () => {
      document.body.removeChild(dropdown);
    };
    
    dropdown.onclick = (e) => {
      if (e.target === dropdown) {
        document.body.removeChild(dropdown);
      }
    };
    return;
  }
  
  // Food available - show food selection
  const dropdown = document.createElement('div');
  dropdown.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  dropdown.innerHTML = `
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
      <h3 class="text-lg font-bold mb-4 text-gray-800">Feed Fish</h3>
      <div class="text-sm text-gray-600 mb-4">Select food to feed your fish:</div>
      <div class="space-y-2">
        ${availableFood.map(foodName => {
          const foodData = game.getFoodData(foodName);
          const quantity = game.player.getFoodQuantity(foodName);
          
          return `
            <button class="w-full text-left p-3 rounded-lg border hover:bg-gray-100 transition feed-food-option" data-food="${foodName}">
              <div class="flex items-center justify-between">
                <div>
                  <span class="font-semibold">${foodName}</span>
                  <div class="text-sm text-gray-600">
                    Quantity: ${quantity}
                    ${foodData.effect.hunger ? `| +${foodData.effect.hunger} hunger` : ''}
                    ${foodData.effect.happiness ? `| +${foodData.effect.happiness} happiness` : ''}
                  </div>
                </div>
                <span class="text-sm text-green-600">Use</span>
              </div>
            </button>
          `;
        }).join('')}
      </div>
      <button class="w-full mt-4 py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition basic-food-btn">Use Basic Food (Free)</button>
      <button class="w-full mt-2 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition close-dropdown">Cancel</button>
    </div>
  `;
  
  document.body.appendChild(dropdown);
  
  // Add event listeners
  dropdown.querySelectorAll('.feed-food-option').forEach(btn => {
    btn.onclick = () => {
      const foodName = btn.dataset.food;
      const coinsEarned = game.feedFish(foodName);
      showMessage(`Fed all fish with ${foodName}! Earned ${coinsEarned} coins.`, 'success');
      render();
      document.body.removeChild(dropdown);
    };
  });
  
  dropdown.querySelector('.basic-food-btn').onclick = () => {
    const coinsEarned = game.feedFish();
    showMessage(`Fed all fish with basic food! Earned ${coinsEarned} coins.`, 'success');
    render();
    document.body.removeChild(dropdown);
  };
  
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
  const availableDecor = game.getAvailableDecor();
  
  if (availableDecor.length === 0) {
    showMessage('No new decor available! Level up to unlock more decorations.', 'error');
    return;
  }
  
  const dropdown = document.createElement('div');
  dropdown.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  dropdown.innerHTML = `
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
      <h3 class="text-lg font-bold mb-4 text-gray-800">Buy Decor</h3>
      <div class="text-sm text-gray-600 mb-4">Your coins: ${game.player.coins}</div>
      <div class="space-y-2">
        ${availableDecor.map(decor => {
          const canAfford = game.player.coins >= decor.cost;
          const levelUnlocked = game.player.level >= decor.unlockLevel;
          
          return `
            <button class="w-full text-left p-3 rounded-lg border transition decor-option ${canAfford && levelUnlocked ? 'hover:bg-gray-100 border-gray-300' : 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-100'}" data-decor="${decor.name}" ${canAfford && levelUnlocked ? '' : 'disabled'}>
              <div class="flex items-center justify-between">
                <div>
                  <span class="font-semibold">${decor.name}</span>
                  <div class="text-sm text-gray-600">
                    Cost: ${decor.cost} coins
                    ${decor.effect.happiness ? `| +${decor.effect.happiness} happiness` : ''}
                    ${decor.effect.environment ? `| +${decor.effect.environment} environment` : ''}
                    ${!levelUnlocked ? ` | Requires level ${decor.unlockLevel}` : ''}
                  </div>
                </div>
                <span class="text-sm font-medium ${canAfford && levelUnlocked ? 'text-green-600' : 'text-gray-400'}">
                  ${canAfford && levelUnlocked ? 'Available' : 'Unavailable'}
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
      if (btn.disabled) return;
      
      const decorName = btn.dataset.decor;
      const purchaseSystem = new PurchaseSystem(game);
      const result = purchaseSystem.purchaseDecor(decorName);
      
      if (result.success) {
        showMessage(result.message, 'success');
        render();
      } else {
        showMessage(result.message, 'error');
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
import { assetManager } from './utils/AssetManager.js';
import { PurchaseSystem } from './utils/purchaseSystem.js';
import { fishData } from './data/fishData.js';
import { decorData } from './data/decorData.js';

const game = new Game();
game.init();

// Load assets before starting the game
assetManager.onLoadComplete = () => {
  console.log('All assets loaded successfully!');
  render();
  startGameLoop(game, render);
};

// Start loading assets
assetManager.preloadAssets(fishData, decorData);

console.log('Game initialized:', game);
console.log('Game tank:', game.tank);
console.log('Game player:', game.player);

function render() {
  renderBubbles();
  renderFish(game.tank);
  renderDecor(game.decor);
  renderHUD(game.player);
  initializeButtons(); // <-- Always re-attach handlers after render
}

// Initialize buttons after DOM is loaded
function initializeButtons() {
  // Button actions with enhanced functionality
  const feedBtn = document.getElementById('feed-btn');
  const cleanBtn = document.getElementById('clean-btn');
  const addDecorBtn = document.getElementById('add-decor-btn');
  const buyFoodBtn = document.getElementById('buy-food-btn');
  const addFishBtn = document.getElementById('add-fish-btn');
  const viewVitalsBtn = document.getElementById('view-vitals-btn');
  const clearTankBtn = document.getElementById('clear-tank-btn');

  // Debug: Check if buttons are found
  console.log('=== BUTTON INITIALIZATION ===');
  console.log('Feed button:', feedBtn);
  console.log('Buy food button:', buyFoodBtn);
  console.log('View vitals button:', viewVitalsBtn);
  console.log('Clean button:', cleanBtn);
  console.log('Add decor button:', addDecorBtn);
  console.log('Add fish button:', addFishBtn);
  console.log('Clear tank button:', clearTankBtn);
  console.log('Game object:', game);
  console.log('Game tank length:', game?.tank?.length);
  console.log('=== END BUTTON INIT ===');

  // Add button click effects (visual feedback only)
  function addButtonEffect(button) {
    if (button) {
      button.addEventListener('mousedown', function() {
        this.style.transform = 'scale(0.98)';
      });
      button.addEventListener('mouseup', function() {
        this.style.transform = '';
      });
      button.addEventListener('mouseleave', function() {
        this.style.transform = '';
      });
    }
  }

  // Apply effects to all buttons
  [feedBtn, cleanBtn, addDecorBtn, buyFoodBtn, addFishBtn, viewVitalsBtn, clearTankBtn].forEach(addButtonEffect);



  // Set up button event handlers
  if (feedBtn) {
    feedBtn.onclick = () => {
      if (game.tank.length === 0) {
        showMessage('No fish to feed! Buy some fish first.', 'error');
        return;
      }
      // Auto-feed with best food in inventory, or basic food if none
      const availableFood = game.player.getAvailableFood();
      let foodName = null;
      let foodLabel = 'basic food';
      if (availableFood.length > 0) {
        // Find the best food (highest hunger+happiness effect)
        let bestScore = -Infinity;
        for (const fname of availableFood) {
          const fdata = game.getFoodData(fname);
          if (fdata) {
            const score = (fdata.effect.hunger || 0) + (fdata.effect.happiness || 0);
            if (score > bestScore) {
              bestScore = score;
              foodName = fname;
            }
          }
        }
        if (foodName) {
          foodLabel = foodName;
        }
      }
      const coinsEarned = game.feedFish(foodName);
      showMessage(`Fed all fish with ${foodLabel}! Earned ${coinsEarned} coins.`, 'success');
      render();
    };
  }

  if (cleanBtn) {
    cleanBtn.onclick = () => {
      if (game.tank.length === 0) {
        showMessage('No fish to clean! Buy some fish first.', 'error');
        return;
      }
      
      const coinsEarned = game.cleanTank();
      showMessage(`Cleaned all fish! Earned ${coinsEarned} coins.`, 'success');
      render();
    };
  }

  if (addDecorBtn) {
    addDecorBtn.onclick = () => {
      createDecorDropdown();
    };
  }

  if (buyFoodBtn) {
    buyFoodBtn.onclick = () => {
      const availableFood = game.getAvailableFood();
      
      if (availableFood.length === 0) {
        showMessage('No food available in this biome! Level up to unlock more food types.', 'error');
        return;
      }
      
      const affordableFood = game.getAffordableFood();
      
      if (affordableFood.length === 0) {
        showMessage('You cannot afford any food! Save up more coins to purchase food.', 'error');
        return;
      }
      
      createFoodDropdown();
    };
  }

  if (viewVitalsBtn) {
    console.log('Setting up view vitals button handler...');
    viewVitalsBtn.onclick = () => {
      console.log('View vitals button clicked!');
      if (game.tank.length === 0) {
        showMessage('No fish in tank! Add some fish first to view vitals.', 'error');
        return;
      }
      createVitalsDropdown();
    };
  }

  if (addFishBtn) {
    addFishBtn.onclick = () => {
      createFishDropdown();
    };
  }

  if (clearTankBtn) {
    clearTankBtn.onclick = () => {
      if (game.tank.length === 0 && game.decor.length === 0) {
        showMessage('Tank is already empty!', 'error');
        return;
      }
      
      const confirmClear = confirm('Are you sure you want to clear all fish and decor from your tank? This action cannot be undone.');
      if (confirmClear) {
        game.clearTank();
        showMessage('Tank cleared successfully!', 'success');
        render();
      }
    };
  }
}

// Test function to verify everything is working
function testGameFunctionality() {
  console.log('=== GAME FUNCTIONALITY TEST ===');
  console.log('Game object:', game);
  console.log('Game player:', game.player);
  console.log('Game tank:', game.tank);
  console.log('Current biome:', game.currentBiome);
  console.log('Available food:', game.getAvailableFood());
  console.log('Messages container:', messages);
  console.log('All buttons found:', {
    feedBtn: document.getElementById('feed-btn'),
    buyFoodBtn: document.getElementById('buy-food-btn'),
    viewVitalsBtn: document.getElementById('view-vitals-btn'),
    cleanBtn: document.getElementById('clean-btn'),
    addDecorBtn: document.getElementById('add-decor-btn'),
    addFishBtn: document.getElementById('add-fish-btn'),
    clearTankBtn: document.getElementById('clear-tank-btn')
  });
  console.log('=== END TEST ===');
}

// Run test after a delay (only in development)
setTimeout(testGameFunctionality, 500);



render();
startGameLoop(game, render); 