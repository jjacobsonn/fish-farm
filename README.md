# Fish Farm

Fish Farm is a modular, object-oriented JavaScript browser game where players build and manage a virtual aquarium. Players start with an empty freshwater tank and 100 coins, and progress by caring for fish, maintaining tank conditions, completing quests, and unlocking new biomes, fish species, decorations, and upgrades.

## Features

- **OOP Architecture:** Clean, modular codebase using ES6 classes and modules.
- **Biomes & Progression:** Five biomes (Freshwater, Jungle, Coral Reef, Deep Sea, Fantasy), each with unique fish and decor, unlocked as the player levels up.
- **Fish System:** Each fish has unique behaviors, environmental needs, happiness, and coin rewards.
- **Decor System:** Biome-specific decor items provide cosmetic and passive tank boosts.
- **Player Progression:** Earn coins and XP by feeding fish, cleaning the tank, and completing quests. Level up to unlock new content.
- **Persistence:** Game state is saved in `localStorage` for seamless browser play.
- **Modern UI:** Responsive, accessible HTML/CSS with animated start screen and themed instructions.
- **No External Libraries:** 100% vanilla JavaScript, HTML, and CSS for maximum portability and learning value.

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- (Recommended) [Python](https://www.python.org/) or any static file server for local development

### Setup
1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd fish-farm
   ```
2. **Start a local server (recommended):**
   ```sh
   python3 -m http.server 8000
   # or use any static server of your choice
   ```
3. **Open the game:**
   - Visit [http://localhost:8000](http://localhost:8000) in your browser.
   - Click "Start Game" to begin playing.

> **Note:** Opening `index.html` directly via `file://` may cause ES6 module import errors in some browsers. Always use a local server for best results.

## File Structure

```
FishFarm/
├── index.html
├── style.css
├── README.md
├── js/
│   ├── main.js
│   ├── data/
│   │   ├── fishData.js
│   │   ├── decorData.js
│   │   └── biomeData.js
│   ├── models/
│   │   ├── Fish.js
│   │   ├── Decor.js
│   │   ├── Biome.js
│   │   └── Player.js
│   ├── game/
│   │   ├── Game.js
│   │   └── GameLoop.js
│   └── utils/
│       └── storage.js
```

## Libraries & Dependencies

- **None.**
  - Fish Farm is built entirely with vanilla JavaScript (ES6+), HTML5, and CSS3.
  - No external libraries or frameworks are required.

## Contributing

Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes with clear, well-documented code.
4. Submit a pull request with a detailed description of your changes.

Please follow the existing code style and modular structure. For major changes, open an issue to discuss your proposal first.

## License

This project is open source and available under the [MIT License](LICENSE).

---

**Fish Farm** — Build your dream aquarium, one fish at a time! 