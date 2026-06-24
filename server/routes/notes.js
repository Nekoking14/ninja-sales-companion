const router = require('express').Router()
const db = require('../database')

// POST /api/notes
router.post('/', (req, res) => {
  try {
    const { session_id, prospect_id, content } = req.body
    if (!session_id || !prospect_id || !content?.trim()) {
      return res.status(400).json({ error: 'session_id, prospect_id and content are required' })
    }
    const result = db.prepare(`
      INSERT INTO notes (session_id, prospect_id, content) VALUES (?, ?, ?)
    `).run(session_id, prospect_id, content.trim())

    const note = db.prepare('SELECT * FROM notes WHERE id = ?').get(result.lastInsertRowid)
    res.status(201).json(note)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/notes/:id
router.delete('/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM notes WHERE id = ?').run(req.params.id)
    if (result.changes === 0) return res.status(404).json({ error: 'Note not found' })
    res.json({ deleted: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
