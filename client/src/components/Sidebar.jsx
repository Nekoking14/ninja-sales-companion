import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { api } from '../api/index.js'

const NAV = [
  { path: '/dashboard', label: 'Dashboard',       icon: '⊞' },
  { path: '/prospects', label: 'Sessions',         icon: '☰' },
  { path: '/edit',      label: 'Edit frameworks',  icon: '✎' },
]

export default function Sidebar ({ session, prospect }) {
  const navigate      = useNavigate()
  const { pathname }  = useLocation()
  const storageKey    = `qual_${session?.id || prospect?.id || 'draft'}`

  const [notes, setNotes] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey))
      return saved?.notes || ''
    } catch { return '' }
  })

  // Reload when session changes
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey))
      setNotes(saved?.notes || '')
    } catch { setNotes('') }
  }, [storageKey])

  // Debounce save to DB
  const debounce = useRef(null)

  function handleNotesChange (val) {
    setNotes(val)
    // Merge notes into existing qual localStorage data
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey)) || {}
      localStorage.setItem(storageKey, JSON.stringify({ ...saved, notes: val }))
    } catch {}
    // Debounce DB save
    if (!session?.id) return
    clearTimeout(debounce.current)
    debounce.current = setTimeout(() => {
      api.sessions.saveQualification(session.id, { notes: val }).catch(() => {})
    }, 1000)
  }

  return (
    <nav style={{
      width: 'var(--side-w)',
      background: 'var(--surf)',
      borderRight: '1px solid var(--brd)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      overflow: 'hidden'
    }}>

      {/* Navigation */}
      <div style={{ padding: '8px 8px 0', flexShrink: 0 }}>
        {NAV.map(({ path, label, icon }) => {
          const active = pathname === path
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '6px 10px', borderRadius: 8, width: '100%',
                background: active ? 'var(--acc2)' : 'none',
                color: active ? 'var(--acc)' : 'var(--txt2)',
                fontSize: 12, fontWeight: active ? 500 : 400,
                textAlign: 'left', marginBottom: 1,
                transition: 'background 0.12s, color 0.12s'
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--card2)'; e.currentTarget.style.color = 'var(--txt)' } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--txt2)' } }}
            >
              <span style={{ fontSize: 13, width: 16, textAlign: 'center' }}>{icon}</span>
              {label}
            </button>
          )
        })}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--brd)', margin: '6px 10px', flexShrink: 0 }} />

      {/* Notes — fills remaining height */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '0 10px 10px' }}>
        <div style={{
          fontSize: 10, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.09em',
          color: 'var(--txt3)', marginBottom: 8, flexShrink: 0
        }}>
          Notes
        </div>

        <textarea
          className="input"
          value={notes}
          onChange={e => handleNotesChange(e.target.value)}
          placeholder="Pain points, contract dates, follow-up flags…"
          style={{
            flex: 1,
            resize: 'none',
            fontSize: 12,
            lineHeight: 1.6,
            padding: '10px 11px'
          }}
        />
      </div>

      {/* Settings */}
      <div style={{ padding: '6px 8px 10px', borderTop: '1px solid var(--brd)', flexShrink: 0 }}>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 7, padding: '6px 10px',
          borderRadius: 8, background: 'none', color: 'var(--txt3)',
          fontSize: 11, width: '100%', textAlign: 'left'
        }}>
          <span style={{ fontSize: 12 }}>⚙</span> Settings
        </button>
      </div>
    </nav>
  )
}
