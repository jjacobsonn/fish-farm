export class Fish {
  constructor({ name, biome, behavior, requirements, baseReward, happiness = 100, hunger = 100, cleanliness = 100 }) {
    this.name = name;
    this.biome = biome;
    this.behavior = behavior;
    this.requirements = requirements; // { temperature, salinity, cleanliness }
    this.happiness = happiness; // 0-100
    this.hunger = hunger; // 0-100
    this.cleanliness = cleanliness; // 0-100
    this.baseReward = baseReward;
    this.lastCareTime = Date.now();
    this.lastFeedTime = Date.now();
    this.lastCleanTime = Date.now();
  }

  feed(foodItem = null) {
    if (foodItem) {
      // Use specific food item
      this.hunger = Math.min(100, this.hunger + (foodItem.effect.hunger || 20));
      this.happiness = Math.min(100, this.happiness + (foodItem.effect.happiness || 5));
      this.lastFeedTime = Date.now();
    } else {
      // Basic feeding (fallback)
      this.hunger = Math.min(100, this.hunger + 20);
      this.happiness = Math.min(100, this.happiness + 10);
      this.lastFeedTime = Date.now();
    }
    this.lastCareTime = Date.now();
    return this.getCoinReward();
  }

  clean() {
    this.cleanliness = Math.min(100, this.cleanliness + 30);
    this.happiness = Math.min(100, this.happiness + 5);
    this.lastCleanTime = Date.now();
    this.lastCareTime = Date.now();
    return this.getCoinReward(0.5); // Cleaning gives half reward
  }

  decayStats() {
    // Decay all stats over time
    const now = Date.now();
    const minutes = Math.floor((now - this.lastCareTime) / 60000);
    
    if (minutes > 0) {
      // Decay happiness based on hunger and cleanliness
      const hungerPenalty = this.hunger < 50 ? (50 - this.hunger) * 0.5 : 0;
      const cleanlinessPenalty = this.cleanliness < 50 ? (50 - this.cleanliness) * 0.3 : 0;
      
      this.happiness = Math.max(0, this.happiness - minutes - hungerPenalty - cleanlinessPenalty);
      this.hunger = Math.max(0, this.hunger - minutes * 0.5);
      this.cleanliness = Math.max(0, this.cleanliness - minutes * 0.3);
      
      this.lastCareTime = now;
    }
  }

  getCoinReward(multiplier = 1) {
    // Reward is based on happiness, hunger, and cleanliness
    const avgHealth = (this.happiness + this.hunger + this.cleanliness) / 3;
    return Math.round(this.baseReward * (avgHealth / 100) * multiplier);
  }

  // Get overall health percentage
  getHealthPercentage() {
    return (this.happiness + this.hunger + this.cleanliness) / 3;
  }

  // Check if fish needs care
  needsCare() {
    return this.hunger < 50 || this.cleanliness < 50 || this.happiness < 50;
  }
} 