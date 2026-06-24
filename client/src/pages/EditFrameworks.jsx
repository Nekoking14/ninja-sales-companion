import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FRAMEWORKS } from '../data/frameworks.js'
import { api } from '../api/index.js'
import Topbar  from '../components/Topbar.jsx'
import Sidebar from '../components/Sidebar.jsx'

const COMPLEX = ['aapa', 'bc'] // these have structured items — read-only

export default function EditFrameworks () {
  const navigate  = useNavigate()
  const [open,    setOpen]    = useState(null) // expanded framework id
  const [openTab, setOpenTab] = useState(0)
  const [customs, setCustoms] = useState({})   // key → items[]
  const [addText, setAddText] = useState('')
  const [saved,   setSaved]   = useState(null)

  // Load all saved custom items on mount
  useEffect(() => {
    api.settings.list('fw_').then(rows => {
      const map = {}
      rows.forEach(r => { map[r.key] = r.value })
      setCustoms(map)
    }).catch(() => {})
  }, [])

  function getItems (fw, tabIdx) {
    const key = fw.tabs ? `fw_${fw.id}_${tabIdx}` : `fw_${fw.id}_flat`
    if (customs[key]) return customs[key]
    if (fw.tabs) return fw.tabs[tabIdx]?.items ?? []
    return fw.items ?? []
  }

  async function saveItems (fw, tabIdx, items) {
    const key = fw.tabs ? `fw_${fw.id}_${tabIdx}` : `fw_${fw.id}_flat`
    await api.settings.put(key, items)
    setCustoms(prev => ({ ...prev, [key]: items }))
    setSaved(key)
    setTimeout(() => setSaved(null), 1500)
  }

  async function deleteItem (fw, tabIdx, itemIdx) {
    const items = getItems(fw, tabIdx)
    await saveItems(fw, tabIdx, items.filter((_, i) => i !== itemIdx))
  }

  async function addItem (fw, tabIdx) {
    if (!addText.trim()) return
    const items = getItems(fw, tabIdx)
    await saveItems(fw, tabIdx, [...items, addText.trim()])
    setAddText('')
  }

  async function resetToDefault (fw, tabIdx) {
    if (!window.confirm('Reset this tab to the original default items?')) return
    const key = fw.tabs ? `fw_${fw.id}_${tabIdx}` : `fw_${fw.id}_flat`
    await api.settings.remove(key)
    setCustoms(prev => { const n = { ...prev }; delete n[key]; return n })
    setSaved(key + '_reset')
    setTimeout(() => setSaved(null), 1500)
  }

  return (
    <div className="app-shell">
      <Topbar />
      <div className="body-shell">
        <Sidebar />

        <div className="main-scroll" style={{ padding: '24px 32px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.3px', marginBottom: 3 }}>Edit frameworks</div>
              <div style={{ fontSize: 13, color: 'var(--txt2)' }}>
                Add or remove items from each framework. Changes apply immediately to all new sessions.
              </div>
            </div>
            <button onClick={() => navigate('/dashboard')} className="btn btn-ghost" style={{ fontSize: 12 }}>
              ← Back to dashboard
            </button>
          </div>

          {/* Framework accordion */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FRAMEWORKS.map(fw => {
              const isOpen    = open === fw.id
              const isComplex = COMPLEX.includes(fw.id)

              return (
                <div key={fw.id} style={{
                  background: 'var(--card)',
                  border: `1px solid ${isOpen ? fw.color + '50' : 'var(--brd)'}`,
                  borderRadius: 12, overflow: 'hidden',
                  transition: 'border-color 0.15s'
                }}>

                  {/* Framework header */}
                  <button
                    onClick={() => { setOpen(isOpen ? null : fw.id); setOpenTab(0); setAddText('') }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                      padding: '14px 18px', background: isOpen ? 'var(--card2)' : 'none',
                      textAlign: 'left', transition: 'background 0.12s'
                    }}
                  >
                    <div style={{
                      width: 34, height: 34, borderRadius: 9,
                      background: fw.color + '20', color: fw.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, flexShrink: 0
                    }}>{fw.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{fw.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--txt2)' }}>{fw.desc}</div>
                    </div>
                    {isComplex && (
                      <span style={{ fontSize: 10, color: 'var(--txt3)', background: 'var(--brd)', padding: '2px 8px', borderRadius: 6 }}>
                        Read-only
                      </span>
                    )}
                    <span style={{ color: 'var(--txt3)', fontSize: 14, flexShrink: 0 }}>
                      {isOpen ? '▲' : '▼'}
                    </span>
                  </button>

                  {/* Expanded content */}
                  {isOpen && (
                    <div style={{ padding: '0 18px 18px', animation: 'fadeUp 0.15s ease' }}>

                      {/* Complex — read-only notice */}
                      {isComplex && (
                        <div style={{
                          padding: '10px 14px', background: 'var(--card2)',
                          borderRadius: 8, fontSize: 12, color: 'var(--txt2)',
                          marginTop: 8, borderLeft: '3px solid var(--amber)'
                        }}>
                          This framework uses structured items (AAPA scripts / battlecard rows) that can't be edited inline. Contact your team admin to update these.
                        </div>
                      )}

                      {/* Tabs (for tabbed frameworks) */}
                      {fw.tabs && !isComplex && (
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 12, marginBottom: 14 }}>
                          {fw.tabs.map((tab, i) => (
                            <button
                              key={i}
                              onClick={() => { setOpenTab(i); setAddText('') }}
                              style={{
                                padding: '5px 12px', borderRadius: 20, fontSize: 12,
                                background: openTab === i ? fw.color + '20' : 'var(--card2)',
                                color: openTab === i ? fw.color : 'var(--txt2)',
                                border: `1px solid ${openTab === i ? fw.color + '50' : 'var(--brd)'}`,
                              }}
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Items list */}
                      {!isComplex && (
                        <>
                          <div style={{ marginBottom: 10 }}>
                            {getItems(fw, openTab).map((item, idx) => {
                              const text = typeof item === 'string' ? item : item.text || JSON.stringify(item)
                              return (
                                <div key={idx} style={{
                                  display: 'flex', alignItems: 'flex-start', gap: 10,
                                  padding: '9px 12px', marginBottom: 5,
                                  background: 'var(--card2)', borderRadius: 8,
                                  border: '1px solid var(--brd)'
                                }}>
                                  <div style={{ flex: 1, fontSize: 13, lineHeight: 1.5, color: 'var(--txt)' }}>{text}</div>
                                  <button
                                    onClick={() => deleteItem(fw, openTab, idx)}
                                    style={{
                                      flexShrink: 0, background: 'var(--red2)',
                                      color: 'var(--red)', border: 'none',
                                      borderRadius: 6, padding: '3px 8px',
                                      fontSize: 12, fontWeight: 600, marginTop: 2
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              )
                            })}

                            {getItems(fw, openTab).length === 0 && (
                              <div style={{ fontSize: 12, color: 'var(--txt3)', padding: '8px 0', textAlign: 'center' }}>
                                No items — add one below
                              </div>
                            )}
                          </div>

                          {/* Add new item */}
                          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                            <textarea
                              className="input"
                              value={addText}
                              onChange={e => setAddText(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) addItem(fw, openTab) }}
                              placeholder="Add a new item… (Ctrl+Enter to save)"
                              style={{ flex: 1, height: 56, fontSize: 13, resize: 'none' }}
                            />
                            <button
                              onClick={() => addItem(fw, openTab)}
                              disabled={!addText.trim()}
                              style={{
                                padding: '10px 16px', borderRadius: 9, fontSize: 13, fontWeight: 600,
                                background: addText.trim() ? fw.color + '20' : 'var(--card2)',
                                color: addText.trim() ? fw.color : 'var(--txt3)',
                                border: `1px solid ${addText.trim() ? fw.color + '50' : 'var(--brd)'}`,
                                alignSelf: 'stretch'
                              }}
                            >
                              Add
                            </button>
                          </div>

                          {/* Saved indicator + reset */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                            <div style={{ fontSize: 11, color: saved ? 'var(--green)' : 'transparent', transition: 'color 0.2s' }}>
                              ✓ Saved
                            </div>
                            <button
                              onClick={() => resetToDefault(fw, openTab)}
                              style={{ fontSize: 11, color: 'var(--txt3)', background: 'none', textDecoration: 'underline' }}
                            >
                              Reset to defaults
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
