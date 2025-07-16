export class Fish {
  constructor({ name, biome, behavior, requirements, baseReward, happiness = 100 }) {
    this.name = name;
    this.biome = biome;
    this.behavior = behavior;
    this.requirements = requirements; // { temperature, salinity, cleanliness }
    this.happiness = happiness; // 0-100
    this.baseReward = baseReward;
    this.lastCareTime = Date.now();
  }

  feed() {
    this.happiness = Math.min(100, this.happiness + 10);
    this.lastCareTime = Date.now();
    return this.getCoinReward();
  }

  clean() {
    this.happiness = Math.min(100, this.happiness + 5);
    this.lastCareTime = Date.now();
    return this.getCoinReward(0.5); // Cleaning gives half reward
  }

  decayHappiness() {
    // Decay happiness over time (e.g., 1 point per minute)
    const now = Date.now();
    const minutes = Math.floor((now - this.lastCareTime) / 60000);
    if (minutes > 0) {
      this.happiness = Math.max(0, this.happiness - minutes);
      this.lastCareTime = now;
    }
  }

  getCoinReward(multiplier = 1) {
    // Reward is based on happiness and baseReward
    return Math.round(this.baseReward * (this.happiness / 100) * multiplier);
  }
} 