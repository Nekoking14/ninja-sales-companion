import { useState, useEffect, useRef } from 'react'
import { api } from '../api/index.js'
import QualificationForm from './QualificationForm.jsx'

const SPIN_SECTIONS = [
  { key: 'notesSituation',   label: 'S — Situation',   color: 'var(--blue)',  pts: 15, placeholder: 'What is their current state? What tools, team size, processes are in place today?' },
  { key: 'notesPain',        label: 'P — Pain',        color: 'var(--amber)', pts: 15, placeholder: 'What problems are they experiencing? What is frustrating or broken right now?' },
  { key: 'notesImplication', label: 'I — Implication', color: 'var(--red)',   pts: 20, placeholder: 'What happens if this stays unsolved? What is the cost, risk or impact of inaction?' },
]

export default function RightPanel({ prospect, session, callSeconds }) {
  const initials = prospect?.name
    ? prospect.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '??'

  const key = `qual_${session?.id || prospect?.id || 'draft'}`

  // ── Notes state ────────────────────────────────────────────────────────────
  const [notes, setNotes] = useState({
    notesSituation:   '',
    notesPain:        '',
    notesImplication: ''
  })
  const [notesOpen, setNotesOpen] = useState(true)

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key)) || {}
      setNotes({
        notesSituation:   saved.notesSituation   || '',
        notesPain:        saved.notesPain        || '',
        notesImplication: saved.notesImplication || '',
      })
    } catch {}
  }, [key])

  const noteDebounce = useRef(null)

  function handleNoteChange(field, val) {
    const updated = { ...notes, [field]: val }
    setNotes(updated)
    try {
      const saved = JSON.parse(localStorage.getItem(key)) || {}
      localStorage.setItem(key, JSON.stringify({ ...saved, ...updated }))
    } catch {}
    if (!session?.id) return
    clearTimeout(noteDebounce.current)
    noteDebounce.current = setTimeout(() => {
      api.sessions.saveQualification(session.id, updated).catch(() => {})
    }, 1000)
  }

  // Score indicators
  const pts = {
    notesSituation:   (notes.notesSituation   || '').trim().length > 5 ? 15 : 0,
    notesPain:        (notes.notesPain        || '').trim().length > 5 ? 15 : 0,
    notesImplication: (notes.notesImplication || '').trim().length > 5 ? 20 : 0,
  }
  const totalPts = Object.values(pts).reduce((a, b) => a + b, 0)

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
        flexShrink: 0
      }}>
        Qualification
      </div>

      {/* Qual form — scrollable */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        <QualificationForm session={session} prospect={prospect} />
      </div>

      {/* ── SPIN Notes — collapsible ── */}
      <div style={{
        flexShrink: 0,
        borderTop: '2px solid var(--brd)',
        background: 'var(--surf)',
        display: 'flex',
        flexDirection: 'column',
      }}>

        {/* Notes header — click to collapse/expand */}
        <button
          onClick={() => setNotesOpen(o => !o)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '9px 14px', background: 'none', border: 'none',
            cursor: 'pointer', width: '100%', flexShrink: 0,
            borderBottom: notesOpen ? '1px solid var(--brd)' : 'none',
          }}
        >
          <span style={{ fontSize: 12 }}>📝</span>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--txt3)', flex: 1, textAlign: 'left' }}>
            SPIN Notes
          </span>
          {/* Points earned indicator */}
          <span style={{
            fontSize: 10, fontWeight: 700,
            color: totalPts > 0 ? 'var(--green)' : 'var(--txt3)',
            background: totalPts > 0 ? 'var(--green2)' : 'var(--card2)',
            padding: '2px 7px', borderRadius: 99,
            transition: 'all 0.2s'
          }}>
            {totalPts}/50 pts
          </span>
          <span style={{ fontSize: 10, color: 'var(--txt3)', marginLeft: 4 }}>
            {notesOpen ? '▲' : '▼'}
          </span>
        </button>

        {/* Notes sections */}
        {notesOpen && (
          <div style={{ padding: '8px 12px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SPIN_SECTIONS.map(({ key: field, label, color, pts: maxPts, placeholder }) => {
              const earned  = pts[field]
              const hasText = (notes[field] || '').trim().length > 5
              return (
                <div key={field}>
                  {/* Section label + pts */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color }}>
                      {label}
                    </span>
                    <span style={{
                      fontSize: 9, fontWeight: 700,
                      color: hasText ? 'var(--green)' : 'var(--txt3)',
                      background: hasText ? 'var(--green2)' : 'var(--card2)',
                      padding: '1px 6px', borderRadius: 99, transition: 'all 0.2s'
                    }}>
                      {hasText ? `+${maxPts}` : `+${maxPts} pts`}
                    </span>
                  </div>
                  <textarea
                    value={notes[field] || ''}
                    onChange={e => handleNoteChange(field, e.target.value)}
                    placeholder={placeholder}
                    style={{
                      width: '100%', fontSize: 11.5, lineHeight: 1.6,
                      padding: '8px 10px', borderRadius: 8,
                      background: 'var(--card)',
                      border: `1px solid ${hasText ? color + '50' : 'var(--brd)'}`,
                      color: 'var(--txt)', resize: 'vertical',
                      minHeight: 60, fontFamily: 'inherit',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>

    </aside>
  )
}

function fmt(sec) {
  return String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0')
}
