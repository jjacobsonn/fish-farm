import { Player } from '../models/Player.js';
import { Fish } from '../models/Fish.js';
import { Decor } from '../models/Decor.js';
import { Biome } from '../models/Biome.js';
import { fishData } from '../data/fishData.js';
import { decorData } from '../data/decorData.js';
import { biomeData } from '../data/biomeData.js';
import { foodData } from '../data/foodData.js';
import { saveState, loadState } from '../utils/storage.js';

export class Game {
  constructor() {
    this.player = null;
    this.tank = [];
    this.decor = [];
    this.currentBiome = null;
    this.biomes = [];
  }

  init() {
    // Load or create player
    const saved = loadState();
    this.player = saved ? new Player(saved.player) : new Player();
    // Start with Basic biome
    this.currentBiome = new Biome(biomeData[0]);
    this.biomes = biomeData.map(b => new Biome(b));
    // Load tank and decor from save or start empty
    this.tank = (saved && saved.tank) ? saved.tank.map(f => new Fish(f)) : [];
    this.decor = (saved && saved.decor) ? saved.decor.map(d => new Decor(d)) : [];
  }

  save() {
    saveState({
      player: this.player,
      tank: this.tank,
      decor: this.decor
    });
  }

  addFish(fishName) {
    const fishData = this.getFishData(fishName);
    if (!fishData) return false;
    
    // Check if fish is already in tank
    if (this.tank.some(f => f.name === fishName)) {
      return false;
    }
    
    // Check level requirement
    if (this.player.level < fishData.unlockLevel) {
      return false;
    }
    
    if (this.player.spendCoins(fishData.cost)) {
      const fish = new Fish(fishData);
      this.tank.push(fish);
      this.player.addFish(fish);
      this.save();
      return true;
    }
    return false;
  }

  removeFish(fishName) {
    const fishIndex = this.tank.findIndex(f => f.name === fishName);
    if (fishIndex >= 0) {
      this.tank.splice(fishIndex, 1);
      this.player.removeFish(fishName);
      this.save();
      return true;
    }
    return false;
  }

  clearTank() {
    this.tank = [];
    this.decor = [];
    this.player.inventory.fish = [];
    this.player.inventory.decor = [];
    this.save();
  }

  addDecor(decorName) {
    const decorData = this.getDecorData(decorName);
    if (!decorData) return false;
    
    if (this.player.spendCoins(decorData.cost)) {
      const decor = new Decor(decorData);
      this.decor.push(decor);
      this.player.addDecor(decor);
      this.save();
      return true;
    }
    return false;
  }

  // Helper method to get fish data by name
  getFishData(fishName) {
    return fishData.find(f => f.name === fishName);
  }

  // Helper method to get decor data by name
  getDecorData(decorName) {
    return decorData.find(d => d.name === decorName);
  }

  // Helper method to get food data by name
  getFoodData(foodName) {
    return foodData.find(f => f.name === foodName);
  }

  // Purchase food
  purchaseFood(foodName, quantity = 1) {
    const foodData = this.getFoodData(foodName);
    if (!foodData) {
      return false;
    }
    
    const totalCost = foodData.cost * quantity;
    
    if (this.player.spendCoins(totalCost)) {
      this.player.addFood(foodName, quantity);
      this.save();
      return true;
    }
    return false;
  }

  // Feed fish with specific food
  feedFish(foodName = null) {
    if (this.tank.length === 0) {
      return 0;
    }
    
    let totalCoins = 0;
    
    if (foodName) {
      // Use specific food
      if (!this.player.useFood(foodName)) {
        return 0; // No food available
      }
      
      const foodData = this.getFoodData(foodName);
      this.tank.forEach(fish => {
        totalCoins += fish.feed(foodData);
      });
    } else {
      // Basic feeding (no food cost)
      this.tank.forEach(fish => {
        totalCoins += fish.feed();
      });
    }
    
    this.player.earnCoins(totalCoins);
    this.player.earnXP(totalCoins);
    this.save();
    return totalCoins;
  }

  cleanTank() {
    if (this.tank.length === 0) {
      return 0;
    }
    
    let totalCoins = 0;
    this.tank.forEach(fish => {
      totalCoins += fish.clean();
    });
    
    this.player.earnCoins(totalCoins);
    this.player.earnXP(totalCoins);
    this.save();
    return totalCoins;
  }

  // Get available food for current biome
  getAvailableFood() {
    return foodData.filter(food => 
      food.biome === this.currentBiome.name && 
      this.player.level >= food.unlockLevel
    );
  }

  // Get available fish for current level and biome
  getAvailableFish() {
    return fishData.filter(fish => 
      this.player.level >= (fish.unlockLevel || 1)
    );
  }

  // Get available decor for current level and biome  
  getAvailableDecor() {
    return decorData.filter(decor => 
      this.player.level >= decor.unlockLevel &&
      !this.decor.some(d => d.name === decor.name)
    );
  }

  // Get affordable food
  getAffordableFood() {
    return this.getAvailableFood().filter(food => 
      this.player.coins >= food.cost
    );
  }

  switchBiome(biomeName) {
    const biome = this.biomes.find(b => b.name === biomeName);
    if (biome && this.player.unlockedBiomes.includes(biomeName)) {
      this.currentBiome = biome;
      this.save();
      return true;
    }
    return false;
  }

  // Get current tank statistics
  getTankStats() {
    const totalValue = this.tank.reduce((sum, fish) => {
      const fishData = this.getFishData(fish.name);
      return sum + (fishData ? fishData.cost : 0);
    }, 0) + this.decor.reduce((sum, decor) => {
      const decorData = this.getDecorData(decor.name);
      return sum + (decorData ? decorData.cost : 0);
    }, 0);

    return {
      fishCount: this.tank.length,
      decorCount: this.decor.length,
      totalValue: totalValue,
      averageHappiness: this.tank.length > 0 ? 
        this.tank.reduce((sum, fish) => sum + fish.happiness, 0) / this.tank.length : 0
    };
  }
} 