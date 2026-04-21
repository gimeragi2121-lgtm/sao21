# EVO-Asistente: Voice Assistant with Evolutionary Logic

## Project Overview

**Project Name:** EVO-Asistente  
**Type:** Desktop Voice Assistant (Electron)  
**Core Functionality:** A self-programming voice assistant that learns new commands by searching the web and dynamically loading skills without restart. Uses Markov chains for contextual memory.  
**Target Users:** Developers and power users who want an extensible voice assistant

---

## UI/UX Specification

### Layout Structure

- **Single Window Application** with frameless design
- **Main Areas:**
  - Header: App title and minimize/close controls
  - Status Panel: Shows listening state, last command, confidence
  - Skills Panel: List of loaded abilities
  - Log Panel: Output log and learning events
  - Footer: Voice activation button

### Visual Design

- **Color Palette:**
  - Background: `#0d1117` (dark navy)
  - Primary: `#58a6ff` (electric blue)
  - Secondary: `#161b22` (dark card)
  - Accent: `#7ee787` (success green)
  - Warning: `#f0883e` (orange)
  - Error: `#f85149` (red)
  - Text Primary: `#e6edf3`
  - Text Secondary: `#8b949e`

- **Typography:**
  - Font Family: "JetBrains Mono", "Fira Code", monospace
  - Headings: 18px bold
  - Body: 14px regular
  - Status: 12px

- **Spacing:**
  - Base unit: 8px
  - Panel padding: 16px
  - Component gap: 12px

- **Visual Effects:**
  - Glow effect on active listening (`box-shadow: 0 0 20px #58a6ff`)
  - Smooth transitions (200ms ease)
  - Pulsing indicator when listening

### Components

1. **Title Bar** - Custom draggable, window controls
2. **Voice Indicator** - Animated waveform when active
3. **Command Display** - Shows recognized speech
4. **Skills List** - Loaded abilities with status
5. **Log Viewer** - Scrollable event log
6. **Mic Button** - Large activation button

---

## Functionality Specification

### Core Features

#### 1. Voice Recognition System
- Use Web Speech API for speech-to-text
- Continuous listening mode
- Confidence threshold: 0.7
- Wake word: "Evo" (configurable)

#### 2. Self-Writing System
- When command not recognized → search web via Exa API
- Parse search results to extract code solutions
- Generate new skill file in `habilidades/` folder
- Support both Node.js and Python skills

#### 3. Dynamic Skill Loading
- `require()` dynamic loading with cache clearing
- File watcher for new skills
- Automatic skill registration
- Skill API: `execute(input): Promise<string>`

#### 4. Markov Chain Context Memory
- JSON file: `memoria.json`
- States: word pairs
- Transitions: next word probabilities
- Context window: 2 words
- Persistence on each new command

#### 5. System Control
- Execute commands in cmd/bash
- Auto-install npm/pip packages
- Capture stdout/stderr
- Timeout handling (30s)

### User Interactions

1. **Activate Voice:** Click mic button or press Space
2. **Speak Command:** Natural language input
3. **Receive Response:** Audio + visual feedback
4. **Learn New Skill:** Automatic when unrecognized
5. **View Skills:** Panel shows all loaded abilities
6. **View Logs:** Scroll through events

### Data Flow

```
Voice Input → STT → Command Parser → Skill Matcher
                                          ↓
                                   [Found] → Execute
                                          ↓
                                   [Not Found] → Web Search
                                          ↓
                                   Generate Skill → Write to Disk
                                          ↓
                                   Dynamic Require → Load Skill
                                          ↓
                                   Update Markov Memory → Save JSON
```

### Edge Cases

- No internet: Show offline warning, use cached skills
- Empty search results: Notify user, offer manual input
- Skill execution error: Log error, remove from active
- Duplicate skill: Update existing, don't recreate

---

## Technical Implementation

### File Structure

```
/
├── package.json
├── main.js              # Electron main process
├── preload.js           # IPC bridge
├── renderer/
│   └── index.html       # UI
├── habilidades/        # Dynamic skills folder
│   └── .gitkeep
├── memoria.json        # Markov chain database
└── logs/
    └── app.log
```

### Skill File Format

```javascript
// habilidades/ejemplo.js
module.exports = {
  name: "ejemplo",
  keywords: ["palabra1", "palabra2"],
  execute: async function(input) {
    // code here
    return "resultado";
  }
};
```

### Dependencies

- electron: ^28.0.0
- speaker: ^5.1.0 (for audio output)
- exa-js: Search API

---

## Acceptance Criteria

1. **Voice Recognition:** Correctly converts speech to text
2. **Skill Loading:** New skills load without restart
3. **Auto-Learning:** Unknown commands trigger web search
4. **Persistence:** Skills saved to habilidades/ folder
5. **Memory:** Markov chains update and persist
6. **System Access:** Can execute terminal commands
7. **UI Responsive:** All interactions under 100ms
8. **Error Handling:** Graceful degradation on failures