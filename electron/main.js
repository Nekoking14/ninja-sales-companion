const { app, BrowserWindow, shell } = require('electron')
const path = require('path')
const { fork } = require('child_process')

const isDev = process.env.NODE_ENV !== 'production'
const PORT  = 3001
let mainWindow
let serverProcess

// Loading screen shown while server boots
const LOADING_HTML = `data:text/html,
<html>
<head><style>
  body { margin:0; background:#08091A; display:flex; align-items:center;
         justify-content:center; height:100vh; font-family:system-ui; }
  .box { text-align:center; color:#E2E8F5; }
  .logo { width:48px; height:48px; background:#05C49A; border-radius:12px;
          display:flex; align-items:center; justify-content:center;
          font-size:22px; font-weight:800; color:#042D22; margin:0 auto 16px; }
  p { color:#8A9CC0; font-size:14px; margin:8px 0 0; }
  .dot { display:inline-block; width:6px; height:6px; border-radius:50%;
         background:#05C49A; margin:0 3px; animation:pulse 1.2s infinite; }
  .dot:nth-child(2) { animation-delay:.2s; }
  .dot:nth-child(3) { animation-delay:.4s; }
  @keyframes pulse { 0%,100%{opacity:.3} 50%{opacity:1} }
</style></head>
<body>
  <div class="box">
    <div class="logo">N</div>
    <div style="font-size:18px;font-weight:600">NinjaOne Sales Companion</div>
    <p>Starting up <span class="dot"></span><span class="dot"></span><span class="dot"></span></p>
  </div>
</body>
</html>`

function startServer () {
  const serverPath = isDev
    ? path.join(__dirname, '../server/index.js')
    : path.join(process.resourcesPath, 'server/index.js')

  serverProcess = fork(serverPath, [], {
    env: {
      ...process.env,
      PORT,
      NODE_ENV: 'production',
      DB_PATH: path.join(app.getPath('userData'), 'companions.db')
    },
    silent: false
  })

  serverProcess.on('error', err => {
    console.error('[server error]', err)
  })

  serverProcess.on('exit', code => {
    console.error('[server exited]', code)
  })
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

  // Show loading screen immediately
  mainWindow.loadURL(LOADING_HTML)
  mainWindow.once('ready-to-show', () => mainWindow.show())

  // Open DevTools with Ctrl+Shift+I (useful for debugging)
  mainWindow.webContents.on('before-input-event', (_, input) => {
    if (input.control && input.shift && input.key === 'I') {
      mainWindow.webContents.openDevTools()
    }
  })

  // Try loading the app URL, retry until server is ready
  const appUrl = isDev ? 'http://localhost:5173' : `http://localhost:${PORT}`

  const tryLoad = (attempts = 0) => {
    mainWindow.loadURL(appUrl).catch(() => {
      if (attempts < 30) {
        setTimeout(() => tryLoad(attempts + 1), 500)
      } else {
        // Server never started — show error page
        mainWindow.loadURL(`data:text/html,
<html><head><style>
  body{margin:0;background:#08091A;display:flex;align-items:center;
       justify-content:center;height:100vh;font-family:system-ui;color:#E2E8F5;}
  .box{text-align:center;max-width:420px;padding:24px;}
  h2{color:#EF4444;margin-bottom:12px;}
  p{color:#8A9CC0;font-size:14px;line-height:1.6;}
  code{background:#1E2A44;padding:2px 8px;border-radius:4px;font-size:13px;}
</style></head>
<body><div class="box">
  <h2>⚠ Could not start the server</h2>
  <p>The app server failed to start. This is usually a compatibility issue with the database module.</p>
  <p>Press <code>Ctrl+Shift+I</code> to open DevTools for more details.</p>
</div></body></html>`)
      }
    })
  }

  // Give server a moment to boot before first attempt
  setTimeout(() => tryLoad(), 1000)

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
