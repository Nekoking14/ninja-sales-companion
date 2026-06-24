import { useState } from 'react'

export default function FrameworkModal ({ widget, onClose, onAddItem, addedIds }) {
  const [activeTab, setActiveTab] = useState(0)
  const { title, icon, color, tabs } = widget
  const currentTab = tabs[activeTab]

  // Handle both flat items and tabbed items
  const items = currentTab?.items ?? widget.items ?? []
  const tabLabel = currentTab?.label ?? title

  return (
    /* Overlay */
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(4, 6, 18, 0.82)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 200,
        animation: 'fadeUp 0.15s ease'
      }}
    >
      {/* Modal */}
      <div style={{
        width: 860, maxHeight: '85vh',
        background: '#0F1628',
        border: '1px solid var(--brd2)',
        borderRadius: 20,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.7)'
      }}>

        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--brd)',
          display: 'flex', alignItems: 'center', gap: 14
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: color + '20', color,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
          }}>
            {icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 2 }}>{title}</div>
            <div style={{ fontSize: 12, color: 'var(--txt2)' }}>
              Click any item to add it to the live report
            </div>
          </div>
          {addedIds?.size > 0 && (
            <span className="pill" style={{ background: color + '18', color }}>
              {addedIds.size} added to report
            </span>
          )}
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, background: 'var(--card2)',
              borderRadius: 8, color: 'var(--txt2)', fontSize: 18
            }}
          >×</button>
        </div>

        {/* Tabs (if multi-tab widget) */}
        {tabs && tabs.length > 1 && (
          <div style={{ display: 'flex', borderBottom: '1px solid var(--brd)', padding: '0 24px' }}>
            {tabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                style={{
                  padding: '12px 18px',
                  fontSize: 13,
                  fontWeight: activeTab === i ? 600 : 400,
                  color: activeTab === i ? 'var(--txt)' : 'var(--txt2)',
                  borderBottom: activeTab === i ? `2px solid ${color}` : '2px solid transparent',
                  marginBottom: -1,
                  background: 'none',
                  transition: 'color 0.12s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {currentTab?.description && (
            <div style={{
              fontSize: 12, color: 'var(--txt2)', lineHeight: 1.6,
              marginBottom: 16, padding: '10px 14px',
              background: 'var(--card)', borderRadius: 9,
              borderLeft: `3px solid ${color}`
            }}>
              {currentTab.description}
            </div>
          )}

          {items.map((item, i) => {
            const itemId = `${widget.id}|${activeTab}|${i}`
            const isAdded = addedIds?.has(itemId)

            // Battlecard style (object with pain/question/value)
            if (typeof item === 'object' && item.pain) {
              return (
                <div
                  key={i}
                  style={{
                    background: isAdded ? '#0E1D2E' : 'var(--card)',
                    border: `1px solid ${isAdded ? color + '40' : 'var(--brd)'}`,
                    borderRadius: 11, padding: '14px 16px', marginBottom: 8
                  }}
                >
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Pain</div>
                      <div style={{ fontSize: 12, color: 'var(--txt)', marginBottom: 8 }}>{item.pain}</div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Ask</div>
                      <div style={{ fontSize: 12, color: 'var(--txt2)', marginBottom: 8, fontStyle: 'italic' }}>{item.question}</div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>NinjaOne value</div>
                      <div style={{ fontSize: 12, color: 'var(--txt2)' }}>{item.value}</div>
                    </div>
                    <button
                      onClick={() => onAddItem(itemId, item, tabLabel)}
                      style={{
                        flexShrink: 0, padding: '7px 14px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                        background: isAdded ? color + '20' : 'var(--card2)',
                        color: isAdded ? color : 'var(--txt2)',
                        border: `1px solid ${isAdded ? color + '40' : 'var(--brd)'}`,
                        alignSelf: 'flex-start'
                      }}
                    >
                      {isAdded ? '✓ Added' : '+ Add'}
                    </button>
                  </div>
                </div>
              )
            }

            // AAPA style (object with A1/A2/P/Q)
            if (typeof item === 'object' && item.A1) {
              return (
                <div
                  key={i}
                  style={{
                    background: isAdded ? '#0E1D2E' : 'var(--card)',
                    border: `1px solid ${isAdded ? color + '40' : 'var(--brd)'}`,
                    borderRadius: 11, padding: '14px 16px', marginBottom: 8
                  }}
                >
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color, marginBottom: 10 }}>{item.scenario}</div>
                      {[
                        { l: 'A', t: item.A1, bg: 'var(--purple2)', c: 'var(--purple)' },
                        { l: 'A', t: item.A2, bg: 'var(--blue2)',   c: 'var(--blue)' },
                        { l: 'P', t: item.P,  bg: 'var(--amber2)',  c: 'var(--amber)' },
                        { l: 'A', t: item.Q,  bg: 'var(--green2)',  c: 'var(--green)' }
                      ].map(({ l, t, bg, c }, j) => (
                        <div key={j} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
                          <span style={{
                            width: 20, height: 20, background: bg, color: c,
                            borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 1
                          }}>{l}</span>
                          <span style={{ fontSize: 12, color: 'var(--txt2)', lineHeight: 1.45 }}>{t}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => onAddItem(itemId, item, tabLabel)}
                      style={{
                        flexShrink: 0, padding: '7px 14px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                        background: isAdded ? color + '20' : 'var(--card2)',
                        color: isAdded ? color : 'var(--txt2)',
                        border: `1px solid ${isAdded ? color + '40' : 'var(--brd)'}`,
                        alignSelf: 'flex-start'
                      }}
                    >
                      {isAdded ? '✓ Added' : '+ Add'}
                    </button>
                  </div>
                </div>
              )
            }

            // Simple string item
            const text = typeof item === 'string' ? item : item.text || ''
            return (
              <div
                key={i}
                style={{
                  background: isAdded ? '#0E1D2E' : 'var(--card)',
                  border: `1px solid ${isAdded ? color + '40' : 'var(--brd)'}`,
                  borderRadius: 11, padding: '13px 16px', marginBottom: 8,
                  display: 'flex', alignItems: 'center', gap: 12
                }}
              >
                <div style={{ flex: 1, fontSize: 13, lineHeight: 1.5 }}>{text}</div>
                <button
                  onClick={() => onAddItem(itemId, { text }, tabLabel)}
                  style={{
                    flexShrink: 0, padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                    background: isAdded ? color + '20' : 'var(--card2)',
                    color: isAdded ? color : 'var(--txt2)',
                    border: `1px solid ${isAdded ? color + '40' : 'var(--brd)'}`,
                  }}
                >
                  {isAdded ? '✓ Added' : '+ Add'}
                </button>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div style={{
          padding: '13px 24px',
          borderTop: '1px solid var(--brd)',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          background: '#0C1120'
        }}>
          <button onClick={onClose} className="btn btn-ghost">Close</button>
        </div>

      </div>
    </div>
  )
}
