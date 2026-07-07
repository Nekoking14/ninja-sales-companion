import { useState, useEffect, useRef } from 'react'

export default function ToolSelect ({ value, onChange, options, placeholder }) {
  const [open,   setOpen]   = useState(false)
  const [custom, setCustom] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    function handler (e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function pick (val) { onChange(val); setOpen(false); setCustom('') }

  function submitCustom () {
    if (custom.trim()) pick(custom.trim())
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left',
          background: 'var(--card2)', border: '1px solid var(--brd2)',
          borderRadius: 8, padding: '7px 10px',
          fontSize: 12, color: value ? 'var(--txt)' : 'var(--txt3)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value || placeholder || 'Select…'}
        </span>
        <span style={{ fontSize: 10, color: 'var(--txt3)', marginLeft: 6, flexShrink: 0 }}>▾</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'var(--card)', border: '1px solid var(--brd2)',
          borderRadius: 8, zIndex: 50, marginTop: 3,
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          maxHeight: 220, display: 'flex', flexDirection: 'column'
        }}>
          {/* Custom input */}
          <div style={{ padding: '7px 8px', borderBottom: '1px solid var(--brd)', flexShrink: 0 }}>
            <input
              autoFocus
              className="input"
              value={custom}
              onChange={e => setCustom(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') submitCustom(); if (e.key === 'Escape') setOpen(false) }}
              placeholder="Type a custom value…"
              style={{ fontSize: 12, padding: '6px 9px' }}
            />
          </div>
          {/* Preset list */}
          <div style={{ overflowY: 'auto' }}>
            {value && (
              <div
                onClick={() => pick('')}
                style={{ padding: '7px 12px', fontSize: 12, color: 'var(--txt3)', cursor: 'pointer', borderBottom: '1px solid var(--brd)', fontStyle: 'italic' }}
              >
                — Clear
              </div>
            )}
            {options.map(opt => (
              <div
                key={opt}
                onClick={() => pick(opt)}
                style={{
                  padding: '7px 12px', fontSize: 12, cursor: 'pointer',
                  background: value === opt ? 'var(--acc2)' : 'none',
                  color: value === opt ? 'var(--acc)' : 'var(--txt)',
                  fontWeight: value === opt ? 500 : 400
                }}
                onMouseEnter={e => { if (value !== opt) e.currentTarget.style.background = 'var(--card2)' }}
                onMouseLeave={e => { if (value !== opt) e.currentTarget.style.background = 'none' }}
              >
                {value === opt && <span style={{ marginRight: 6 }}>✓</span>}
                {opt}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
