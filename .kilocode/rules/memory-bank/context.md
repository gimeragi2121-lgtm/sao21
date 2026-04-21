# Active Context: EVO-Asistente (Anime Electrolaser Edition)

## Current State

**Project Status**: ✅ Implemented

Voice assistant built with Electron featuring:
- 3D anime-style interface with Three.js rendering
- Electrolaser/electric aesthetic effects
- Evolutionary logic and self-programming
- Learns new commands via web search
- Markov chain context memory for improved interaction

## Recently Completed

- [x] SPEC.md created with full specification
- [x] Electron main process (main.js) with voice recognition system
- [x] Preload IPC bridge (preload.js)
- [x] 3D anime-style UI renderer (renderer/index.html)
- [x] Dynamic skill loader with require cache clearing
- [x] Markov chain memory system (memoria.json)
- [x] Web search integration for learning new commands
- [x] System control (terminal command execution)
- [x] Auto-install for missing npm packages
- [x] Anime-themed sample skills in habilidades/
- [x] Three.js dependency integration for 3D rendering
- [x] Electrolaser visual effects implementation

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `main.js` | Electron main process | ✅ Implemented |
| `preload.js` | IPC bridge | ✅ Implemented |
| `renderer/index.html` | 3D Anime UI with Three.js | ✅ Implemented |
| `habilidades/` | Dynamic skills folder | ✅ Implemented |
| `memoria.json` | Markov chain memory | ✅ Implemented |
| `SPEC.md` | Project specification | ✅ Implemented |

## Key Features

### Interface & Visuals
1. **3D Anime Character**: Simple anime-style character model with electrolaser effects
2. **Electrolaser Aesthetic**: Electric arc animations that activate during listening
3. **Futuristic UI**: Dark theme with cyan/blue accents, orbitron font
4. **Responsive 3D Scene**: Character rotation and laser animations

### Core Functionality
5. **Voice Recognition**: Web Speech API (SpeechRecognition) with Spanish language support
6. **Self-Learning**: Searches web via Exa API, creates new skills in habilidades/
7. **Dynamic Loading**: clearRequireCache + require() for instant skill updates
8. **Markov Memory**: Context prediction via word chain probabilities
9. **System Control**: Executes cmd/bash, auto-installs missing packages
10. **Python Support**: Can load .py skills via child process spawn

## How to Run

```bash
bun start          #or: electron .
```

## Skill Format

```javascript
// habilidades/mycommand.js
module.exports = {
  name: "mycommand",
  keywords: ["keyword1", "keyword2"],
  execute: async function(input) {
    return "result";
  }
};
```

## Anime-Themed Sample Skills

1. `saludo_anime.js` - Anime-style greetings with Japanese phrases
2. `hola.js` - Traditional greeting with time-based responses
3. `hora.js` - Date and time reporting

## Pending Improvements

- [ ] Configure EXA_API_KEY for web search (requires environment variable)
- [ ] Add more advanced anime character model (GLTF/OBJ)
- [ ] Implement voice output with speech synthesis
- [ ] Add more electrolaser visual variations
- [ ] Include sound effects for interactions

## Session History

| Date | Changes |
|------|---------|
| 2026-04-21 | EVO-Asistente Anime Electrolaser Edition implemented |