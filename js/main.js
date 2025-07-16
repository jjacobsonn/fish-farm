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
hud.style.display = 'none';
aquarium.style.display = 'none';

// Navigation logic
startBtn.onclick = () => {
  startScreen.style.display = 'none';
  howToPlayScreen.style.display = 'none';
  gameContainer.style.display = '';
  hud.style.display = '';
  aquarium.style.display = '';
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

// --- Tap Tap Fish–style UI rendering ---

// Emoji pools
const fishEmojis = ['🐠', '🐟', '🐡', '🦑', '🦐', '🦀', '🐬', '🐳', '🐋'];
const decorEmojis = ['🌱', '🪨', '🏝️', '🪸', '🌊', '🪷', '🪵', '🧜‍♂️'];

// Modal controls
const cogBtn = document.getElementById('cog-btn');
const controlsModal = document.getElementById('controls-modal');
const closeModal = document.getElementById('close-modal');
cogBtn.onclick = () => controlsModal.classList.remove('hidden');
closeModal.onclick = () => controlsModal.classList.add('hidden');

// Render bubbles
function renderBubbles() {
  const bubbleLayer = document.getElementById('bubble-layer');
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
  const fishLayer = document.getElementById('fish-layer');
  fishLayer.innerHTML = '';
  tank.forEach((f, i) => {
    const emoji = fishEmojis[i % fishEmojis.length];
    const top = 20 + Math.random() * 60;
    const left = 10 + Math.random() * 75;
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
  decorLayer.innerHTML = '';
  decor.forEach((d, i) => {
    const emoji = decorEmojis[i % decorEmojis.length];
    decorLayer.innerHTML += `<div class="text-3xl">${emoji}</div>`;
  });
}

// Render HUD
function renderHUD(player) {
  document.getElementById('hud-level').textContent = player.level;
  document.getElementById('hud-xp').textContent = player.xp;
  document.getElementById('hud-coins').textContent = player.coins;
}

// --- Game logic integration ---
import { Game } from './game/Game.js';
import { startGameLoop } from './game/GameLoop.js';

const game = new Game();
game.init();

function render() {
  renderBubbles();
  renderFish(game.tank);
  renderDecor(game.decor);
  renderHUD(game.player);
}

// Modal button actions
const feedBtn = document.getElementById('feed-btn');
const cleanBtn = document.getElementById('clean-btn');
const addDecorBtn = document.getElementById('add-decor-btn');
const restBtn = document.getElementById('rest-btn');
const addFishBtn = document.getElementById('add-fish-btn');

feedBtn.onclick = () => {
  game.feedFish();
  render();
  controlsModal.classList.add('hidden');
};
cleanBtn.onclick = () => {
  game.cleanTank();
  render();
  controlsModal.classList.add('hidden');
};
addDecorBtn.onclick = () => {
  // Add first available decor from current biome
  const decorName = game.currentBiome.decor.find(
    name => !game.decor.some(d => d.name === name)
  );
  if (decorName) game.addDecor(decorName);
  render();
  controlsModal.classList.add('hidden');
};
restBtn.onclick = () => {
  // Stub: could add rest logic
  controlsModal.classList.add('hidden');
};
addFishBtn.onclick = () => {
  // Add first available fish from current biome not already in tank
  const fishName = game.currentBiome.fish.find(
    name => !game.tank.some(f => f.name === name)
  );
  if (fishName) game.addFish(fishName);
  render();
  controlsModal.classList.add('hidden');
};

render();
startGameLoop(game, render); 