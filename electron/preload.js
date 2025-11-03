const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    uint8ToFilepath: (uint8Array, mediaType, originalFilename) => 
        ipcRenderer.invoke('uint8-to-filepath', { uint8Array, mediaType, originalFilename })
});