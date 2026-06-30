import { useState } from 'react'
import { FRAMEWORKS } from '../data/frameworks.js'

const AAPA = FRAMEWORKS.find(f => f.id === 'aapa')

// ── Customisation helpers (localStorage) ─────────────────────────────────────
function loadCustom (widgetId) {
  try { return JSON.parse(localStorage.getItem(`fw_custom_${widgetId}`)) || {} }
  catch { return {} }
}
function saveCustom (widgetId, data) {
  localStorage.setItem(`fw_custom_${widgetId}`, JSON.stringify(data))
}

export default function FrameworkPanel ({ widget, onAddItem, addedIds, defaultTab = 0 }) {
  const isOpener = widget.id === 'opener'
  const [mode,       setMode]      = useState('scripts')
  const [activeTab,  setActiveTab] = useState(defaultTab)
  const [editMode,   setEditMode]  = useState(false)
  const [newItemText, setNew]      = useState('')
  const [fontScale,  setFontScale] = useState(() => {
    const s = localStorage.getItem('fw_font_scale')
    return s ? Number(s) : 1
  })

  function changeScale (delta) {
    setFontScale(prev => {
      const next = Math.min(1.5, Math.max(0.75, +(prev + delta).toFixed(2)))
      localStorage.setItem('fw_font_scale', String(next))
      return next
    })
  }
  const [custom,     setCustom]    = useState(() => loadCustom(widget.id))

  function switchMode (m) { setMode(m); setActiveTab(0) }

  const tabKey     = `${isOpener ? mode : 'default'}_${activeTab}`
  const tabCustom  = custom[tabKey] || { deleted: [], added: [] }
  const deletedSet = new Set(tabCustom.deleted)

  function persistCustom (updated) {
    setCustom(updated)
    saveCustom(widget.id, updated)
  }

  function deleteBuiltIn (itemKey) {
    persistCustom({ ...custom, [tabKey]: { ...tabCustom, deleted: [...deletedSet, itemKey] } })
  }

  function addCustomItem () {
    if (!newItemText.trim()) return
    const item = { id: `c_${Date.now()}`, text: newItemText.trim() }
    persistCustom({ ...custom, [tabKey]: { ...tabCustom, added: [...tabCustom.added, item] } })
    setNew('')
  }

  function deleteCustomItem (id) {
    persistCustom({ ...custom, [tabKey]: { ...tabCustom, added: tabCustom.added.filter(i => i.id !== id) } })
  }

  const display       = isOpener && mode === 'objections' ? AAPA : widget
  const tabs          = display?.tabs
  const currentTab    = tabs?.[activeTab]
  const currentItems  = currentTab?.items ?? display?.items ?? []
  const tabLabel      = currentTab?.label ?? display?.title ?? ''
  const color         = isOpener && mode === 'objections' ? AAPA.color : widget.color

  const hasEdits = tabCustom.deleted.length > 0 || tabCustom.added.length > 0

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg)' }}>

      {/* Header */}
      <div style={{ padding: '14px 22px', borderBottom: '1px solid var(--brd)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, background: 'var(--surf)' }}>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: widget.color + '20', color: widget.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>
          {widget.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{widget.title}</div>
          <div style={{ fontSize: 11, color: 'var(--txt2)', marginTop: 1 }}>
            {editMode ? 'Edit mode — add or remove items' : 'Click any item to add to session log'}
          </div>
        </div>

        {/* Edit / Done toggle */}
        <button
          onClick={() => { setEditMode(e => !e); setNew('') }}
          style={{
            padding: '5px 14px', borderRadius: 20, fontSize: 12,
            fontWeight: editMode ? 600 : 400,
            background: editMode ? 'var(--acc2)' : 'var(--card2)',
            color: editMode ? 'var(--acc)' : 'var(--txt2)',
            border: `1px solid ${editMode ? 'var(--acc)' : 'var(--brd)'}`,
            transition: 'all 0.12s'
          }}
        >
          {editMode ? '✓ Done' : '✏ Edit'}
        </button>

        {/* Font scale control */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'var(--card2)', border: '1px solid var(--brd)', borderRadius: 8, padding: '3px 6px' }}>
          <button onClick={() => changeScale(-0.1)} style={{ background: 'none', color: 'var(--txt2)', fontSize: 13, padding: '0 3px', cursor: 'pointer', lineHeight: 1 }} title="Smaller text">A−</button>
          <span style={{ fontSize: 10, color: 'var(--txt3)', minWidth: 28, textAlign: 'center' }}>{Math.round(fontScale * 100)}%</span>
          <button onClick={() => changeScale(+0.1)} style={{ background: 'none', color: 'var(--txt2)', fontSize: 16, padding: '0 3px', cursor: 'pointer', lineHeight: 1 }} title="Larger text">A+</button>
        </div>

        {hasEdits && !editMode && (
          <span style={{ fontSize: 10, color: 'var(--acc)', fontWeight: 600, background: 'var(--acc2)', padding: '2px 7px', borderRadius: 999 }}>
            Modified
          </span>
        )}
      </div>

      {/* Dual-mode navbar — opener only */}
      {isOpener && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 22px', borderBottom: '1px solid var(--brd)', background: 'var(--surf)', flexShrink: 0 }}>
          <ModeBtn label="Opener scripts"    active={mode === 'scripts'}    color={widget.color} onClick={() => switchMode('scripts')} />
          <ModeBtn label="Objection handler" active={mode === 'objections'} color={AAPA.color}   onClick={() => switchMode('objections')} />
        </div>
      )}

      {/* Tabs */}
      {tabs && tabs.length > 1 && (
        <div style={{ display: 'flex', borderBottom: '1px solid var(--brd)', padding: '0 22px', background: 'var(--surf)', flexShrink: 0, overflowX: 'auto' }}>
          {tabs.map((tab, i) => (
            <button key={i} onClick={() => setActiveTab(i)} style={{
              padding: '10px 16px', fontSize: 13,
              fontWeight: activeTab === i ? 500 : 400,
              color: activeTab === i ? 'var(--txt)' : 'var(--txt2)',
              borderBottom: activeTab === i ? `2px solid ${color}` : '2px solid transparent',
              marginBottom: -1, background: 'none', whiteSpace: 'nowrap', transition: 'color 0.12s'
            }}>
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Items */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 22px' }}>

        {currentTab?.description && !editMode && (
          <div style={{ fontSize: 12, color: 'var(--txt2)', lineHeight: 1.6, marginBottom: 14, padding: '10px 14px', background: 'var(--card)', borderRadius: 9, borderLeft: `3px solid ${color}` }}>
            {currentTab.description}
          </div>
        )}

        {/* Built-in items */}
        {currentItems.map((item, i) => {
          const itemId  = `${widget.id}|${mode}|${activeTab}|${i}`
          const isAdded = addedIds?.has(itemId)
          const isDel   = deletedSet.has(itemId)
          if (isDel && !editMode) return null

          if (typeof item === 'object' && item.pain) {
            return (
              <div key={i} style={{ background: isDel ? 'transparent' : 'var(--card)', border: `1px solid ${isDel ? 'var(--red)' : 'var(--brd)'}`, borderRadius: 11, padding: '14px 16px', marginBottom: 10, opacity: isDel ? 0.4 : 1, position: 'relative' }}>
                {editMode && (
                  <button onClick={() => isDel ? null : deleteBuiltIn(itemId)} style={{ position: 'absolute', top: 10, right: 10, background: isDel ? 'var(--green2)' : 'var(--red2)', color: isDel ? 'var(--green)' : 'var(--red)', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, padding: '3px 8px', cursor: 'pointer' }}>
                    {isDel ? 'Restore' : '✕ Remove'}
                  </button>
                )}
                <div style={{ flex: 1, paddingRight: editMode ? 80 : 0 }}>
                  <Row label="Pain"           labelColor="var(--red)"   text={item.pain} />
                  <Row label="Ask"            labelColor="var(--amber)" text={item.question} italic />
                  <Row label="NinjaOne value" labelColor="var(--green)" text={item.value} last />
                </div>
              </div>
            )
          }

          if (typeof item === 'object' && item.risk) {
            return (
              <div key={i} style={{ background: isDel ? 'transparent' : 'var(--card)', border: `1px solid ${isDel ? 'var(--red)' : 'var(--brd)'}`, borderRadius: 11, padding: '14px 16px', marginBottom: 10, opacity: isDel ? 0.4 : 1, position: 'relative' }}>
                {editMode && (
                  <button onClick={() => isDel ? null : deleteBuiltIn(itemId)} style={{ position: 'absolute', top: 10, right: 10, background: isDel ? 'var(--green2)' : 'var(--red2)', color: isDel ? 'var(--green)' : 'var(--red)', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, padding: '3px 8px', cursor: 'pointer' }}>
                    {isDel ? 'Restore' : '✕ Remove'}
                  </button>
                )}
                <div style={{ flex: 1, paddingRight: editMode ? 80 : 0 }}>
                  <Row label="Opening question" labelColor={color}          text={item.question} italic />
                  <Row label="Risk"              labelColor="var(--red)"    text={item.risk} />
                  <Row label="NinjaOne"          labelColor="var(--green)"  text={item.value} last />
                </div>
              </div>
            )
          }

          if (typeof item === 'object' && item.A1) {
            return (
              <div key={i} style={{ background: isDel ? 'transparent' : 'var(--card)', border: `1px solid ${isDel ? 'var(--red)' : 'var(--brd)'}`, borderRadius: 11, padding: '14px 16px', marginBottom: 10, opacity: isDel ? 0.4 : 1, position: 'relative' }}>
                {editMode && (
                  <button onClick={() => deleteBuiltIn(itemId)} style={{ position: 'absolute', top: 10, right: 10, background: isDel ? 'var(--green2)' : 'var(--red2)', color: isDel ? 'var(--green)' : 'var(--red)', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, padding: '3px 8px', cursor: 'pointer' }}>
                    {isDel ? 'Restore' : '✕ Remove'}
                  </button>
                )}
                <div style={{ paddingRight: editMode ? 80 : 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color, marginBottom: 10 }}>{item.scenario}</div>
                  {[{l:'A',t:item.A1,bg:'var(--purple2)',c:'var(--purple)'},{l:'A',t:item.A2,bg:'var(--blue2)',c:'var(--blue)'},{l:'P',t:item.P,bg:'var(--amber2)',c:'var(--amber)'},{l:'A',t:item.Q,bg:'var(--green2)',c:'var(--green)'}].map(({l,t,bg,c},j)=>(
                    <div key={j} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 7 }}>
                      <span style={{ width: 20, height: 20, background: bg, color: c, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{l}</span>
                      <span style={{ fontSize: Math.round(12 * fontScale), color: 'var(--txt2)', lineHeight: 1.5 }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          }

          const text = typeof item === 'string' ? item : item.text || ''
          return (
            <div key={i} style={{ background: isDel ? 'transparent' : 'var(--card)', border: `1px solid ${isDel ? 'var(--red)' : 'var(--brd)'}`, borderRadius: 11, padding: '12px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12, opacity: isDel ? 0.4 : 1 }}>
              <div style={{ flex: 1, fontSize: Math.round(13 * fontScale), lineHeight: 1.55 }}>{text}</div>
              {editMode && (
                <button onClick={() => isDel ? persistCustom({ ...custom, [tabKey]: { ...tabCustom, deleted: tabCustom.deleted.filter(d => d !== itemId) } }) : deleteBuiltIn(itemId)} style={{ flexShrink: 0, padding: '5px 10px', borderRadius: 7, fontSize: 11, fontWeight: 600, background: isDel ? 'var(--green2)' : 'var(--red2)', color: isDel ? 'var(--green)' : 'var(--red)', border: 'none', cursor: 'pointer' }}>
                  {isDel ? 'Restore' : '✕'}
                </button>
              )}
            </div>
          )
        })}

        {/* Custom added items */}
        {tabCustom.added.map(item => (
          <div key={item.id} style={{ background: 'var(--card)', border: `1px solid var(--brd)`, borderRadius: 11, padding: '12px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, fontSize: Math.round(13 * fontScale), lineHeight: 1.55 }}>{item.text}</div>
            <span style={{ fontSize: 10, background: color + '18', color, padding: '2px 7px', borderRadius: 999, flexShrink: 0 }}>Custom</span>
            {editMode && (
              <button onClick={() => deleteCustomItem(item.id)} style={{ flexShrink: 0, padding: '5px 10px', borderRadius: 7, fontSize: 11, fontWeight: 600, background: 'var(--red2)', color: 'var(--red)', border: 'none', cursor: 'pointer' }}>✕</button>
            )}
          </div>
        ))}

        {/* Add item input — edit mode only */}
        {editMode && (
          <div style={{ marginTop: 10, padding: '14px', background: 'var(--card)', border: `1px dashed ${color}`, borderRadius: 11 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: color, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Add custom item</div>
            <textarea
              className="input"
              value={newItemText}
              onChange={e => setNew(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) addCustomItem() }}
              placeholder="Type a new item… (Ctrl+↵ to add)"
              style={{ height: 60, fontSize: 13, marginBottom: 8, resize: 'none' }}
            />
            <button
              onClick={addCustomItem}
              disabled={!newItemText.trim()}
              style={{
                padding: '8px 18px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                background: newItemText.trim() ? color + '20' : 'var(--card2)',
                color: newItemText.trim() ? color : 'var(--txt3)',
                border: `1px solid ${newItemText.trim() ? color : 'var(--brd)'}`,
                cursor: newItemText.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              + Add item
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function ModeBtn ({ label, active, color, onClick }) {
  return <button onClick={onClick} style={{ padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: active ? 600 : 400, background: active ? color + '20' : 'var(--card2)', color: active ? color : 'var(--txt2)', border: `1px solid ${active ? color + '60' : 'var(--brd)'}`, transition: 'all 0.12s' }}>{label}</button>
}

function AddBtn ({ isAdded, color, onClick }) {
  return <button onClick={onClick} style={{ flexShrink: 0, padding: '7px 14px', borderRadius: 8, fontSize: 11, fontWeight: 600, background: isAdded ? color + '20' : 'var(--card2)', color: isAdded ? color : 'var(--txt2)', border: `1px solid ${isAdded ? color + '40' : 'var(--brd)'}`, alignSelf: 'flex-start', transition: 'all 0.12s' }}>{isAdded ? '✓ Added' : '+ Add'}</button>
}

function Row ({ label, labelColor, text, italic, last }) {
  return <div style={{ marginBottom: last ? 0 : 8 }}><div style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: labelColor, marginBottom: 2 }}>{label}</div><div style={{ fontSize: 12, color: 'var(--txt2)', lineHeight: 1.4, fontStyle: italic ? 'italic' : 'normal' }}>{text}</div></div>
}
