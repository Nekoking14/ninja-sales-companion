const router = require('express').Router()
const db     = require('../jsondb')

router.get('/', (_req, res) => {
  try { res.json(db.prospects.list()) }
  catch (e) { res.status(500).json({ error: e.message }) }
})

router.get('/:id', (req, res) => {
  try {
    const p = db.prospects.get(Number(req.params.id))
    if (!p) return res.status(404).json({ error: 'Not found' })
    res.json(p)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.post('/', (req, res) => {
  try {
    const { name, company } = req.body
    if (!name?.trim()) return res.status(400).json({ error: 'Name required' })
    res.status(201).json(db.prospects.create(req.body))
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.put('/:id', (req, res) => {
  try {
    const p = db.prospects.update(Number(req.params.id), req.body)
    if (!p) return res.status(404).json({ error: 'Not found' })
    res.json(p)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.delete('/:id', (req, res) => {
  try {
    if (!db.prospects.delete(Number(req.params.id)))
      return res.status(404).json({ error: 'Not found' })
    res.json({ deleted: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

module.exports = router
