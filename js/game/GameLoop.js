export function startGameLoop(game, onUpdate) {
  setInterval(() => {
    game.tank.forEach(fish => fish.decayHappiness());
    if (onUpdate) onUpdate();
    game.save();
  }, 60000); // 1 minute
} 