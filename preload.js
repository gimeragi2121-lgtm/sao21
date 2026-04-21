const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  minimize: () => ipcRenderer.invoke('minimize'),
  maximize: () => ipcRenderer.invoke('maximize'),
  close: () => ipcRenderer.invoke('close'),
  processCommand: (cmd) => ipcRenderer.invoke('process-command', cmd),
  getSkills: () => ipcRenderer.invoke('get-skills'),
  predictWord: (word) => ipcRenderer.invoke('predict-word', cmd),
  executeSystem: (cmd) => ipcRenderer.invoke('execute-system', cmd),
  reloadSkills: () => ipcRenderer.invoke('reload-skills'),
  
  onLog: (callback) => {
    ipcRenderer.on('log', (event, data) => callback(data));
  },
  
  onSkillsLoaded: (callback) => {
    ipcRenderer.on('skills-loaded', (event, data) => callback(data));
  }
});