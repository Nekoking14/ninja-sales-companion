const router = require('express').Router()
const db     = require('../jsondb')

router.post('/', (req, res) => {
  try {
    const { session_id, prospect_id, content } = req.body
    if (!session_id || !prospect_id || !content?.trim())
      return res.status(400).json({ error: 'Missing required fields' })
    res.status(201).json(db.notes.create(req.body))
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.delete('/:id', (req, res) => {
  try {
    if (!db.notes.delete(Number(req.params.id)))
      return res.status(404).json({ error: 'Not found' })
    res.json({ deleted: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

module.exports = router
