const express  = require('express')
const cors     = require('cors')
const path     = require('path')
const jsondb   = require('./jsondb')

const app    = express()
const PORT   = process.env.PORT   || 3001
const isDev  = process.env.NODE_ENV !== 'production'
const dbFile = process.env.DB_PATH || path.join(__dirname, '../data/companions.db')

// Initialise JSON database (no native modules needed)
jsondb.init(dbFile)

app.use(express.json())
app.use(cors({
  origin: isDev ? ['http://localhost:5173', 'http://127.0.0.1:5173'] : `http://localhost:${PORT}`,
  methods: ['GET','POST','PUT','DELETE']
}))

app.use('/api/prospects',    require('./routes/prospects'))
app.use('/api/sessions',     require('./routes/sessions'))
app.use('/api/report-items', require('./routes/report-items'))
app.use('/api/notes',        require('./routes/notes'))
app.use('/api/settings',     require('./routes/settings'))
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

if (!isDev) {
  const dist = path.join(__dirname, '../client/dist')
  app.use(express.static(dist))
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')))
}

app.use((err, _req, res, _next) => res.status(500).json({ error: err.message }))

app.listen(PORT, '0.0.0.0', () =>
  console.log(`NinjaOne Sales Companion server running on http://localhost:${PORT}`)
)

module.exports = app
