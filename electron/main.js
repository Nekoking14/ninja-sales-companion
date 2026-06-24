const { app, BrowserWindow, shell, ipcMain } = require('electron')
const path = require('path')
const fs   = require('fs')

const isDev = !app.isPackaged
const PORT  = 3001
let launcherWindow
let startupError = ''

// ── Start Express server inline ────────────────────────────────────────────
function startServer () {
  process.env.PORT     = String(PORT)
  process.env.NODE_ENV = 'production'
  process.env.DB_PATH  = path.join(app.getPath('userData'), 'companions.db')

  const serverPath = path.join(process.resourcesPath, 'server/index.js')
  const sqlitePath = path.join(process.resourcesPath, 'server/node_modules/better-sqlite3')

  // Diagnostic checks — write to log file so we can see what happened
  const logPath = path.join(app.getPath('userData'), 'startup.log')
  const log = (msg) => {
    fs.appendFileSync(logPath, new Date().toISOString() + '  ' + msg + '\n')
    console.log(msg)
  }

  try { fs.writeFileSync(logPath, '') } catch (_) {} // clear log on each start

  log('resourcesPath: ' + process.resourcesPath)
  log('serverPath exists: ' + fs.existsSync(serverPath))
  log('better-sqlite3 exists: ' + fs.existsSync(sqlitePath))
  log('DB_PATH: ' + process.env.DB_PATH)

  if (!fs.existsSync(serverPath)) {
    startupError = 'server/index.js not found at:\n' + serverPath
    log('ERROR: ' + startupError)
    return false
  }

  try {
    require(serverPath)
    log('Server started OK')
    return true
  } catch (err) {
    startupError = err.message
    log('ERROR requiring server: ' + err.stack)
    return false
  }
}

// ── IPC ────────────────────────────────────────────────────────────────────
ipcMain.on('open-app',  () => shell.openExternal(`http://localhost:${PORT}`))
ipcMain.on('open-log',  () => shell.openPath(path.join(app.getPath('userData'), 'startup.log')))
ipcMain.on('quit',      () => app.quit())

// ── Launcher window ────────────────────────────────────────────────────────
function createLauncher (serverOk) {
  launcherWindow = new BrowserWindow({
    width: 400, height: serverOk ? 190 : 280,
    resizable: false,
    title: 'NinjaOne Sales Companion',
    webPreferences: { nodeIntegration: true, contextIsolation: false },
    backgroundColor: '#08091A',
    show: false
  })

  launcherWindow.setMenuBarVisibility(false)

  const dot   = serverOk ? '#22C55E' : '#EF4444'
  const label = serverOk
    ? `Server running on port ${PORT}`
    : 'Server failed to start'

  const errorBlock = serverOk ? '' : `
    <div class="err">${startupError.replace(/</g,'&lt;').replace(/\n/g,'<br>')}</div>
    <button class="log" onclick="openLog()">Open error log</button>`

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#08091A;color:#E2E8F5;font-family:system-ui,sans-serif;
         display:flex;flex-direction:column;align-items:center;justify-content:center;
         height:100vh;gap:12px;padding:16px;user-select:none}
    .row{display:flex;align-items:center;gap:10px}
    .logo{width:32px;height:32px;background:#05C49A;border-radius:8px;display:flex;
          align-items:center;justify-content:center;font-size:15px;font-weight:800;color:#042D22}
    .title{font-size:15px;font-weight:600}
    .status{display:flex;align-items:center;gap:7px;font-size:12px;color:#8A9CC0}
    .dot{width:8px;height:8px;border-radius:50%;background:${dot};animation:p 2s infinite}
    @keyframes p{0%,100%{opacity:1}50%{opacity:.4}}
    .err{background:#1E2A44;border:1px solid #EF444440;border-radius:8px;padding:10px 12px;
         font-size:10px;color:#EF4444;line-height:1.5;width:100%;word-break:break-all;
         max-height:80px;overflow:auto}
    .btns{display:flex;gap:8px;margin-top:4px}
    button{padding:7px 16px;border-radius:8px;border:none;font-size:12px;font-weight:500;
           cursor:pointer;font-family:inherit;transition:opacity .15s}
    button:hover{opacity:.85}
    .open{background:#05C49A;color:#042D22;font-weight:700}
    .quit{background:#1E2A44;color:#8A9CC0}
    .log{background:#1E2A44;color:#F59E0B;width:100%;padding:7px}
  </style></head><body>
    <div class="row">
      <div class="logo">N</div>
      <div class="title">NinjaOne Sales Companion</div>
    </div>
    <div class="status"><div class="dot"></div><span>${label}</span></div>
    ${errorBlock}
    <div class="btns">
      ${serverOk ? '<button class="open" onclick="openApp()">Open in browser</button>' : ''}
      <button class="quit" onclick="quit()">Quit</button>
    </div>
    <script>
      const {ipcRenderer}=require('electron')
      function openApp()  { ipcRenderer.send('open-app') }
      function openLog()  { ipcRenderer.send('open-log') }
      function quit()     { ipcRenderer.send('quit') }
    </script>
  </body></html>`

  launcherWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html))
  launcherWindow.once('ready-to-show', () => launcherWindow.show())
  launcherWindow.on('close', () => app.quit())
}

// ── Lifecycle ──────────────────────────────────────────────────────────────
app.whenReady().then(() => {
  let serverOk = true
  if (!isDev) serverOk = startServer()
  createLauncher(serverOk)
  if (serverOk) {
    const url = isDev ? 'http://localhost:5173' : `http://localhost:${PORT}`
    setTimeout(() => shell.openExternal(url), 1500)
  }
})

app.on('window-all-closed', () => app.quit())
