import { Player } from '../models/Player.js';
import { Fish } from '../models/Fish.js';
import { Decor } from '../models/Decor.js';
import { Biome } from '../models/Biome.js';
import { fishData } from '../data/fishData.js';
import { decorData } from '../data/decorData.js';
import { biomeData } from '../data/biomeData.js';
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
    // Start with Freshwater biome
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
      decor: this.decor,
      currentBiome: this.currentBiome.name
    });
  }

  // Helper method to get fish data by name
  getFishData(fishName) {
    return fishData.find(f => f.name === fishName);
  }

  // Helper method to get decor data by name
  getDecorData(decorName) {
    return decorData.find(d => d.name === decorName);
  }

  feedFish() {
    // Feed all fish in tank
    if (this.tank.length === 0) {
      return 0;
    }
    
    let totalCoins = 0;
    this.tank.forEach(fish => {
      totalCoins += fish.feed();
    });
    this.player.earnCoins(totalCoins);
    this.save();
    return totalCoins;
  }

  cleanTank() {
    // Clean all fish (simplified)
    if (this.tank.length === 0) {
      return 0;
    }
    
    let totalCoins = 0;
    this.tank.forEach(fish => {
      totalCoins += fish.clean();
    });
    this.player.earnCoins(totalCoins);
    this.save();
    return totalCoins;
  }

  addDecor(decorName) {
    // Find decor by name and add if player can afford
    const decorObj = decorData.find(d => d.name === decorName);
    if (!decorObj) return false;
    
    // Check if player has enough coins
    if (!this.player.spendCoins(decorObj.unlock.cost)) {
      return false;
    }
    
    // Check if decor is already in tank
    if (this.decor.some(d => d.name === decorName)) {
      return false;
    }
    
    const decor = new Decor(decorObj);
    this.decor.push(decor);
    this.player.addDecor(decor);
    this.save();
    return true;
  }

  addFish(fishName) {
    // Find fish by name and add
    const fishObj = fishData.find(f => f.name === fishName);
    if (!fishObj) return false;
    
    // Check if fish is already in tank
    if (this.tank.some(f => f.name === fishName)) {
      return false;
    }
    
    // Check if player has enough coins
    if (!this.player.spendCoins(fishObj.cost)) {
      return false;
    }
    
    const fish = new Fish(fishObj);
    this.tank.push(fish);
    this.player.addFish(fish);
    this.save();
    return true;
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
      return sum + (decorData ? decorData.unlock.cost : 0);
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