import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const NAV = [
  { path: '/dashboard', label: 'Dashboard',        icon: '⊞' },
  { path: '/prospects', label: 'Sessions',          icon: '☰' },
  { path: '/edit',      label: 'Edit frameworks',   icon: '✎' },
]

export default function Sidebar ({ notes = [], onAddNote, onRemoveNote }) {
  const navigate      = useNavigate()
  const { pathname }  = useLocation()
  const [text, setText]   = useState('')
  const [saving, setSave] = useState(false)

  async function submit () {
    if (!text.trim() || !onAddNote) return
    setSave(true)
    try { await onAddNote(text.trim()); setText('') }
    finally { setSave(false) }
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

      {/* Navigation — compact */}
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

      {/* Notes — fills all remaining height */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '0 10px 0' }}>

        {/* Notes header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 8, flexShrink: 0
        }}>
          <span style={{
            fontSize: 10, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--txt3)'
          }}>Notes</span>
          {notes.length > 0 && (
            <span style={{
              background: 'var(--acc2)', color: 'var(--acc)',
              fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 999
            }}>{notes.length}</span>
          )}
        </div>

        {/* Notes list */}
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: 8 }}>
          {notes.length === 0 && (
            <div style={{
              fontSize: 12, color: 'var(--txt3)',
              textAlign: 'center', padding: '24px 8px', lineHeight: 1.6
            }}>
              Notes will appear here during the call
            </div>
          )}
          {notes.map(note => (
            <div key={note.id} style={{
              background: 'var(--card2)', border: '1px solid var(--brd)',
              borderRadius: 9, padding: '9px 11px', marginBottom: 7,
              position: 'relative', animation: 'fadeUp 0.18s ease'
            }}>
              <div style={{
                fontSize: 12, lineHeight: 1.5,
                color: 'var(--txt)', paddingRight: 18, marginBottom: 4
              }}>
                {note.content}
              </div>
              <div style={{ fontSize: 10, color: 'var(--txt3)' }}>
                {new Date(note.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </div>
              {onRemoveNote && (
                <button
                  onClick={() => onRemoveNote(note.id)}
                  style={{
                    position: 'absolute', top: 7, right: 8,
                    background: 'none', color: 'var(--txt3)',
                    fontSize: 15, padding: '0 2px', lineHeight: 1
                  }}
                >×</button>
              )}
            </div>
          ))}
        </div>

        {/* Add note */}
        {onAddNote && (
          <div style={{ flexShrink: 0, paddingBottom: 10 }}>
            <textarea
              className="input"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) submit() }}
              placeholder="Add note… (Ctrl+↵)"
              style={{ height: 70, fontSize: 12, padding: '9px 10px', marginBottom: 7, resize: 'none' }}
            />
            <button
              onClick={submit}
              disabled={!text.trim() || saving}
              style={{
                width: '100%', padding: '9px 0',
                background: text.trim() ? 'var(--acc2)' : 'var(--card2)',
                color: text.trim() ? 'var(--acc)' : 'var(--txt3)',
                border: `1px solid ${text.trim() ? 'var(--acc)' : 'var(--brd)'}`,
                borderRadius: 8, fontSize: 12, fontWeight: 500,
                cursor: text.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.12s'
              }}
            >
              {saving ? 'Saving…' : '+ Add note'}
            </button>
          </div>
        )}
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
