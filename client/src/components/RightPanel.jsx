import { useState, useEffect, useRef } from 'react'
import { api } from '../api/index.js'
import { useApp } from '../context/AppContext.jsx'
import QualificationForm from './QualificationForm.jsx'

const SPIN_SECTIONS = [
  { key: 'notesSituation', label: 'S — Situation', color: 'var(--blue)',  pts: 15, placeholder: 'What is their current state? What tools, team size, processes are in place today?' },
  { key: 'notesPain',      label: 'P — Pain',      color: 'var(--amber)', pts: 15, placeholder: 'What problems are they experiencing? What is frustrating or broken right now?' },
]

export default function RightPanel({ prospect, session, callSeconds }) {
  const { dispatch } = useApp()

  const initials = prospect?.name
    ? prospect.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '??'

  const key = `qual_${session?.id || prospect?.id || 'draft'}`

  // ── SPIN notes state ───────────────────────────────────────────────────────
  const [notes, setNotes] = useState({ notesSituation: '', notesPain: '' })
  const [notesOpen, setNotesOpen] = useState(true)

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key)) || {}
      const loaded = {
        notesSituation: saved.notesSituation || '',
        notesPain:      saved.notesPain      || '',
      }
      setNotes(loaded)
      dispatch({ type: 'SET_SPIN_NOTES', payload: loaded })
    } catch {}
  }, [key])

  const noteDebounce = useRef(null)

  function handleNoteChange(field, val) {
    const updated = { ...notes, [field]: val }
    setNotes(updated)
    dispatch({ type: 'SET_SPIN_NOTES', payload: updated })
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

  const pts = {
    notesSituation: (notes.notesSituation || '').trim().length > 0 ? 15 : 0,
    notesPain:      (notes.notesPain      || '').trim().length > 0 ? 15 : 0,
  }
  const totalPts = pts.notesSituation + pts.notesPain

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: 'var(--surf)',
    }}>

      {/* Prospect strip — spans full width */}
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

      {/* Main row: Qual form + SPIN notes */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Qualification form */}
        <div style={{ flex: '0 0 58%', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: '1px solid var(--brd)', minWidth: 0 }}>
          <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--brd)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--txt3)', flexShrink: 0 }}>
            Qualification
          </div>
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <QualificationForm session={session} prospect={prospect} />
          </div>
        </div>

        {/* SPIN notes — right column, 42% width */}
        <div style={{
          flex: '0 0 42%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: 'var(--surf)',
          minWidth: 0,
        }}>

          {/* Notes header */}
          <button
            onClick={() => setNotesOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 12px', background: 'none', border: 'none',
              borderBottom: '1px solid var(--brd)',
              cursor: 'pointer', width: '100%', flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 12 }}>📝</span>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--txt3)', flex: 1, textAlign: 'left' }}>
              SPIN Notes
            </span>
            <span style={{
              fontSize: 10, fontWeight: 700,
              color: totalPts > 0 ? 'var(--green)' : 'var(--txt3)',
              background: totalPts > 0 ? 'var(--green2)' : 'var(--card2)',
              padding: '2px 6px', borderRadius: 99, transition: 'all 0.2s'
            }}>
              {totalPts}/30
            </span>
            <span style={{ fontSize: 10, color: 'var(--txt3)', marginLeft: 4 }}>
              {notesOpen ? '▲' : '▼'}
            </span>
          </button>

          {/* Notes sections */}
          {notesOpen && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
              {SPIN_SECTIONS.map(({ key: field, label, color, pts: maxPts, placeholder }, idx) => {
                const hasText = (notes[field] || '').trim().length > 0
                return (
                  <div key={field} style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    padding: '10px 12px',
                    borderTop: idx > 0 ? '1px solid var(--brd)' : 'none',
                    minHeight: 0,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, flexShrink: 0 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color }}>{label}</span>
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
                        flex: 1, width: '100%', fontSize: 12, lineHeight: 1.6,
                        padding: '8px 10px', borderRadius: 8,
                        background: 'var(--card)',
                        border: `1px solid ${hasText ? color + '50' : 'var(--brd)'}`,
                        color: 'var(--txt)', resize: 'none',
                        fontFamily: 'inherit',
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

      </div>
    </div>
  )
}

function fmt(sec) {
  return String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0')
}
