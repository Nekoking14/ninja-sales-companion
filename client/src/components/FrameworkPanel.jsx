import { useState } from 'react'
import { FRAMEWORKS } from '../data/frameworks.js'

const AAPA = FRAMEWORKS.find(f => f.id === 'aapa')

export default function FrameworkPanel ({ widget, onAddItem, addedIds, defaultTab = 0 }) {
  const isOpener = widget.id === 'opener'

  // For opener: which mode — 'scripts' or 'objections'
  const [mode, setMode] = useState('scripts')

  // Tab index — resets when mode changes
  const [activeTab, setActiveTab] = useState(defaultTab)

  function switchMode (m) {
    setMode(m)
    setActiveTab(0)
  }

  // Which dataset to render
  const display      = isOpener && mode === 'objections' ? AAPA : widget
  const tabs         = display?.tabs
  const currentTab   = tabs?.[activeTab]
  const currentItems = currentTab?.items ?? display?.items ?? []
  const tabLabel     = currentTab?.label ?? display?.title ?? ''
  const color        = isOpener && mode === 'objections' ? AAPA.color : widget.color

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg)' }}>

      {/* Header */}
      <div style={{
        padding: '14px 22px',
        borderBottom: '1px solid var(--brd)',
        display: 'flex', alignItems: 'center', gap: 12,
        flexShrink: 0, background: 'var(--surf)'
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9,
          background: widget.color + '20', color: widget.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 17, flexShrink: 0
        }}>
          {widget.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{widget.title}</div>
          <div style={{ fontSize: 11, color: 'var(--txt2)', marginTop: 1 }}>
            Click any item to add it to the session log
          </div>
        </div>
        {addedIds?.size > 0 && (
          <span style={{
            fontSize: 11, fontWeight: 600,
            background: widget.color + '18', color: widget.color,
            padding: '3px 10px', borderRadius: 999
          }}>
            {[...addedIds].filter(id => id.startsWith(widget.id + '|')).length} added
          </span>
        )}
      </div>

      {/* Dual-mode navbar — opener only */}
      {isOpener && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 22px',
          borderBottom: '1px solid var(--brd)',
          background: 'var(--surf)',
          flexShrink: 0
        }}>
          <ModeBtn label="Opener scripts"   active={mode === 'scripts'}    color={widget.color} onClick={() => switchMode('scripts')} />
          <ModeBtn label="Objection handler" active={mode === 'objections'} color={AAPA.color}   onClick={() => switchMode('objections')} />
        </div>
      )}

      {/* Tabs */}
      {tabs && tabs.length > 1 && (
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--brd)',
          padding: '0 22px',
          background: 'var(--surf)',
          flexShrink: 0,
          overflowX: 'auto'
        }}>
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              style={{
                padding: '10px 16px',
                fontSize: 13,
                fontWeight: activeTab === i ? 500 : 400,
                color: activeTab === i ? 'var(--txt)' : 'var(--txt2)',
                borderBottom: activeTab === i ? `2px solid ${color}` : '2px solid transparent',
                marginBottom: -1,
                background: 'none',
                whiteSpace: 'nowrap',
                transition: 'color 0.12s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 22px' }}>

        {currentTab?.description && (
          <div style={{
            fontSize: 12, color: 'var(--txt2)', lineHeight: 1.6,
            marginBottom: 14, padding: '10px 14px',
            background: 'var(--card)', borderRadius: 9,
            borderLeft: `3px solid ${color}`
          }}>
            {currentTab.description}
          </div>
        )}

        {currentItems.map((item, i) => {
          const itemId  = `${widget.id}|${mode}|${activeTab}|${i}`
          const isAdded = addedIds?.has(itemId)

          // ── Battlecard ───────────────────────────────────────────────
          if (typeof item === 'object' && item.pain) {
            return (
              <div key={i} style={{
                background: isAdded ? '#0E1D2E' : 'var(--card)',
                border: `1px solid ${isAdded ? color + '40' : 'var(--brd)'}`,
                borderRadius: 11, padding: '14px 16px', marginBottom: 10
              }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <Row label="Pain"           labelColor="var(--red)"   text={item.pain} />
                    <Row label="Ask"            labelColor="var(--amber)" text={item.question} italic />
                    <Row label="NinjaOne value" labelColor="var(--green)" text={item.value} last />
                  </div>
                  <AddBtn isAdded={isAdded} color={color} onClick={() => onAddItem(itemId, item, tabLabel)} />
                </div>
              </div>
            )
          }

          // ── AAPA ─────────────────────────────────────────────────────
          if (typeof item === 'object' && item.A1) {
            return (
              <div key={i} style={{
                background: isAdded ? '#0E1D2E' : 'var(--card)',
                border: `1px solid ${isAdded ? color + '40' : 'var(--brd)'}`,
                borderRadius: 11, padding: '14px 16px', marginBottom: 10
              }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color, marginBottom: 10 }}>{item.scenario}</div>
                    {[
                      { l: 'A', t: item.A1, bg: 'var(--purple2)', c: 'var(--purple)' },
                      { l: 'A', t: item.A2, bg: 'var(--blue2)',   c: 'var(--blue)'   },
                      { l: 'P', t: item.P,  bg: 'var(--amber2)',  c: 'var(--amber)'  },
                      { l: 'A', t: item.Q,  bg: 'var(--green2)',  c: 'var(--green)'  }
                    ].map(({ l, t, bg, c }, j) => (
                      <div key={j} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 7 }}>
                        <span style={{
                          width: 20, height: 20, background: bg, color: c,
                          borderRadius: 4, display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: 10, fontWeight: 700,
                          flexShrink: 0, marginTop: 1
                        }}>{l}</span>
                        <span style={{ fontSize: 12, color: 'var(--txt2)', lineHeight: 1.5 }}>{t}</span>
                      </div>
                    ))}
                  </div>
                  <AddBtn isAdded={isAdded} color={color} onClick={() => onAddItem(itemId, item, tabLabel)} />
                </div>
              </div>
            )
          }

          // ── Simple string ────────────────────────────────────────────
          const text = typeof item === 'string' ? item : item.text || ''
          return (
            <div key={i} style={{
              background: isAdded ? '#0E1D2E' : 'var(--card)',
              border: `1px solid ${isAdded ? color + '40' : 'var(--brd)'}`,
              borderRadius: 11, padding: '12px 16px', marginBottom: 8,
              display: 'flex', alignItems: 'center', gap: 12
            }}>
              <div style={{ flex: 1, fontSize: 13, lineHeight: 1.55 }}>{text}</div>
              <AddBtn isAdded={isAdded} color={color} onClick={() => onAddItem(itemId, { text }, tabLabel)} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function ModeBtn ({ label, active, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 14px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: active ? 600 : 400,
        background: active ? color + '20' : 'var(--card2)',
        color: active ? color : 'var(--txt2)',
        border: `1px solid ${active ? color + '60' : 'var(--brd)'}`,
        transition: 'all 0.12s'
      }}
    >
      {label}
    </button>
  )
}

function AddBtn ({ isAdded, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0, padding: '7px 14px', borderRadius: 8,
        fontSize: 11, fontWeight: 600,
        background: isAdded ? color + '20' : 'var(--card2)',
        color: isAdded ? color : 'var(--txt2)',
        border: `1px solid ${isAdded ? color + '40' : 'var(--brd)'}`,
        alignSelf: 'flex-start', transition: 'all 0.12s'
      }}
    >
      {isAdded ? '✓ Added' : '+ Add'}
    </button>
  )
}

function Row ({ label, labelColor, text, italic, last }) {
  return (
    <div style={{ marginBottom: last ? 0 : 8 }}>
      <div style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: labelColor, marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ fontSize: 12, color: 'var(--txt2)', lineHeight: 1.4, fontStyle: italic ? 'italic' : 'normal' }}>
        {text}
      </div>
    </div>
  )
}
