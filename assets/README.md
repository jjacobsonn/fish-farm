# Fish Farm Assets

This directory contains all visual assets for the Fish Farm game.

## Directory Structure

```
assets/
├── images/
│   ├── fish/           # Fish sprite images
│   ├── decor/          # Decoration images  
│   ├── ui/             # UI icons and elements
│   └── backgrounds/    # Tank backgrounds and effects
└── README.md           # This file
```

## Asset Guidelines

### Fish Images (`/images/fish/`)
**Recommended format:** PNG with transparency or SVG
**Recommended size:** 64x64px to 128x128px
**Naming convention:** `{fishname}.png` or `{fishname}.svg`

Required fish assets:
- `goldfish.png` - Level 1 starter fish
- `neon-tetra.png` - Level 3 colorful schooling fish  
- `angelfish.png` - Level 6 elegant tropical fish
- `clownfish.png` - Level 10 popular reef fish
- `dragon-fish.png` - Level 15 rare exotic fish

### Decor Images (`/images/decor/`)
**Recommended format:** PNG with transparency or SVG
**Recommended size:** Varies (32x32px to 128x128px depending on decor size)
**Naming convention:** `{decorname}.png` or `{decorname}.svg`

Required decor assets:
- `seaweed-plant.png` - Level 2 basic aquatic plant
- `smooth-rocks.png` - Level 4 natural stone formation
- `treasure-chest.png` - Level 7 pirate treasure chest
- `coral-garden.png` - Level 12 colorful coral formation
- `ancient-ruins.png` - Level 18 mystical underwater temple

### UI Images (`/images/ui/`)
**Recommended format:** PNG with transparency or SVG
**Recommended size:** 24x24px to 48x48px for icons

Suggested UI assets:
- `coin-icon.png` - Coin/currency icon
- `xp-icon.png` - Experience points icon
- `level-icon.png` - Level indicator icon
- `lock-icon.png` - Locked item indicator
- `timer-icon.png` - Cooldown timer icon
- `heart-icon.png` - Happiness indicator
- `bubble-icon.png` - Cleanliness indicator

### Background Images (`/images/backgrounds/`)
**Recommended format:** PNG or JPG
**Recommended size:** 1200x400px (aquarium dimensions)

Suggested background assets:
- `freshwater-bg.png` - Basic freshwater tank background
- `tropical-bg.png` - Tropical/jungle tank background
- `reef-bg.png` - Coral reef tank background
- `deep-sea-bg.png` - Deep ocean tank background

## Asset Sources

### Free Asset Resources:
- **OpenGameArt.org** - Free game sprites and graphics
- **Kenney.nl** - High-quality free game assets
- **Flaticon** - Icons (free tier available)
- **Pixabay** - Free images you can modify
- **Itch.io** - Free asset packs

### Tools for Creating Assets:
- **Free:** GIMP, Inkscape, Figma, Canva
- **Paid:** Adobe Photoshop, Illustrator, Procreate

## Implementation

Assets in this directory will be loaded by the game using paths like:
```javascript
// Fish images
const fishImage = `assets/images/fish/${fishName.toLowerCase().replace(' ', '-')}.png`;

// Decor images  
const decorImage = `assets/images/decor/${decorName.toLowerCase().replace(' ', '-')}.png`;
```

## Notes

- All fish and decor assets should have transparent backgrounds
- Keep file sizes reasonable for web loading (under 100KB per asset)
- Consider creating both normal and "highlighted" versions for hover effects
- SVG format is preferred for scalability across different screen sizes
