export class Decor {
  constructor({ name, biome, effect, cost, unlockLevel }) {
    this.name = name;
    this.biome = biome;
    this.effect = effect || {}; // { happiness, environment, etc. }
    this.cost = cost || 0;
    this.unlockLevel = unlockLevel || 1;
  }

  applyEffect(target) {
    // target can be a tank, fish, or player
    // For now, just a stub for future logic
    // Example: target.happiness += this.effect.happiness || 0;
  }
} 