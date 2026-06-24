const router = require('express').Router()
const db = require('../database')

// POST /api/sessions — start a new session for a prospect
router.post('/', (req, res) => {
  try {
    const { prospect_id } = req.body
    if (!prospect_id) return res.status(400).json({ error: 'prospect_id is required' })

    const prospect = db.prepare('SELECT id FROM prospects WHERE id = ?').get(prospect_id)
    if (!prospect) return res.status(404).json({ error: 'Prospect not found' })

    const result = db.prepare(
      'INSERT INTO sessions (prospect_id) VALUES (?)'
    ).run(prospect_id)

    const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(result.lastInsertRowid)
    res.status(201).json(session)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/sessions/:id — get session with its items and notes
router.get('/:id', (req, res) => {
  try {
    const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(req.params.id)
    if (!session) return res.status(404).json({ error: 'Session not found' })

    const reportItems = db.prepare(
      'SELECT * FROM report_items WHERE session_id = ? ORDER BY created_at ASC'
    ).all(req.params.id)

    const notes = db.prepare(
      'SELECT * FROM notes WHERE session_id = ? ORDER BY created_at ASC'
    ).all(req.params.id)

    res.json({ ...session, reportItems, notes })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/sessions/:id/qualification — save qualification form data
router.put('/:id/qualification', (req, res) => {
  try {
    const session = db.prepare('SELECT id FROM sessions WHERE id = ?').get(req.params.id)
    if (!session) return res.status(404).json({ error: 'Session not found' })
    const { qualification_data } = req.body
    db.prepare('UPDATE sessions SET qualification_data = ? WHERE id = ?')
      .run(JSON.stringify(qualification_data), req.params.id)
    res.json({ saved: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/sessions/:id/end — end an active session
router.put('/:id/end', (req, res) => {
  try {
    const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(req.params.id)
    if (!session) return res.status(404).json({ error: 'Session not found' })
    if (session.ended_at) return res.status(400).json({ error: 'Session already ended' })

    const { duration_sec } = req.body
    db.prepare(`
      UPDATE sessions
      SET ended_at = datetime('now'), duration_sec = ?
      WHERE id = ?
    `).run(duration_sec || null, req.params.id)

    const updated = db.prepare('SELECT * FROM sessions WHERE id = ?').get(req.params.id)
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
