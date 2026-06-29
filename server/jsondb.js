const fs   = require('fs')
const path = require('path')

let FILE = null
let db = { prospects: [], sessions: [], report_items: [], notes: [], settings: [] }
let seq = { prospects: 1, sessions: 1, report_items: 1, notes: 1 }

// ── Init ───────────────────────────────────────────────────────────────────
function init (filePath) {
  FILE = filePath.replace(/\.db$/, '.json')
  const dir = path.dirname(FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (fs.existsSync(FILE)) {
    try {
      const loaded = JSON.parse(fs.readFileSync(FILE, 'utf8'))
      db = { ...db, ...loaded }
      for (const t of ['prospects', 'sessions', 'report_items', 'notes']) {
        if (db[t]?.length) seq[t] = Math.max(...db[t].map(r => r.id)) + 1
      }
    } catch (e) { console.error('DB load error:', e) }
  }
}

function save () {
  try { fs.writeFileSync(FILE, JSON.stringify(db, null, 2)) }
  catch (e) { console.error('DB save error:', e) }
}

const now = () => new Date().toISOString().replace('T', ' ').replace(/\.\d+Z$/, '')
const uid = t  => seq[t]++

// ── Prospects ──────────────────────────────────────────────────────────────
const prospects = {
  list () {
    return db.prospects.map(p => {
      const ss  = db.sessions.filter(s => s.prospect_id === p.id)
      const ris = db.report_items.filter(r => r.prospect_id === p.id)
      const last = ss.slice().sort((a, b) => new Date(b.started_at) - new Date(a.started_at))[0]
      return { ...p, session_count: ss.length, report_item_count: ris.length, last_session_at: last?.started_at || null }
    }).sort((a, b) => new Date(b.last_session_at || b.created_at) - new Date(a.last_session_at || a.created_at))
  },

  get (id) {
    const p = db.prospects.find(p => p.id === id)
    if (!p) return null
    const sessions = db.sessions
      .filter(s => s.prospect_id === id)
      .sort((a, b) => new Date(b.started_at) - new Date(a.started_at))
      .map(s => ({ ...s,
        item_count: db.report_items.filter(r => r.session_id === s.id).length,
        note_count: db.notes.filter(n => n.session_id === s.id).length
      }))
    const reportItems = db.report_items.filter(r => r.prospect_id === id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    const notes = db.notes.filter(n => n.prospect_id === id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    return { ...p, sessions, reportItems, notes }
  },

  create (d) {
    const r = { id: uid('prospects'), name: d.name?.trim(), company: d.company?.trim() || null,
      role: d.role?.trim() || null, industry: d.industry?.trim() || null,
      current_tool: d.current_tool?.trim() || null, notes: d.notes?.trim() || null,
      created_at: now(), updated_at: now() }
    db.prospects.push(r); save(); return r
  },

  update (id, d) {
    const i = db.prospects.findIndex(p => p.id === id); if (i < 0) return null
    db.prospects[i] = { ...db.prospects[i], name: d.name?.trim(),
      company: d.company?.trim() || null, role: d.role?.trim() || null,
      industry: d.industry?.trim() || null, current_tool: d.current_tool?.trim() || null,
      notes: d.notes?.trim() || null, updated_at: now() }
    save(); return db.prospects[i]
  },

  delete (id) {
    const i = db.prospects.findIndex(p => p.id === id); if (i < 0) return false
    db.prospects.splice(i, 1)
    db.sessions      = db.sessions.filter(s => s.prospect_id !== id)
    db.report_items  = db.report_items.filter(r => r.prospect_id !== id)
    db.notes         = db.notes.filter(n => n.prospect_id !== id)
    save(); return true
  }
}

// ── Sessions ───────────────────────────────────────────────────────────────
const sessions = {
  get (id) {
    const s = db.sessions.find(s => s.id === id); if (!s) return null
    return {
      ...s,
      reportItems: db.report_items.filter(r => r.session_id === id).sort((a,b) => new Date(a.created_at)-new Date(b.created_at)),
      notes:       db.notes.filter(n => n.session_id === id).sort((a,b) => new Date(a.created_at)-new Date(b.created_at))
    }
  },

  create (prospect_id) {
    const r = { id: uid('sessions'), prospect_id, started_at: now(), ended_at: null, duration_sec: null, qualification_data: null }
    db.sessions.push(r); save(); return r
  },

  end (id, duration_sec) {
    const i = db.sessions.findIndex(s => s.id === id); if (i < 0) return null
    db.sessions[i] = { ...db.sessions[i], ended_at: now(), duration_sec: duration_sec || null }
    save(); return db.sessions[i]
  },

  saveQual (id, data) {
    const i = db.sessions.findIndex(s => s.id === id); if (i < 0) return false
    const existing = JSON.parse(db.sessions[i].qualification_data || '{}')
    db.sessions[i].qualification_data = JSON.stringify({ ...existing, ...data })
    save(); return true
  }
}

// ── Report items ───────────────────────────────────────────────────────────
const reportItems = {
  create (d) {
    const r = { id: uid('report_items'), session_id: d.session_id, prospect_id: d.prospect_id,
      framework: d.framework, sub_selection: d.sub_selection || null, content: d.content, created_at: now() }
    db.report_items.push(r); save(); return r
  },
  delete (id) {
    const i = db.report_items.findIndex(r => r.id === id); if (i < 0) return false
    db.report_items.splice(i, 1); save(); return true
  }
}

// ── Notes ──────────────────────────────────────────────────────────────────
const notes = {
  create (d) {
    const r = { id: uid('notes'), session_id: d.session_id, prospect_id: d.prospect_id,
      content: d.content, created_at: now() }
    db.notes.push(r); save(); return r
  },
  delete (id) {
    const i = db.notes.findIndex(n => n.id === id); if (i < 0) return false
    db.notes.splice(i, 1); save(); return true
  }
}

// ── Settings ───────────────────────────────────────────────────────────────
function p (v) { try { return JSON.parse(v) } catch { return v } }

const settings = {
  list (prefix) {
    return (db.settings || [])
      .filter(s => !prefix || s.key.startsWith(prefix))
      .map(s => ({ key: s.key, value: p(s.value) }))
  },
  get (key) {
    const r = (db.settings || []).find(s => s.key === key)
    return r ? p(r.value) : null
  },
  upsert (key, value) {
    if (!db.settings) db.settings = []
    const val = typeof value === 'string' ? value : JSON.stringify(value)
    const i = db.settings.findIndex(s => s.key === key)
    if (i < 0) db.settings.push({ key, value: val, updated_at: now() })
    else db.settings[i] = { key, value: val, updated_at: now() }
    save(); return true
  },
  delete (key) {
    if (!db.settings) db.settings = []
    const i = db.settings.findIndex(s => s.key === key)
    if (i < 0) return false
    db.settings.splice(i, 1); save(); return true
  }
}

module.exports = { init, prospects, sessions, reportItems, notes, settings }
