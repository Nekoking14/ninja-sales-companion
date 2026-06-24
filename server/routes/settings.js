const router = require('express').Router()
const db = require('../database')

function parse (v) { try { return JSON.parse(v) } catch { return v } }

// GET /api/settings — all keys with optional ?prefix=fw_
router.get('/', (req, res) => {
  try {
    const { prefix } = req.query
    const rows = prefix
      ? db.prepare("SELECT key, value FROM settings WHERE key LIKE ?").all(prefix + '%')
      : db.prepare("SELECT key, value FROM settings").all()
    res.json(rows.map(r => ({ key: r.key, value: parse(r.value) })))
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// GET /api/settings/:key
router.get('/:key', (req, res) => {
  try {
    const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(req.params.key)
    res.json({ value: row ? parse(row.value) : null })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// PUT /api/settings/:key
router.put('/:key', (req, res) => {
  try {
    const val = typeof req.body.value === 'string' ? req.body.value : JSON.stringify(req.body.value)
    db.prepare("INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now'))").run(req.params.key, val)
    res.json({ saved: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// DELETE /api/settings/:key
router.delete('/:key', (req, res) => {
  try {
    db.prepare('DELETE FROM settings WHERE key = ?').run(req.params.key)
    res.json({ deleted: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

module.exports = router
