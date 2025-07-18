export class Player {
  constructor(data = {}) {
    this.coins = data.coins || 100;
    this.level = data.level || 1;
    this.xp = data.xp || 0;
    this.inventory = data.inventory || { fish: [], decor: [], food: {} };
    this.unlockedBiomes = data.unlockedBiomes || ["Basic"];
    this.equipment = data.equipment || [];
  }

  earnCoins(amount) {
    this.coins += amount;
  }

  spendCoins(amount) {
    if (this.coins >= amount) {
      this.coins -= amount;
      return true;
    }
    return false;
  }

  earnXP(amount) {
    this.xp += amount;
    this.checkLevelUp();
  }

  checkLevelUp() {
    // Simple XP to level formula: 100 XP per level
    const requiredXP = this.level * 100;
    while (this.xp >= requiredXP) {
      this.xp -= requiredXP;
      this.level++;
    }
  }

  unlockBiome(biomeName) {
    if (!this.unlockedBiomes.includes(biomeName)) {
      this.unlockedBiomes.push(biomeName);
    }
  }

  addFish(fish) {
    this.inventory.fish.push(fish);
  }

  removeFish(fishName) {
    const fishIndex = this.inventory.fish.findIndex(f => f.name === fishName);
    if (fishIndex >= 0) {
      this.inventory.fish.splice(fishIndex, 1);
      return true;
    }
    return false;
  }

  addDecor(decor) {
    this.inventory.decor.push(decor);
  }

  // Food inventory methods
  addFood(foodName, quantity = 1) {
    if (!this.inventory.food[foodName]) {
      this.inventory.food[foodName] = 0;
    }
    this.inventory.food[foodName] += quantity;
  }

  useFood(foodName) {
    if (this.inventory.food[foodName] && this.inventory.food[foodName] > 0) {
      this.inventory.food[foodName]--;
      if (this.inventory.food[foodName] === 0) {
        delete this.inventory.food[foodName];
      }
      return true;
    }
    return false;
  }

  getFoodQuantity(foodName) {
    return this.inventory.food[foodName] || 0;
  }

  hasFood(foodName) {
    return this.getFoodQuantity(foodName) > 0;
  }

  getAvailableFood() {
    return Object.keys(this.inventory.food).filter(foodName => 
      this.inventory.food[foodName] > 0
    );
  }

  hasEquipment(equipmentName) {
    return this.equipment.includes(equipmentName);
  }

  addEquipment(equipmentName) {
    if (!this.equipment.includes(equipmentName)) {
      this.equipment.push(equipmentName);
    }
  }
} 