const router = require('express').Router()
const db = require('../database')

// GET /api/prospects — list all prospects, most recent first
router.get('/', (_req, res) => {
  try {
    const rows = db.prepare(`
      SELECT p.*,
        COUNT(DISTINCT s.id)  AS session_count,
        COUNT(DISTINCT ri.id) AS report_item_count,
        MAX(s.started_at)     AS last_session_at
      FROM prospects p
      LEFT JOIN sessions s     ON s.prospect_id = p.id
      LEFT JOIN report_items ri ON ri.prospect_id = p.id
      GROUP BY p.id
      ORDER BY COALESCE(MAX(s.started_at), p.created_at) DESC
    `).all()
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/prospects/:id — single prospect with sessions + items + notes
router.get('/:id', (req, res) => {
  try {
    const prospect = db.prepare('SELECT * FROM prospects WHERE id = ?').get(req.params.id)
    if (!prospect) return res.status(404).json({ error: 'Prospect not found' })

    const sessions = db.prepare(`
      SELECT s.*,
        COUNT(ri.id) AS item_count,
        COUNT(n.id)  AS note_count
      FROM sessions s
      LEFT JOIN report_items ri ON ri.session_id = s.id
      LEFT JOIN notes n          ON n.session_id = s.id
      WHERE s.prospect_id = ?
      GROUP BY s.id
      ORDER BY s.started_at DESC
    `).all(req.params.id)

    const reportItems = db.prepare(`
      SELECT * FROM report_items WHERE prospect_id = ? ORDER BY created_at DESC
    `).all(req.params.id)

    const notes = db.prepare(`
      SELECT * FROM notes WHERE prospect_id = ? ORDER BY created_at DESC
    `).all(req.params.id)

    res.json({ ...prospect, sessions, reportItems, notes })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/prospects — create new prospect
router.post('/', (req, res) => {
  try {
    const { name, company, role, industry, current_tool, notes } = req.body
    if (!name?.trim() || !company?.trim()) {
      return res.status(400).json({ error: 'Name and company are required' })
    }
    const stmt = db.prepare(`
      INSERT INTO prospects (name, company, role, industry, current_tool, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    const result = stmt.run(
      name.trim(), company.trim(),
      role?.trim() || null,
      industry?.trim() || null,
      current_tool?.trim() || null,
      notes?.trim() || null
    )
    const prospect = db.prepare('SELECT * FROM prospects WHERE id = ?').get(result.lastInsertRowid)
    res.status(201).json(prospect)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/prospects/:id — update prospect
router.put('/:id', (req, res) => {
  try {
    const existing = db.prepare('SELECT id FROM prospects WHERE id = ?').get(req.params.id)
    if (!existing) return res.status(404).json({ error: 'Prospect not found' })

    const { name, company, role, industry, current_tool, notes } = req.body
    db.prepare(`
      UPDATE prospects
      SET name = ?, company = ?, role = ?, industry = ?, current_tool = ?, notes = ?,
          updated_at = datetime('now')
      WHERE id = ?
    `).run(
      name?.trim(), company?.trim(),
      role?.trim() || null,
      industry?.trim() || null,
      current_tool?.trim() || null,
      notes?.trim() || null,
      req.params.id
    )
    const prospect = db.prepare('SELECT * FROM prospects WHERE id = ?').get(req.params.id)
    res.json(prospect)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/prospects/:id
router.delete('/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM prospects WHERE id = ?').run(req.params.id)
    if (result.changes === 0) return res.status(404).json({ error: 'Prospect not found' })
    res.json({ deleted: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
