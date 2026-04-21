const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec, spawn } = require('child_process');

let mainWindow;
let skills = new Map();
let markovChain = { states: {} };
const HABILIDADES_DIR = path.join(__dirname, 'habilidades');
const MEMORIA_FILE = path.join(__dirname, 'memoria.json');
const CONFIDENCE_THRESHOLD = 0.7;

function log(message) {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${message}\n`;
  console.log(logLine.trim());
  if (mainWindow) {
    mainWindow.webContents.send('log', logLine);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    frame: false,
    backgroundColor: '#0d1117',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

function ensureHabilidadesDir() {
  if (!fs.existsSync(HABILIDADES_DIR)) {
    fs.mkdirSync(HABILIDADES_DIR, { recursive: true });
    log('Created habilidades directory');
  }
}

function loadMemoria() {
  if (fs.existsSync(MEMORIA_FILE)) {
    try {
      const data = fs.readFileSync(MEMORIA_FILE, 'utf8');
      markovChain = JSON.parse(data);
      log('Loaded Markov chain memory');
    } catch (e) {
      markovChain = { states: {} };
      log('Error loading memoria: ' + e.message);
    }
  }
}

function saveMemoria() {
  try {
    fs.writeFileSync(MEMORIA_FILE, JSON.stringify(markovChain, null, 2));
    log('Saved Markov chain memory');
  } catch (e) {
    log('Error saving memoria: ' + e.message);
  }
}

function updateMarkov(text) {
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  for (let i = 0; i < words.length - 1; i++) {
    const state = words[i];
    const next = words[i + 1];
    if (!markovChain.states[state]) {
      markovChain.states[state] = {};
    }
    if (!markovChain.states[state][next]) {
      markovChain.states[state][next] = 0;
    }
    markovChain.states[state][next]++;
  }
}

function predictNextWord(word) {
  const state = word.toLowerCase();
  if (!markovChain.states[state]) return null;
  const transitions = markovChain.states[state];
  let total = Object.values(transitions).reduce((a, b) => a + b, 0);
  if (total === 0) return null;
  let rand = Math.random() * total;
  for (const [next, count] of Object.entries(transitions)) {
    rand -= count;
    if (rand <= 0) return next;
  }
  return Object.keys(transitions)[0];
}

function clearRequireCache(filePath) {
  delete require.cache[require.resolve(filePath)];
}

function loadSkills() {
  skills.clear();
  if (!fs.existsSync(HABILIDADES_DIR)) return;
  
  const files = fs.readdirSync(HABILIDADES_DIR);
  for (const file of files) {
    if ((file.endsWith('.js') || file.endsWith('.py')) && !file.startsWith('.')) {
      const filePath = path.join(HABILIDADES_DIR, file);
      try {
        clearRequireCache(filePath);
        if (file.endsWith('.js')) {
          const skill = require(filePath);
          skills.set(skill.name, skill);
          log(`Loaded skill: ${skill.name}`);
        } else if (file.endsWith('.py')) {
          const name = file.replace('.py', '');
          skills.set(name, {
            name,
            isPython: true,
            filePath,
            execute: async function(input) {
              return new Promise((resolve, reject) => {
                const proc = spawn('python', [filePath, input]);
                let output = '';
                proc.stdout.on('data', d => output += d);
                proc.stderr.on('data', d => output += d);
                proc.on('close', code => resolve(output || `Exit code: ${code}`));
                proc.on('error', reject);
              });
            }
          });
          log(`Loaded Python skill: ${name}`);
        }
      } catch (e) {
        log(`Error loading skill ${file}: ${e.message}`);
      }
    }
  }
  mainWindow?.webContents.send('skills-loaded', Array.from(skills.values()));
}

function findSkill(command) {
  const cmd = command.toLowerCase();
  for (const [name, skill] of skills) {
    if (skill.keywords) {
      for (const kw of skill.keywords) {
        if (cmd.includes(kw.toLowerCase())) {
          return skill;
        }
      }
    }
  }
  return null;
}

async function searchAndLearn(command) {
  log(`Searching for: ${command}`);
  
  const query = encodeURIComponent(`how to ${command} in nodejs or python code example`);
  const url = `https://api.exa.ai/search?query=${query}&num-results=3`;
  
  try {
    const response = await fetch(url, {
      headers: { 'x-api-key': process.env.EXA_API_KEY || '' }
    });
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      const snippet = result.text || result.summary || '';
      
      const skillName = command.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '_');
      const keywords = command.toLowerCase().split(' ').slice(0, 5);
      
      const skillCode = `module.exports = {
  name: "${skillName}",
  keywords: ${JSON.stringify(keywords)},
  execute: async function(input) {
    // Derived from web search: ${command}
    // ${snippet.substring(0, 200)}
    console.log("Executing: ${command}");
    return "Command '${command}' executed successfully";
  }
};`;
      
      const skillPath = path.join(HABILIDADES_DIR, `${skillName}.js`);
      fs.writeFileSync(skillPath, skillCode);
      log(`Created new skill: ${skillName}`);
      
      loadSkills();
      return skills.get(skillName);
    }
  } catch (e) {
    log(`Search failed: ${e.message}`);
  }
  
  const skillName = command.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '_');
  const fallbackCode = `module.exports = {
  name: "${skillName}",
  keywords: ["${command.split(' ')[0]}"],
  execute: async function(input) {
    // Fallback skill for: ${command}
    return "Skill '${skillName}' executed for input: " + input;
  }
};`;
  
  const skillPath = path.join(HABILIDADES_DIR, `${skillName}.js`);
  fs.writeFileSync(skillPath, fallbackCode);
  log(`Created fallback skill: ${skillName}`);
  
  loadSkills();
  return skills.get(skillName);
}

