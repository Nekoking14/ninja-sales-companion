const { app, BrowserWindow, shell, ipcMain } = require('electron')
const path  = require('path')
const fs    = require('fs')
const https = require('https')
const { execFile } = require('child_process')

const isDev = !app.isPackaged
const PORT  = 3001
let launcherWindow
let downloadedInstallerPath = null
let latestReleaseInfo       = null

// ── GitHub update config ───────────────────────────────────────────────────
const REPO_OWNER = 'Nekoking14'
const REPO_NAME  = 'ninja-sales-companion'
const GH_TOKEN   = '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'
const CURRENT_VERSION = app.getVersion()

// ── Server ──────────────────────────────────────────────────────────────────
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

// ── GitHub API helper ───────────────────────────────────────────────────────
function ghRequest (apiPath) {
  return new Promise((resolve, reject) => {
    https.get({
      hostname: 'api.github.com',
      path: apiPath,
      headers: {
        'User-Agent':    'NinjaOne-Sales-Companion',
        'Authorization': `token ${GH_TOKEN}`,
        'Accept':        'application/vnd.github+json'
      }
    }, res => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => {
        try { resolve({ status: res.statusCode, json: JSON.parse(data) }) }
        catch (e) { reject(e) }
      })
    }).on('error', reject)
  })
}

function compareVersions (a, b) {
  const pa = a.replace(/^v/, '').split('.').map(Number)
  const pb = b.replace(/^v/, '').split('.').map(Number)
  for (let i = 0; i < 3; i++) {
    if ((pa[i] || 0) > (pb[i] || 0)) return 1
    if ((pa[i] || 0) < (pb[i] || 0)) return -1
  }
  return 0
}

async function checkForUpdate () {
  try {
    const { status, json } = await ghRequest(`/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`)
    if (status !== 200) return null
    const remoteVersion = json.tag_name
    if (compareVersions(remoteVersion, CURRENT_VERSION) <= 0) return null
    const asset = (json.assets || []).find(a => a.name.endsWith('.exe'))
    if (!asset) return null
    latestReleaseInfo = { version: remoteVersion, assetUrl: asset.url, assetName: asset.name }
    return latestReleaseInfo
  } catch (e) {
    console.error('[update check failed]', e)
    return null
  }
}

// ── Download release asset (follows GitHub's S3 redirect) ──────────────────
function downloadAsset (asset, onProgress) {
  return new Promise((resolve, reject) => {
    const destPath = path.join(app.getPath('temp'), asset.assetName)
    const file = fs.createWriteStream(destPath)

    function get (url, includeAuth) {
      https.get(url, {
        headers: {
          'User-Agent': 'NinjaOne-Sales-Companion',
          'Accept':     'application/octet-stream',
          ...(includeAuth ? { 'Authorization': `token ${GH_TOKEN}` } : {})
        }
      }, res => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return get(res.headers.location, false) // S3 redirect — no auth header
        }
        if (res.statusCode !== 200) return reject(new Error(`Download failed: ${res.statusCode}`))

        const total = parseInt(res.headers['content-length'] || '0', 10)
        let downloaded = 0
        res.on('data', chunk => {
          downloaded += chunk.length
          if (total) onProgress(Math.round((downloaded / total) * 100))
        })
        res.pipe(file)
        file.on('finish', () => { file.close(); resolve(destPath) })
      }).on('error', reject)
    }
    get(asset.assetUrl, true)
  })
}

// ── IPC ────────────────────────────────────────────────────────────────────
ipcMain.on('open-app', () => shell.openExternal(`http://localhost:${PORT}`))
ipcMain.on('quit',     () => app.quit())

ipcMain.handle('check-update', async () => checkForUpdate())

ipcMain.on('download-update', async () => {
  if (!latestReleaseInfo) return
  try {
    const filePath = await downloadAsset(latestReleaseInfo, pct => {
      launcherWindow?.webContents.send('update-progress', pct)
    })
    downloadedInstallerPath = filePath
    launcherWindow?.webContents.send('update-ready')
  } catch (e) {
    launcherWindow?.webContents.send('update-error', e.message)
  }
})

