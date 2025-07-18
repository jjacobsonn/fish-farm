export const fishData = [
  // Progressive Fish Unlocking (5 fish total)
  { 
    name: "Goldfish", 
    biome: "Basic", 
    behavior: "calm", 
    requirements: { temperature: 22, salinity: 0, cleanliness: 70 }, 
    baseReward: 3, 
    cost: 15,
    unlockLevel: 1,
    image: "goldfish.png"
  },
  { 
    name: "Neon Tetra", 
    biome: "Basic", 
    behavior: "group", 
    requirements: { temperature: 25, salinity: 0, cleanliness: 80 }, 
    baseReward: 5, 
    cost: 35,
    unlockLevel: 2,
    image: "neon-tetra.png"
  },
  { 
    name: "Angelfish", 
    biome: "Basic", 
    behavior: "elegant", 
    requirements: { temperature: 26, salinity: 0, cleanliness: 75 }, 
    baseReward: 8, 
    cost: 75,
    unlockLevel: 3,
    image: "angel-fish.png"
  },
  { 
    name: "Clownfish", 
    biome: "Basic", 
    behavior: "active", 
    requirements: { temperature: 27, salinity: 30, cleanliness: 80 }, 
    baseReward: 12, 
    cost: 150,
    unlockLevel: 4,
    image: "clownfish.png"
  },
  { 
    name: "Pufferfish", 
    biome: "Basic", 
    behavior: "territorial", 
    requirements: { temperature: 24, salinity: 35, cleanliness: 85 }, 
    baseReward: 20, 
    cost: 300,
    unlockLevel: 5,
    image: "pufferfish.png"
  }
]; 