async function executeSystemCommand(cmd) {
  return new Promise((resolve, reject) => {
    const isWin = process.platform === 'win32';
    const shell = isWin ? 'cmd.exe' : '/bin/bash';
    const shellArgs = isWin ? ['/c', cmd] : ['-c', cmd];
    
    const proc = spawn(shell, shellArgs);
    let stdout = '', stderr = '';
    
    proc.stdout.on('data', d => stdout += d);
    proc.stderr.on('data', d => stderr += d);
    
    proc.on('close', code => {
      if (code === 0) resolve(stdout);
      else reject(new Error(stderr || `Exit code: ${code}`));
    });
    
    proc.on('error', reject);
    
    setTimeout(() => {
      proc.kill();
      reject(new Error('Command timeout'));
    }, 30000);
  });
}

async function autoInstall(pkgName) {
  const isWin = process.platform === 'win32';
  const npmCmd = isWin ? 'npm.cmd' : 'npm';
  
  log(`Auto-installing: ${pkgName}`);
  return executeSystemCommand(`${npmCmd} install ${pkgName}`);
}

app.whenReady().then(() => {
  ensureHabilidadesDir();
  loadMemoria();
  loadSkills();
  createWindow();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  saveMemoria();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('minimize', () => mainWindow.minimize());
ipcMain.handle('maximize', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});
ipcMain.handle('close', () => mainWindow.close());

ipcMain.handle('process-command', async (event, command) => {
  log(`Processing: ${command}`);
  updateMarkov(command);
  saveMemoria();
  
  let skill = findSkill(command);
  
  if (!skill) {
    log('Skill not found, searching...');
    skill = await searchAndLearn(command);
  }
  
  if (skill) {
    try {
      const result = await skill.execute(command);
      log(`Result: ${result}`);
      return { success: true, result };
    } catch (e) {
      log(`Execution error: ${e.message}`);
      
      if (e.message.includes('require') || e.message.includes('module')) {
        const pkgMatch = e.message.match(/Cannot find module '([^']+)'/);
        if (pkgMatch) {
          try {
            await autoInstall(pkgMatch[1]);
            loadSkills();
            const newSkill = skills.get(skill.name);
            const result = await newSkill.execute(command);
            return { success: true, result };
          } catch (installErr) {
            return { success: false, error: installErr.message };
          }
        }
      }
      return { success: false, error: e.message };
    }
  }
  
  return { success: false, error: 'No skill found' };
});

ipcMain.handle('get-skills', () => {
  return Array.from(skills.values());
});

ipcMain.handle('predict-word', (event, word) => {
  return predictNextWord(word);
});

ipcMain.handle('execute-system', async (event, cmd) => {
  try {
    const result = await executeSystemCommand(cmd);
    return { success: true, result };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

ipcMain.handle('reload-skills', () => {
  loadSkills();
  return { success: true };
});