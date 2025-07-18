// Image loading and asset management system
export class AssetManager {
  constructor() {
    this.images = new Map();
    this.loadedCount = 0;
    this.totalCount = 0;
    this.onLoadComplete = null;
  }

  // Preload all game assets
  preloadAssets(fishData, decorData) {
    const assetsToLoad = [];
    
    // Add fish images
    fishData.forEach(fish => {
      if (fish.image) {
        assetsToLoad.push({
          key: `fish-${fish.name}`,
          path: `assets/images/fish/${fish.image}`
        });
      }
    });
    
    // Add decor images
    decorData.forEach(decor => {
      if (decor.image) {
        assetsToLoad.push({
          key: `decor-${decor.name}`,
          path: `assets/images/decor/${decor.image}`
        });
      }
      // Add alternate images if they exist (like treasure chest open/closed)
      if (decor.imageOpen) {
        assetsToLoad.push({
          key: `decor-${decor.name}-open`,
          path: `assets/images/decor/${decor.imageOpen}`
        });
      }
    });

    this.totalCount = assetsToLoad.length;
    
    if (this.totalCount === 0) {
      if (this.onLoadComplete) this.onLoadComplete();
      return;
    }

    // Load all images
    assetsToLoad.forEach(asset => {
      this.loadImage(asset.key, asset.path);
    });
  }

  // Load individual image
  loadImage(key, path) {
    const img = new Image();
    
    img.onload = () => {
      this.images.set(key, img);
      this.loadedCount++;
      
      if (this.loadedCount === this.totalCount && this.onLoadComplete) {
        this.onLoadComplete();
      }
    };
    
    img.onerror = () => {
      console.warn(`Failed to load image: ${path}`);
      // Store a placeholder or null
      this.images.set(key, null);
      this.loadedCount++;
      
      if (this.loadedCount === this.totalCount && this.onLoadComplete) {
        this.onLoadComplete();
      }
    };
    
    img.src = path;
  }

  // Get loaded image
  getImage(key) {
    return this.images.get(key);
  }

  // Check if image exists
  hasImage(key) {
    return this.images.has(key) && this.images.get(key) !== null;
  }

  // Get fish image
  getFishImage(fishName) {
    return this.getImage(`fish-${fishName}`);
  }

  // Get decor image
  getDecorImage(decorName, variant = '') {
    const key = variant ? `decor-${decorName}-${variant}` : `decor-${decorName}`;
    return this.getImage(key);
  }

  // Get loading progress (0-1)
  getLoadProgress() {
    return this.totalCount > 0 ? this.loadedCount / this.totalCount : 1;
  }

  // Check if all assets are loaded
  isLoaded() {
    return this.loadedCount === this.totalCount;
  }
}

// Create global asset manager instance
export const assetManager = new AssetManager();
