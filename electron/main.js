const { app, BrowserWindow, shell } = require('electron')
const path = require('path')
const { fork } = require('child_process')

const isDev = process.env.NODE_ENV !== 'production'
const PORT = 3001
let mainWindow
let serverProcess

function startServer () {
  const serverPath = isDev
    ? path.join(__dirname, '../server/index.js')
    : path.join(process.resourcesPath, 'server/index.js')

  serverProcess = fork(serverPath, [], {
    env: {
      ...process.env,
      PORT,
      NODE_ENV: process.env.NODE_ENV || 'production',
      DB_PATH: path.join(app.getPath('userData'), 'companions.db')
    },
    silent: true
  })

  serverProcess.stdout?.on('data', d => console.log('[server]', d.toString().trim()))
  serverProcess.stderr?.on('data', d => console.error('[server]', d.toString().trim()))
}

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    title: 'NinjaOne Sales Companion',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    show: false,
    backgroundColor: '#08091A'
  })

  // Remove default menu bar
  mainWindow.setMenuBarVisibility(false)

  const url = isDev
    ? 'http://localhost:5173'
    : `http://localhost:${PORT}`

  // Wait for server to be ready then load the app
  const tryLoad = (attempts = 0) => {
    mainWindow.loadURL(url).catch(() => {
      if (attempts < 15) setTimeout(() => tryLoad(attempts + 1), 500)
    })
  }
  tryLoad()

  mainWindow.once('ready-to-show', () => mainWindow.show())

  // Open external links in the system browser, not Electron
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  mainWindow.on('closed', () => { mainWindow = null })
}

app.whenReady().then(() => {
  if (!isDev) startServer()
  createWindow()
})

app.on('window-all-closed', () => {
  if (serverProcess) serverProcess.kill()
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('before-quit', () => {
  if (serverProcess) serverProcess.kill()
})
