// Purchase System for Fish Farm Game
// Handles buying fish, decor, and other items

export class PurchaseSystem {
  constructor(game) {
    this.game = game;
  }

  // Check if player can afford an item
  canAfford(cost) {
    return this.game.player.coins >= cost;
  }

  // Purchase a fish
  purchaseFish(fishName) {
    const fishData = this.game.getFishData(fishName);
    if (!fishData) {
      return { success: false, message: 'Fish not found!' };
    }

    // Check if fish is already in tank
    if (this.game.tank.some(f => f.name === fishName)) {
      return { success: false, message: 'Fish already in tank!' };
    }

    // Check if player can afford the fish
    if (!this.canAfford(fishData.cost)) {
      return { success: false, message: `Not enough coins! ${fishName} costs ${fishData.cost} coins.` };
    }

    // Check level requirement for biome
    const biomeData = this.game.biomes.find(b => b.name === fishData.biome);
    if (biomeData && this.game.player.level < biomeData.unlock.level) {
      return { success: false, message: `Requires level ${biomeData.unlock.level} to access ${fishData.biome} biome!` };
    }

    // Purchase fish
    if (this.game.addFish(fishName)) {
      return { success: true, message: `Purchased ${fishName} for ${fishData.cost} coins!` };
    } else {
      return { success: false, message: 'Failed to add fish!' };
    }
  }

  // Purchase decor
  purchaseDecor(decorName) {
    const decorData = this.game.getDecorData(decorName);
    if (!decorData) {
      return { success: false, message: 'Decor not found!' };
    }

    // Check if player can afford
    if (!this.canAfford(decorData.unlock.cost)) {
      return { success: false, message: `Not enough coins! ${decorName} costs ${decorData.unlock.cost} coins.` };
    }

    // Check if decor is already in tank
    if (this.game.decor.some(d => d.name === decorName)) {
      return { success: false, message: 'Decor already in tank!' };
    }

    // Check level requirement
    if (this.game.player.level < decorData.unlock.level) {
      return { success: false, message: `Requires level ${decorData.unlock.level}!` };
    }

    // Purchase decor
    if (this.game.addDecor(decorName)) {
      return { success: true, message: `Purchased ${decorName} for ${decorData.unlock.cost} coins!` };
    } else {
      return { success: false, message: 'Failed to add decor!' };
    }
  }

  // Get available fish for current biome
  getAvailableFish() {
    return this.game.currentBiome.fish.filter(
      fishName => !this.game.tank.some(f => f.name === fishName)
    );
  }

  // Get available decor for current biome
  getAvailableDecor() {
    return this.game.currentBiome.decor.filter(
      decorName => !this.game.decor.some(d => d.name === decorName)
    );
  }

  // Get affordable fish
  getAffordableFish() {
    return this.getAvailableFish().filter(fishName => {
      const fishData = this.game.getFishData(fishName);
      return this.canAfford(fishData.cost);
    });
  }

  // Get affordable decor
  getAffordableDecor() {
    return this.getAvailableDecor().filter(decorName => {
      const decorData = this.game.getDecorData(decorName);
      return this.canAfford(decorData.unlock.cost) && 
             this.game.player.level >= decorData.unlock.level;
    });
  }

  // Get fish with level requirements met
  getUnlockedFish() {
    return this.getAvailableFish().filter(fishName => {
      const fishData = this.game.getFishData(fishName);
      const biomeData = this.game.biomes.find(b => b.name === fishData.biome);
      return !biomeData || this.game.player.level >= biomeData.unlock.level;
    });
  }

  // Calculate total value of current tank
  getTankValue() {
    const fishValue = this.game.tank.reduce((total, fish) => {
      const fishData = this.game.getFishData(fish.name);
      return total + (fishData ? fishData.cost : 0);
    }, 0);
    
    const decorValue = this.game.decor.reduce((total, decor) => {
      const decorData = this.game.getDecorData(decor.name);
      return total + (decorData ? decorData.unlock.cost : 0);
    }, 0);
    
    return fishValue + decorValue;
  }

  // Get recommended next purchase
  getRecommendedPurchase() {
    const affordableFish = this.getAffordableFish();
    const affordableDecor = this.getAffordableDecor();
    
    // Prioritize fish if tank is empty
    if (this.game.tank.length === 0 && affordableFish.length > 0) {
      return { type: 'fish', name: affordableFish[0] };
    }
    
    // Otherwise, suggest the cheapest item
    let cheapestItem = null;
    let cheapestCost = Infinity;
    
    // Check fish
    affordableFish.forEach(fishName => {
      const fishData = this.game.getFishData(fishName);
      if (fishData.cost < cheapestCost) {
        cheapestCost = fishData.cost;
        cheapestItem = { type: 'fish', name: fishName };
      }
    });
    
    // Check decor
    affordableDecor.forEach(decorName => {
      const decorData = this.game.getDecorData(decorName);
      if (decorData.unlock.cost < cheapestCost) {
        cheapestCost = decorData.unlock.cost;
        cheapestItem = { type: 'decor', name: decorName };
      }
    });
    
    return cheapestItem;
  }
} 