ipcMain.on('restart-update', () => {
  if (downloadedInstallerPath) {
    execFile(downloadedInstallerPath, [], { detached: true })
  }
  app.quit()
})

// ── Launcher window ────────────────────────────────────────────────────────
function createLauncher (serverOk) {
  launcherWindow = new BrowserWindow({
    width: 360, height: serverOk ? 210 : 220,
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
         height:100vh;gap:12px;user-select:none;padding:16px}
    .row{display:flex;align-items:center;gap:10px}
    .logo{width:32px;height:32px;background:#05C49A;border-radius:8px;display:flex;
          align-items:center;justify-content:center;font-size:15px;font-weight:800;color:#042D22}
    .title{font-size:15px;font-weight:600}
    .status{display:flex;align-items:center;gap:7px;font-size:12px;color:#8A9CC0}
    .dot{width:8px;height:8px;border-radius:50%;background:${dot};animation:p 2s infinite}
    @keyframes p{0%,100%{opacity:1}50%{opacity:.4}}
    .btns{display:flex;gap:8px}
    button{padding:8px 16px;border-radius:8px;border:none;font-size:12px;font-weight:500;
           cursor:pointer;font-family:inherit;transition:opacity .15s;white-space:nowrap}
    button:hover{opacity:.85}
    .open{background:#05C49A;color:#042D22;font-weight:700}
    .quit{background:#1E2A44;color:#8A9CC0}
    .update{background:#F59E0B;color:#2A1B00;font-weight:700;display:none}
    .progress-wrap{display:none;width:100%;flex-direction:column;gap:5px}
    .progress-bar{width:100%;height:6px;background:#1E2A44;border-radius:999px;overflow:hidden}
    .progress-fill{height:100%;width:0%;background:#05C49A;transition:width .2s}
    .progress-label{font-size:11px;color:#8A9CC0;text-align:center}
  </style></head><body>
    <div class="row">
      <div class="logo">N</div>
      <div class="title">NinjaOne Sales Companion</div>
    </div>
    <div class="status"><div class="dot"></div><span>${label}</span></div>

    <div class="progress-wrap" id="progressWrap">
      <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
      <div class="progress-label" id="progressLabel">Downloading update…</div>
    </div>

    <div class="btns">
      ${serverOk ? '<button class="open" onclick="o()">Open in browser</button>' : ''}
      <button class="update" id="updateBtn" onclick="onUpdateClick()">Update available</button>
      <button class="quit" onclick="q()">Quit</button>
    </div>

    <script>
      const {ipcRenderer} = require('electron')
      let updateState = 'idle' // idle | available | downloading | ready

      function o(){ ipcRenderer.send('open-app') }
      function q(){ ipcRenderer.send('quit') }

      function onUpdateClick () {
        if (updateState === 'available') {
          updateState = 'downloading'
          document.getElementById('updateBtn').style.display = 'none'
          document.getElementById('progressWrap').style.display = 'flex'
          ipcRenderer.send('download-update')
        } else if (updateState === 'ready') {
          ipcRenderer.send('restart-update')
        }
      }

      ipcRenderer.invoke('check-update').then(info => {
        if (info) {
          updateState = 'available'
          const btn = document.getElementById('updateBtn')
          btn.textContent = 'Update to ' + info.version
          btn.style.display = 'inline-block'
        }
      })

      ipcRenderer.on('update-progress', (_e, pct) => {
        document.getElementById('progressFill').style.width = pct + '%'
        document.getElementById('progressLabel').textContent = 'Downloading update… ' + pct + '%'
      })

      ipcRenderer.on('update-ready', () => {
        updateState = 'ready'
        document.getElementById('progressLabel').textContent = 'Ready to install'
        const btn = document.getElementById('updateBtn')
        btn.textContent = 'Restart to update'
        btn.style.display = 'inline-block'
      })

      ipcRenderer.on('update-error', (_e, msg) => {
        document.getElementById('progressLabel').textContent = 'Update failed — try again later'
      })
    </script>
  </body></html>`

  launcherWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html))
  launcherWindow.once('ready-to-show', () => launcherWindow.show())
  launcherWindow.on('close', () => app.quit())
}

// ── Lifecycle ──────────────────────────────────────────────────────────────
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
