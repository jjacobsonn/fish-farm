export class Player {
  constructor(data = {}) {
    this.coins = data.coins || 100;
    this.level = data.level || 1;
    this.xp = data.xp || 0;
    this.inventory = data.inventory || { fish: [], decor: [] };
    this.unlockedBiomes = data.unlockedBiomes || ["Freshwater"];
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

  addDecor(decor) {
    this.inventory.decor.push(decor);
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