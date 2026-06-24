const router = require('express').Router()
const db = require('../database')

// POST /api/report-items
router.post('/', (req, res) => {
  try {
    const { session_id, prospect_id, framework, sub_selection, content } = req.body
    if (!session_id || !prospect_id || !framework || !content) {
      return res.status(400).json({ error: 'session_id, prospect_id, framework and content are required' })
    }
    const result = db.prepare(`
      INSERT INTO report_items (session_id, prospect_id, framework, sub_selection, content)
      VALUES (?, ?, ?, ?, ?)
    `).run(session_id, prospect_id, framework, sub_selection || null, content)

    const item = db.prepare('SELECT * FROM report_items WHERE id = ?').get(result.lastInsertRowid)
    res.status(201).json(item)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/report-items/:id
router.delete('/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM report_items WHERE id = ?').run(req.params.id)
    if (result.changes === 0) return res.status(404).json({ error: 'Item not found' })
    res.json({ deleted: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
