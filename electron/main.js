const { app, BrowserWindow, shell, ipcMain } = require('electron')
const path = require('path')

const isDev = !app.isPackaged
const PORT  = 3001
let launcherWindow

function startServer () {
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

ipcMain.on('open-app', () => shell.openExternal(`http://localhost:${PORT}`))
ipcMain.on('quit',     () => app.quit())

function createLauncher (serverOk) {
  launcherWindow = new BrowserWindow({
    width: 340, height: serverOk ? 190 : 220,
    resizable: false,
    title: 'NinjaOne Sales Companion',
    webPreferences: { nodeIntegration: true, contextIsolation: false },
    backgroundColor: '#08091A',
    show: false
  })

  launcherWindow.setMenuBarVisibility(false)

  const dot   = serverOk ? '#22C55E' : '#EF4444'
  const label = serverOk ? `Server running on port ${PORT}` : 'Failed to start — check console'

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#08091A;color:#E2E8F5;font-family:system-ui,sans-serif;
         display:flex;flex-direction:column;align-items:center;justify-content:center;
         height:100vh;gap:14px;user-select:none}
    .row{display:flex;align-items:center;gap:10px}
    .logo{width:32px;height:32px;background:#05C49A;border-radius:8px;display:flex;
          align-items:center;justify-content:center;font-size:15px;font-weight:800;color:#042D22}
    .title{font-size:15px;font-weight:600}
    .status{display:flex;align-items:center;gap:7px;font-size:12px;color:#8A9CC0}
    .dot{width:8px;height:8px;border-radius:50%;background:${dot};animation:p 2s infinite}
    @keyframes p{0%,100%{opacity:1}50%{opacity:.4}}
    .btns{display:flex;gap:8px}
    button{padding:8px 18px;border-radius:8px;border:none;font-size:13px;font-weight:500;
           cursor:pointer;font-family:inherit;transition:opacity .15s}
    button:hover{opacity:.85}
    .open{background:#05C49A;color:#042D22;font-weight:700}
    .quit{background:#1E2A44;color:#8A9CC0}
  </style></head><body>
    <div class="row">
      <div class="logo">N</div>
      <div class="title">NinjaOne Sales Companion</div>
    </div>
    <div class="status"><div class="dot"></div><span>${label}</span></div>
    <div class="btns">
      ${serverOk ? '<button class="open" onclick="o()">Open in browser</button>' : ''}
      <button class="quit" onclick="q()">Quit</button>
    </div>
    <script>
      const {ipcRenderer}=require('electron')
      function o(){ipcRenderer.send('open-app')}
      function q(){ipcRenderer.send('quit')}
    </script>
  </body></html>`

  launcherWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html))
  launcherWindow.once('ready-to-show', () => launcherWindow.show())
  launcherWindow.on('close', () => app.quit())
}

app.whenReady().then(() => {
  let ok = true
  if (!isDev) ok = startServer()
  createLauncher(ok)
  if (ok) {
    const url = isDev ? 'http://localhost:5173' : `http://localhost:${PORT}`
    setTimeout(() => shell.openExternal(url), 1200)
  }
})

app.on('window-all-closed', () => app.quit())
