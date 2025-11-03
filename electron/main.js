const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Load your React app
  if (isDev) {
    // Development: Load from Vite dev server
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    // Production: Load from built files
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Your file system code here (keep your existing uint8-to-filepath handler)
function getMediaDirectory() {
    const platform = process.platform;
    if (platform === 'linux') {
        return path.join(os.homedir(), '.local', 'share', 'tilChat', 'media');
    }
    switch (platform) {
        case 'win32': return path.join(os.homedir(), 'AppData', 'Roaming', 'tilChat', 'media');
        case 'darwin': return path.join(os.homedir(), 'Library', 'Application Support', 'tilChat', 'media');
        default: return path.join(os.homedir(), '.tilChat', 'media');
    }
}

const mediaPath = getMediaDirectory();

ipcMain.handle('uint8-to-filepath', async (event, { uint8Array, mediaType, originalFilename }) => {
    try {
        const actualMediaPath = getMediaDirectory();
        
        if (!fs.existsSync(actualMediaPath)) {
            fs.mkdirSync(actualMediaPath, { recursive: true, mode: 0o755 });
        }
        
        const extensions = {
            'image': '.jpg', 'image/jpeg': '.jpg', 'image/png': '.png', 'image/gif': '.gif',
            'video': '.mp4', 'video/mp4': '.mp4', 'audio': '.mp3', 'audio/mp3': '.mp3',
        };
        
        const ext = extensions[mediaType] || '.bin';
        const filename = `media_${Date.now()}${ext}`;
        const filePath = path.join(actualMediaPath, filename);
        
        fs.writeFileSync(filePath, uint8Array, { mode: 0o644 });
        
        return { 
            success: true, 
            filePath: `file://${filePath}`
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
});