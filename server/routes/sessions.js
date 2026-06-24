const router = require('express').Router()
const db     = require('../jsondb')

router.post('/', (req, res) => {
  try {
    const { prospect_id } = req.body
    if (!prospect_id) return res.status(400).json({ error: 'prospect_id required' })
    res.status(201).json(db.sessions.create(Number(prospect_id)))
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.get('/:id', (req, res) => {
  try {
    const s = db.sessions.get(Number(req.params.id))
    if (!s) return res.status(404).json({ error: 'Not found' })
    res.json(s)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.put('/:id/end', (req, res) => {
  try {
    const s = db.sessions.end(Number(req.params.id), req.body.duration_sec)
    if (!s) return res.status(404).json({ error: 'Not found' })
    res.json(s)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.put('/:id/qualification', (req, res) => {
  try {
    db.sessions.saveQual(Number(req.params.id), req.body.qualification_data)
    res.json({ saved: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

module.exports = router
