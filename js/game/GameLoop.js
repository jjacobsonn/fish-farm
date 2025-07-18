export function startGameLoop(game, onUpdate) {
  setInterval(() => {
    game.tank.forEach(fish => fish.decayStats());
    if (onUpdate) onUpdate();
    game.save();
  }, 60000); // 1 minute
} 