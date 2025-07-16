export class Biome {
  constructor({ name, unlock, fish, decor }) {
    this.name = name;
    this.unlock = unlock; // { level, equipment }
    this.fish = fish; // array of fish names
    this.decor = decor; // array of decor names
  }
} 