export const fishData = [
  // MVP Fish Progression (5 fish total)
  { 
    name: "Goldfish", 
    biome: "Freshwater", 
    behavior: "calm", 
    requirements: { temperature: 22, salinity: 0, cleanliness: 70 }, 
    baseReward: 3, 
    cost: 15,
    level: 1,
    image: "goldfish.png"
  },
  { 
    name: "Neon Tetra", 
    biome: "Freshwater", 
    behavior: "group", 
    requirements: { temperature: 25, salinity: 0, cleanliness: 80 }, 
    baseReward: 5, 
    cost: 35,
    level: 3,
    image: "neon-tetra.png"
  },
  { 
    name: "Angel Fish", 
    biome: "Tropical", 
    behavior: "elegant", 
    requirements: { temperature: 26, salinity: 0, cleanliness: 75 }, 
    baseReward: 8, 
    cost: 75,
    level: 6,
    image: "angel-fish.png"
  },
  { 
    name: "Clownfish", 
    biome: "Coral Reef", 
    behavior: "active", 
    requirements: { temperature: 27, salinity: 30, cleanliness: 80 }, 
    baseReward: 12, 
    cost: 150,
    level: 10,
    image: "clownfish.png"
  },
  { 
    name: "Pufferfish", 
    biome: "Deep Sea", 
    behavior: "territorial", 
    requirements: { temperature: 24, salinity: 35, cleanliness: 85 }, 
    baseReward: 20, 
    cost: 300,
    level: 15,
    image: "pufferfish.png"
  }
]; 