const { app, BrowserWindow, shell, ipcMain } = require('electron')
const path  = require('path')
const fs    = require('fs')

const isDev = !app.isPackaged
const PORT  = 3001
let launcherWindow
let startupError = ''

// ── Start Express server inline ────────────────────────────────────────────
function startServer() {
  process.env.PORT     = String(PORT)
  process.env.NODE_ENV = 'production'
  process.env.DB_PATH  = path.join(app.getPath('userData'), 'companions.db')

  const serverPath = path.join(process.resourcesPath, 'server/index.js')
  const sqlitePath = path.join(process.resourcesPath, 'server/node_modules/better-sqlite3')

  const logPath = path.join(app.getPath('userData'), 'startup.log')
  const log = (msg) => {
    fs.appendFileSync(logPath, new Date().toISOString() + '  ' + msg + '\n')
    console.log(msg)
  }

  try { fs.writeFileSync(logPath, '') } catch (_) {}
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

// ── Auto updater ───────────────────────────────────────────────────────────
function setupAutoUpdater() {
  if (isDev) {
    setTimeout(() => {
      launcherWindow?.webContents?.send('update-current', { version: app.getVersion() + ' (dev)' })
    }, 1000)
    return
  }

  const { autoUpdater } = require('electron-updater')
  autoUpdater.autoDownload         = false
  autoUpdater.autoInstallOnAppQuit = true

  autoUpdater.on('update-available',    (info) => {
    launcherWindow?.webContents?.send('update-available', { version: info.version })
  })
  autoUpdater.on('update-not-available', () => {
    launcherWindow?.webContents?.send('update-current', { version: app.getVersion() })
  })
  autoUpdater.on('download-progress', (p) => {
    launcherWindow?.webContents?.send('download-progress', {
      percent: Math.round(p.percent),
      speed:   Math.round(p.bytesPerSecond / 1024)
    })
  })
  autoUpdater.on('update-downloaded', () => {
    launcherWindow?.webContents?.send('update-downloaded')
  })
  autoUpdater.on('error', (err) => {
    console.error('Updater error:', err.message)
    launcherWindow?.webContents?.send('update-current', { version: app.getVersion() })
  })

  setTimeout(() => autoUpdater.checkForUpdates(), 2500)

  ipcMain.on('start-download',  ()  => autoUpdater.downloadUpdate())
  ipcMain.on('install-update',  ()  => autoUpdater.quitAndInstall(false, true))
}

// ── IPC ────────────────────────────────────────────────────────────────────
ipcMain.on('open-app', () => shell.openExternal(`http://localhost:${PORT}`))
ipcMain.on('open-log', () => shell.openPath(path.join(app.getPath('userData'), 'startup.log')))
ipcMain.on('quit',     () => app.quit())

// ── Launcher window ────────────────────────────────────────────────────────
function createLauncher(serverOk) {
  const iconPath = isDev
    ? path.join(__dirname, '../build/icon.ico')
    : path.join(process.resourcesPath, '../build/icon.ico')

  launcherWindow = new BrowserWindow({
    width: 420, height: serverOk ? 220 : 310,
    resizable: false,
    title: 'NinjaOne Sales Companion',
    icon: iconPath,
    webPreferences: { nodeIntegration: true, contextIsolation: false },
    backgroundColor: '#08091A',
    show: false
  })

  launcherWindow.setMenuBarVisibility(false)

  const dot   = serverOk ? '#22C55E' : '#EF4444'
  const label = serverOk ? `Server running on port ${PORT}` : 'Server failed to start'
  const errorBlock = serverOk ? '' : `
    <div class="err">${startupError.replace(/</g,'&lt;').replace(/\n/g,'<br>')}</div>
    <button class="log" onclick="openLog()">Open error log</button>`

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#08091A;color:#E2E8F5;font-family:system-ui,sans-serif;
         display:flex;flex-direction:column;align-items:center;justify-content:center;
         height:100vh;gap:10px;padding:16px;user-select:none}
    .row{display:flex;align-items:center;gap:10px}
    .logo{width:32px;height:32px;background:#05C49A;border-radius:8px;display:flex;
          align-items:center;justify-content:center;font-size:15px;font-weight:800;color:#042D22}
    .title{font-size:15px;font-weight:600}
    .version{font-size:10px;color:#3D4D70}
    .status{display:flex;align-items:center;gap:7px;font-size:12px;color:#8A9CC0}
    .sdot{width:8px;height:8px;border-radius:50%;background:${dot};animation:p 2s infinite}
    @keyframes p{0%,100%{opacity:1}50%{opacity:.4}}
    .urow{display:flex;align-items:center;gap:8px;width:100%;padding:8px 12px;
          background:#1E2A4430;border:1px solid #1E2A44;border-radius:8px;
          font-size:11px;transition:all 0.3s;min-height:36px}
    .urow.clickable{cursor:pointer}
    .urow.clickable:hover{opacity:.85}
    .udot{font-size:12px;color:#3D4D70;flex-shrink:0;width:14px;text-align:center}
    .utext{flex:1;color:#8A9CC0;line-height:1.4}
    .pbar{width:100%;height:4px;background:#1E2A44;border-radius:2px;margin-top:5px;overflow:hidden;display:none}
    .pfill{height:100%;background:#4B8EF5;border-radius:2px;transition:width 0.4s;width:0%}
    .err{background:#1E2A44;border:1px solid #EF444440;border-radius:8px;padding:10px 12px;
         font-size:10px;color:#EF4444;line-height:1.5;width:100%;word-break:break-all;max-height:80px;overflow:auto}
    .btns{display:flex;gap:8px;width:100%}
    button{padding:8px 16px;border-radius:8px;border:none;font-size:12px;font-weight:500;
           cursor:pointer;font-family:inherit;transition:opacity .15s}
    button:hover{opacity:.85}
    .open{background:#05C49A;color:#042D22;font-weight:700;flex:1}
    .quit{background:#1E2A44;color:#8A9CC0}
    .log{background:#1E2A44;color:#F59E0B;width:100%;padding:7px}
  </style></head><body>
    <div class="row">
      <div class="logo">N</div>
      <div>
        <div class="title">NinjaOne Sales Companion</div>
        <div class="version">v${app.getVersion()}</div>
      </div>
    </div>
    <div class="status"><div class="sdot"></div><span>${label}</span></div>
    ${errorBlock}

    <div class="urow" id="urow">
      <span class="udot" id="udot">◌</span>
      <div style="flex:1">
        <div class="utext" id="utext">Checking for updates…</div>
        <div class="pbar" id="pbar"><div class="pfill" id="pfill"></div></div>
      </div>
    </div>

    <div class="btns">
      ${serverOk ? '<button class="open" onclick="openApp()">Open in browser</button>' : ''}
      <button class="quit" onclick="quit()">Quit</button>
    </div>

    <script>
      const {ipcRenderer} = require('electron')
      const urow = document.getElementById('urow')
      const udot = document.getElementById('udot')
      const utext = document.getElementById('utext')
      const pbar = document.getElementById('pbar')
      const pfill = document.getElementById('pfill')

      function openApp() { ipcRenderer.send('open-app') }
      function openLog() { ipcRenderer.send('open-log') }
      function quit()    { ipcRenderer.send('quit') }

      ipcRenderer.on('update-current', (_, d) => {
        udot.textContent = '✓'
        udot.style.color = '#22C55E'
        utext.style.color = '#22C55E'
        utext.textContent = 'Up to date (v' + d.version + ')'
      })

      ipcRenderer.on('update-available', (_, d) => {
        udot.textContent = '⬆'
        udot.style.color = '#F59E0B'
        utext.style.color = '#F59E0B'
        utext.style.fontWeight = '600'
        utext.textContent = 'v' + d.version + ' available — click to update'
        urow.style.background = '#F59E0B10'
        urow.style.borderColor = '#F59E0B50'
        urow.classList.add('clickable')
        urow.onclick = () => {
          urow.classList.remove('clickable')
          urow.onclick = null
          utext.textContent = 'Starting download…'
          ipcRenderer.send('start-download')
        }
      })

      ipcRenderer.on('download-progress', (_, d) => {
        udot.textContent = '⬇'
        udot.style.color = '#4B8EF5'
        utext.style.color = '#4B8EF5'
        utext.style.fontWeight = '400'
        utext.textContent = 'Downloading… ' + d.percent + '%  (' + d.speed + ' KB/s)'
        urow.style.background = '#4B8EF510'
        urow.style.borderColor = '#4B8EF540'
        pbar.style.display = 'block'
        pfill.style.width = d.percent + '%'
      })

      ipcRenderer.on('update-downloaded', () => {
        udot.textContent = '✓'
        udot.style.color = '#22C55E'
        utext.style.color = '#22C55E'
        utext.style.fontWeight = '700'
        utext.textContent = 'Ready — click to restart and install'
        pbar.style.display = 'none'
        urow.style.background = '#22C55E10'
        urow.style.borderColor = '#22C55E50'
        urow.classList.add('clickable')
        urow.onclick = () => ipcRenderer.send('install-update')
      })
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
  setupAutoUpdater()
})

app.on('window-all-closed', () => app.quit())
