const { app, BrowserWindow, shell } = require('electron')
const path = require('path')

const isDev = process.env.NODE_ENV !== 'production'
const PORT  = 3001
let mainWindow

function startServer () {
  // Add root app node_modules to global search path
  // so server code can find better-sqlite3 which lives there
  const Module = require('module')
  Module.globalPaths.push(
    path.join(process.resourcesPath, 'app', 'node_modules')
  )

  // Set env vars the server reads
  process.env.PORT    = String(PORT)
  process.env.NODE_ENV = 'production'
  process.env.DB_PATH  = path.join(app.getPath('userData'), 'companions.db')

  const serverPath = path.join(process.resourcesPath, 'server/index.js')

  try {
    require(serverPath)
    console.log('[main] server started at port', PORT)
  } catch (err) {
    console.error('[main] server failed to start:', err)
  }
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

  // Ctrl+Shift+I opens DevTools
  mainWindow.webContents.on('before-input-event', (_, input) => {
    if (input.control && input.shift && input.key === 'I') {
      mainWindow.webContents.openDevTools()
    }
  })

  const appUrl = isDev ? 'http://localhost:5173' : `http://localhost:${PORT}`

  const tryLoad = (attempts = 0) => {
    mainWindow.loadURL(appUrl).catch(err => {
      if (attempts < 40) {
        setTimeout(() => tryLoad(attempts + 1), 500)
      } else {
        mainWindow.loadURL('data:text/html,' + encodeURIComponent(`
          <html><head><style>
            body{margin:0;background:#08091A;display:flex;align-items:center;
                 justify-content:center;height:100vh;font-family:system-ui;color:#E2E8F5;}
            .box{text-align:center;max-width:500px;padding:32px;}
            h2{color:#EF4444;margin-bottom:12px;}
            p{color:#8A9CC0;font-size:14px;line-height:1.7;}
            code{background:#1E2A44;padding:2px 8px;border-radius:4px;font-size:12px;}
          </style></head>
          <body><div class="box">
            <h2>Could not connect to app server</h2>
            <p>Press <code>Ctrl+Shift+I</code> to open DevTools,
               then click the <strong>Console</strong> tab to see the exact error.</p>
            <p style="font-size:12px;margin-top:16px;color:#3D4D70">
              Last error: ${err?.message || 'timeout'}
            </p>
          </div></body></html>
        `))
      }
    })
  }

  mainWindow.once('ready-to-show', () => mainWindow.show())

  // Short delay to let the server bind the port, then start loading
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
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
