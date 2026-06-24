const { app, BrowserWindow, shell } = require('electron')
const path = require('path')
const { fork } = require('child_process')

const isDev = process.env.NODE_ENV !== 'production'
const PORT  = 3001
let mainWindow
let serverProcess

function startServer () {
  const serverPath = isDev
    ? path.join(__dirname, '../server/index.js')
    : path.join(process.resourcesPath, 'server/index.js')

  // In production, better-sqlite3 lives in app.asar.unpacked/node_modules
  // We pass NODE_PATH so the server process can find it
  const unpackedModules = path.join(
    process.resourcesPath,
    'app.asar.unpacked',
    'node_modules'
  )

  serverProcess = fork(serverPath, [], {
    env: {
      ...process.env,
      PORT,
      NODE_ENV: 'production',
      DB_PATH: path.join(app.getPath('userData'), 'companions.db'),
      NODE_PATH: isDev ? undefined : unpackedModules
    },
    silent: false
  })

  serverProcess.on('error', err => console.error('[server error]', err))
  serverProcess.on('exit', code => console.error('[server exited with code]', code))
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

  mainWindow.setMenuBarVisibility(false)

  // Open DevTools with Ctrl+Shift+I (useful if something goes wrong)
  mainWindow.webContents.on('before-input-event', (_, input) => {
    if (input.control && input.shift && input.key === 'I') {
      mainWindow.webContents.openDevTools()
    }
  })

  const appUrl = isDev ? 'http://localhost:5173' : `http://localhost:${PORT}`

  // Retry loading until server is ready
  const tryLoad = (attempts = 0) => {
    mainWindow.loadURL(appUrl).catch(() => {
      if (attempts < 40) {
        setTimeout(() => tryLoad(attempts + 1), 500)
      } else {
        // Show error page after 20 seconds of retrying
        mainWindow.loadURL('data:text/html,' + encodeURIComponent(`
          <html><head><style>
            body{margin:0;background:#08091A;display:flex;align-items:center;
                 justify-content:center;height:100vh;font-family:system-ui;color:#E2E8F5;}
            .box{text-align:center;max-width:460px;padding:32px;}
            h2{color:#EF4444;margin-bottom:12px;font-size:20px;}
            p{color:#8A9CC0;font-size:14px;line-height:1.6;margin:8px 0;}
            code{background:#1E2A44;padding:2px 8px;border-radius:4px;font-size:12px;}
          </style></head>
          <body><div class="box">
            <h2>Could not start the app server</h2>
            <p>Press <code>Ctrl+Shift+I</code> to open DevTools and check the Console tab for errors.</p>
            <p style="font-size:12px;color:#3D4D70;margin-top:16px;">
              Common cause: database module not compatible with this version of Windows.
            </p>
          </div></body></html>
        `))
      }
    })
  }

  mainWindow.once('ready-to-show', () => mainWindow.show())
  setTimeout(() => tryLoad(), 800)

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
