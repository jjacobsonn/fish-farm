import { Game } from './game/Game.js';
import { startGameLoop } from './game/GameLoop.js';

// Start screen logic
const startScreen = document.getElementById('start-screen');
const gameContainer = document.getElementById('game-container');
const startBtn = document.getElementById('start-btn');
const howToPlayBtn = document.getElementById('how-to-play-btn');
const howToPlayScreen = document.getElementById('how-to-play-screen');
const backBtn = document.getElementById('back-btn');
const aquariumEffect = document.getElementById('aquarium-effect');
const aquariumEffectHowto = document.getElementById('aquarium-effect-howto');

function createBubbles(container, num = 18) {
  container.innerHTML = '';
  for (let i = 0; i < num; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    const size = Math.random() * 30 + 20;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.animationDuration = `${4 + Math.random() * 4}s`;
    bubble.style.opacity = 0.5 + Math.random() * 0.5;
    container.appendChild(bubble);
  }
}

createBubbles(aquariumEffect);
createBubbles(aquariumEffectHowto);

gameContainer.style.display = 'none';
startScreen.style.display = 'flex';
howToPlayScreen.style.display = 'none';

startBtn.onclick = () => {
  startScreen.style.display = 'none';
  gameContainer.style.display = 'block';
  howToPlayScreen.style.display = 'none';
  startFishFarm();
};

howToPlayBtn.onclick = () => {
  startScreen.style.display = 'none';
  howToPlayScreen.style.display = 'flex';
  gameContainer.style.display = 'none';
};

backBtn.onclick = () => {
  howToPlayScreen.style.display = 'none';
  startScreen.style.display = 'flex';
  gameContainer.style.display = 'none';
};

function startFishFarm() {
  const game = new Game();
  game.init();

  function render() {
    // Player stats
    const stats = document.getElementById('player-stats');
    stats.textContent = `Level: ${game.player.level} | XP: ${game.player.xp} | Coins: ${game.player.coins}`;

    // Tank
    const tank = document.getElementById('tank');
    if (game.tank.length) {
      tank.innerHTML = game.tank.map(f => `<div>${f.name} (😊${f.happiness})</div>`).join('');
    } else {
      tank.innerHTML = '<div>Your tank is empty! Use the "Add Fish" dropdown to get started.</div>';
    }

    // Decor
    const decor = document.getElementById('decor');
    decor.innerHTML = game.decor.length
      ? game.decor.map(d => `<div>${d.name}</div>`).join('')
      : '<div>No decor in tank.</div>';

    // Add Fish button dropdown
    const addFishBtn = document.getElementById('add-fish-btn');
    addFishBtn.onclick = null;
    addFishBtn.innerHTML = 'Add Fish';
    // Create a dropdown for fish selection
    let select = document.getElementById('fish-select');
    if (select) select.remove();
    select = document.createElement('select');
    select.id = 'fish-select';
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '-- Select Fish --';
    select.appendChild(defaultOption);
    game.currentBiome.fish.forEach(fishName => {
      const option = document.createElement('option');
      option.value = fishName;
      option.textContent = fishName;
      select.appendChild(option);
    });
    addFishBtn.parentNode.insertBefore(select, addFishBtn);
    select.onchange = () => {
      if (select.value) {
        if (game.addFish(select.value)) {
          messages.textContent = `Added fish: ${select.value}`;
        } else {
          messages.textContent = `Could not add fish: ${select.value}`;
        }
        select.value = '';
        render();
      }
    };
  }

  // Button actions
  const feedBtn = document.getElementById('feed-btn');
  const cleanBtn = document.getElementById('clean-btn');
  const addDecorBtn = document.getElementById('add-decor-btn');
  const restBtn = document.getElementById('rest-btn');
  const messages = document.getElementById('messages');

  // Show welcome message on first load
  if (!game.tank.length && !game.decor.length) {
    messages.textContent = 'Welcome to Fish Farm! Start by adding a fish to your tank.';
  }

  feedBtn.onclick = () => {
    const coins = game.feedFish();
    messages.textContent = `You fed your fish and earned ${coins} coins!`;
    render();
  };

  cleanBtn.onclick = () => {
    const coins = game.cleanTank();
    messages.textContent = `You cleaned the tank and earned ${coins} coins!`;
    render();
  };

  addDecorBtn.onclick = () => {
    // For demo, add first available decor from current biome
    const decorName = game.currentBiome.decor.find(
      name => !game.decor.some(d => d.name === name)
    );
    if (decorName) {
      if (game.addDecor(decorName)) {
        messages.textContent = `Added decor: ${decorName}`;
      } else {
        messages.textContent = `Not enough coins for ${decorName}`;
      }
    } else {
      messages.textContent = 'All decor added!';
    }
    render();
  };

  restBtn.onclick = () => {
    messages.textContent = 'Your fish are resting... (stub)';
  };

  render();
  startGameLoop(game, render);
} 