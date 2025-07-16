export class Decor {
  constructor({ name, biome, effect, unlock }) {
    this.name = name;
    this.biome = biome;
    this.effect = effect || {}; // { happiness, cleanliness, etc. }
    this.unlock = unlock || {}; // { level, cost }
  }

  applyEffect(target) {
    // target can be a tank, fish, or player
    // For now, just a stub for future logic
    // Example: target.happiness += this.effect.happiness || 0;
  }
} 