import { useState, useEffect, useRef } from 'react'

export default function MultiSelect ({ value = [], onChange, options, placeholder, color = 'var(--acc)' }) {
  const [open,   setOpen]   = useState(false)
  const [custom, setCustom] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    function handler (e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function toggle (opt) {
    onChange(value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt])
  }

  function addCustom () {
    const v = custom.trim()
    if (v && !value.includes(v)) { onChange([...value, v]) }
    setCustom('')
  }

  function remove (opt) { onChange(value.filter(v => v !== opt)) }

  return (
    <div ref={ref}>
      {/* Selected tags */}
      {value.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 7 }}>
          {value.map(v => (
            <span key={v} style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: color + '18', color, border: `1px solid ${color}40`,
              borderRadius: 999, padding: '3px 9px', fontSize: 11, fontWeight: 500
            }}>
              {v}
              <button
                type="button"
                onClick={() => remove(v)}
                style={{ background: 'none', color, fontSize: 13, padding: 0, lineHeight: 1, cursor: 'pointer' }}
              >×</button>
            </span>
          ))}
        </div>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'var(--card2)', border: '1px solid var(--brd2)',
          borderRadius: 8, padding: '7px 10px',
          fontSize: 12, color: 'var(--txt2)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6
        }}
      >
        <span style={{ fontSize: 13 }}>+</span>
        {value.length === 0 ? (placeholder || 'Select options…') : 'Add more'}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute',
          background: 'var(--card)', border: '1px solid var(--brd2)',
          borderRadius: 8, zIndex: 50, marginTop: 3,
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          maxHeight: 260, display: 'flex', flexDirection: 'column',
          width: 'calc(100% - 20px)', left: 10
        }}>
          {/* Custom input */}
          <div style={{ padding: '7px 8px', borderBottom: '1px solid var(--brd)', flexShrink: 0 }}>
            <input
              autoFocus
              className="input"
              value={custom}
              onChange={e => setCustom(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { addCustom(); } if (e.key === 'Escape') setOpen(false) }}
              placeholder="Type a custom option + Enter…"
              style={{ fontSize: 12, padding: '6px 9px' }}
            />
          </div>
          {/* Options list */}
          <div style={{ overflowY: 'auto' }}>
            {options.map(opt => {
              const selected = value.includes(opt)
              return (
                <div
                  key={opt}
                  onClick={() => toggle(opt)}
                  style={{
                    padding: '8px 12px', fontSize: 12, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: selected ? color + '12' : 'none',
                    color: selected ? color : 'var(--txt)'
                  }}
                  onMouseEnter={e => { if (!selected) e.currentTarget.style.background = 'var(--card2)' }}
                  onMouseLeave={e => { if (!selected) e.currentTarget.style.background = 'none' }}
                >
                  <div style={{
                    width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                    border: `1.5px solid ${selected ? color : 'var(--brd2)'}`,
                    background: selected ? color : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {selected && <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>✓</span>}
                  </div>
                  {opt}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
