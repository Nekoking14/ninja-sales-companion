const router = require('express').Router()
const db     = require('../jsondb')

router.get('/', (req, res) => {
  try { res.json(db.settings.list(req.query.prefix)) }
  catch (e) { res.status(500).json({ error: e.message }) }
})

router.get('/:key', (req, res) => {
  try { res.json({ value: db.settings.get(req.params.key) }) }
  catch (e) { res.status(500).json({ error: e.message }) }
})

router.put('/:key', (req, res) => {
  try { db.settings.upsert(req.params.key, req.body.value); res.json({ saved: true }) }
  catch (e) { res.status(500).json({ error: e.message }) }
})

router.delete('/:key', (req, res) => {
  try { db.settings.delete(req.params.key); res.json({ deleted: true }) }
  catch (e) { res.status(500).json({ error: e.message }) }
})

module.exports = router
