import { useState, useEffect, useRef } from 'react'
import { api } from '../api/index.js'
import QualificationForm from './QualificationForm.jsx'

export default function RightPanel({ prospect, session, callSeconds }) {
  const initials = prospect?.name
    ? prospect.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '??'

  const key = `qual_${session?.id || prospect?.id || 'draft'}`

  // ── Notes state ────────────────────────────────────────────────────────────
  const [notes, setNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key))?.notes || '' } catch { return '' }
  })

  useEffect(() => {
    try { setNotes(JSON.parse(localStorage.getItem(key))?.notes || '') } catch { setNotes('') }
  }, [key])

  const noteDebounce = useRef(null)
  function handleNotesChange(val) {
    setNotes(val)
    try {
      const saved = JSON.parse(localStorage.getItem(key)) || {}
      localStorage.setItem(key, JSON.stringify({ ...saved, notes: val }))
    } catch {}
    if (!session?.id) return
    clearTimeout(noteDebounce.current)
    noteDebounce.current = setTimeout(() => {
      api.sessions.saveQualification(session.id, { notes: val }).catch(() => {})
    }, 1000)
  }

  return (
    <aside style={{
      width: 'var(--panel-w)',
      background: 'var(--surf)',
      borderLeft: '1px solid var(--brd)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      overflow: 'hidden',
    }}>

      {/* Prospect strip */}
      <div style={{
        padding: '10px 16px', borderBottom: '1px solid var(--brd)',
        display: 'flex', alignItems: 'center', gap: 10,
        flexShrink: 0, background: 'var(--card2)'
      }}>
        <div style={{
          width: 32, height: 32,
          background: 'linear-gradient(135deg,#05C49A,#0891B2)',
          borderRadius: 8, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 12, fontWeight: 700,
          color: '#fff', flexShrink: 0
        }}>{initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {prospect?.name}
          </div>
          <div style={{ fontSize: 11, color: 'var(--txt2)' }}>{prospect?.company}</div>
        </div>
        {session && (
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
            {fmt(callSeconds)}
          </div>
        )}
      </div>

      {/* Qualification label */}
      <div style={{
        padding: '9px 16px', borderBottom: '1px solid var(--brd)',
        fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.08em', color: 'var(--txt3)',
        flexShrink: 0, background: 'var(--surf)'
      }}>
        Qualification
      </div>

      {/* Qual form — scrollable, takes all remaining space */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        <QualificationForm session={session} prospect={prospect} />
      </div>

      {/* Notes — always visible, pinned to bottom */}
      <div style={{
        flexShrink: 0,
        height: 200,
        borderTop: '2px solid var(--brd)',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--surf)',
      }}>
        <div style={{
          padding: '7px 14px 4px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--txt3)' }}>
            📝 Notes
          </span>
          {notes.length > 0 && (
            <span style={{ fontSize: 10, color: 'var(--txt3)' }}>{notes.length} chars</span>
          )}
        </div>
        <textarea
          className="input"
          value={notes}
          onChange={e => handleNotesChange(e.target.value)}
          placeholder="Pain points, objections, contract dates, follow-up flags…"
          style={{
            flex: 1,
            margin: '0 12px 10px',
            resize: 'none',
            fontSize: 12,
            lineHeight: 1.65,
            padding: '9px 11px',
            overflowY: 'auto',
          }}
        />
      </div>

    </aside>
  )
}

function fmt(sec) {
  return String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0')
}
