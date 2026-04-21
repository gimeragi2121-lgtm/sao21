# Active Context: EVO-Asistente (Voice Assistant)

## Current State

**Project Status**: ✅ Implemented

Voice assistant built with Electron that uses evolutionary logic and self-programming. Learns new commands via web search and Markov chain context memory.

## Recently Completed

- [x] SPEC.md created with full specification
- [x] Electron main process (main.js) with voice recognition system
- [x] Preload IPC bridge (preload.js)
- [x] UI renderer (renderer/index.html)
- [x] Dynamic skill loader with require cache clearing
- [x] Markov chain memory system (memoria.json)
- [x] Web search integration for learning new commands
- [x] System control (terminal command execution)
- [x] Auto-install for missing npm packages
- [x] Sample skills in habilidades/

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `main.js` | Electron main process | ✅ Implemented |
| `preload.js` | IPC bridge | ✅ Implemented |
| `renderer/index.html` | UI | ✅ Implemented |
| `habilidades/` | Dynamic skills folder | ✅ Implemented |
| `memoria.json` | Markov chain memory | ✅ Implemented |
| `SPEC.md` | Project specification | ✅ Implemented |

## Key Features

1. **Voice Recognition**: Web Speech API (SpeechRecognition)
2. **Self-Learning**: Searches web, creates new skills in habilidades/
3. **Dynamic Loading**: clearRequireCache + require() for new skills
4. **Markov Memory**: Context prediction via word chain probabilities
5. **System Control**: Executes cmd/bash, auto-installs packages
6. **Python Support**: Can load .py skills via spawn

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

## Pending Improvements

- [ ] Add more sample skills
- [ ] Configure EXA_API_KEY for web search
- [ ] Add error handling improvements

## Session History

| Date | Changes |
|------|---------|
| 2026-04-21 | EVO-Asistente project implemented |