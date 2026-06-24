const { app, BrowserWindow, shell, ipcMain } = require('electron')
const path = require('path')

const isDev = process.env.NODE_ENV !== 'production'
const PORT  = 3001
let launcherWindow

// ── Start the Express server inline (no forking) ───────────────────────────
function startServer () {
  const Module = require('module')
  // Make better-sqlite3 findable from server code
  Module.globalPaths.push(
    path.join(process.resourcesPath, 'app', 'node_modules')
  )
  process.env.PORT     = String(PORT)
  process.env.NODE_ENV = 'production'
  process.env.DB_PATH  = path.join(app.getPath('userData'), 'companions.db')

  try {
    require(path.join(process.resourcesPath, 'server/index.js'))
    return true
  } catch (err) {
    console.error('[server failed]', err)
    return false
  }
}

// ── IPC handlers for launcher buttons ─────────────────────────────────────
ipcMain.on('open-app', () => shell.openExternal(`http://localhost:${PORT}`))
ipcMain.on('quit',     () => app.quit())

// ── Small launcher window ──────────────────────────────────────────────────
function createLauncher (serverOk) {
  launcherWindow = new BrowserWindow({
    width:     340,
    height:    190,
    resizable: false,
    title:     'NinjaOne Sales Companion',
    webPreferences: {
      nodeIntegration:  true,
      contextIsolation: false
    },
    backgroundColor: '#08091A',
    show: false
  })

  launcherWindow.setMenuBarVisibility(false)

  const statusColor = serverOk ? '#22C55E' : '#EF4444'
  const statusText  = serverOk ? 'Server running on port ' + PORT : 'Server failed to start'

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    background: #08091A;
    color: #E2E8F5;
    font-family: system-ui, -apple-system, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    gap: 14px;
    user-select: none;
  }
  .logo-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .logo {
    width: 32px; height: 32px;
    background: #05C49A;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; font-weight: 800; color: #042D22;
  }
  .title { font-size: 15px; font-weight: 600; }
  .status {
    display: flex; align-items: center; gap: 7px;
    font-size: 12px; color: #8A9CC0;
  }
  .dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: ${statusColor};
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%,100% { opacity:1; } 50% { opacity:0.4; }
  }
  .buttons {
    display: flex;
    gap: 8px;
    margin-top: 4px;
  }
  button {
    padding: 8px 18px;
    border-radius: 8px;
    border: none;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    font-family: inherit;
    transition: opacity 0.15s;
  }
  button:hover { opacity: 0.85; }
  .btn-open { background: #05C49A; color: #042D22; font-weight: 700; }
  .btn-quit { background: #1E2A44; color: #8A9CC0; }
</style>
</head>
<body>
  <div class="logo-row">
    <div class="logo">N</div>
    <div class="title">NinjaOne Sales Companion</div>
  </div>
  <div class="status">
    <div class="dot"></div>
    <span>${statusText}</span>
  </div>
  <div class="buttons">
    <button class="btn-open" onclick="openApp()">Open in browser</button>
    <button class="btn-quit" onclick="quit()">Quit</button>
  </div>
  <script>
    const { ipcRenderer } = require('electron')
    function openApp() { ipcRenderer.send('open-app') }
    function quit()    { ipcRenderer.send('quit') }
  </script>
</body>
</html>`

  launcherWindow.loadURL(
    'data:text/html;charset=utf-8,' + encodeURIComponent(html)
  )

  launcherWindow.once('ready-to-show', () => launcherWindow.show())
  launcherWindow.on('close', () => app.quit())
}

// ── App lifecycle ──────────────────────────────────────────────────────────
app.whenReady().then(() => {
  let serverOk = true
  if (!isDev) serverOk = startServer()

  createLauncher(serverOk)

  // Auto-open browser after server has time to bind the port
  if (serverOk) {
    setTimeout(() => {
      shell.openExternal(
        isDev ? 'http://localhost:5173' : `http://localhost:${PORT}`
      )
    }, 1500)
  }
})

app.on('window-all-closed', () => app.quit())
