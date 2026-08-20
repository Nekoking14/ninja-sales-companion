import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { api } from '../api/index.js'
import { useFrameworks } from '../hooks/useFrameworks.js'
import { computeCallScore } from '../utils/scoring.js'
import Topbar             from '../components/Topbar.jsx'
import FrameworkCard      from '../components/FrameworkCard.jsx'
import FrameworkQuickList from '../components/FrameworkQuickList.jsx'
import FrameworkPanel     from '../components/FrameworkPanel.jsx'
import BattleCardFull    from '../components/BattleCardFull.jsx'
import QualificationForm  from '../components/QualificationForm.jsx'
import RightPanel         from '../components/RightPanel.jsx'

const PERSONA_TABS  = { 'Head of IT': 0, 'IT Manager': 1, 'Service Desk': 2, 'SysAdmin': 3, 'CISO': 4, 'Technician': 5 }
const PERSONA_AWARE = ['opener', 'personas']

function getDefaultTab (widgetId, persona) {
  if (!persona || !PERSONA_AWARE.includes(widgetId)) return 0
  return PERSONA_TABS[persona] ?? 0
}

export default function Dashboard () {
  const { state, dispatch } = useApp()
  const { currentProspect, currentSession, callSeconds, activePersona, spinNotes } = state
  const navigate     = useNavigate()
  const frameworks   = useFrameworks()

  const [openWidget,  setOpenWidget]  = useState(null)
  const [reportItems, setReportItems] = useState([])
  const [notes,       setNotes]       = useState([])
  const [addedIds,    setAddedIds]    = useState(new Set())
  const [callScore,   setCallScore]   = useState(0)

  // Recompute score whenever qual form data changes (localStorage) or notes change (AppContext)
  useEffect(() => {
    if (!currentSession?.id && !currentProspect?.id) return
    try {
      const key  = `qual_${currentSession?.id || currentProspect?.id || 'draft'}`
      const qual = JSON.parse(localStorage.getItem(key)) || {}
      // Merge spinNotes from AppContext — updates instantly when user types
      setCallScore(computeCallScore({ ...qual, ...spinNotes }))
    } catch {}
  }, [currentSession?.id, currentProspect?.id, spinNotes])

  useEffect(() => {
    if (!currentProspect) navigate('/', { replace: true })
  }, [currentProspect, navigate])

  useEffect(() => {
    if (!currentSession?.id) return
    api.sessions.get(currentSession.id).then(data => {
      setReportItems(data.reportItems || [])
      setNotes(data.notes || [])
      const ids = new Set((data.reportItems || []).map(i => i.sub_selection).filter(Boolean))
      setAddedIds(ids)
    })
  }, [currentSession?.id])

  useEffect(() => {
    const timer = setInterval(() => dispatch({ type: 'TICK' }), 1000)
    return () => clearInterval(timer)
  }, [dispatch])

  async function handleEndCall () {
    if (!currentSession?.id) return
    await api.sessions.end(currentSession.id, callSeconds)
    dispatch({ type: 'END_CALL' })
    navigate('/')
  }

  async function handleAddItem (itemId, itemData) {
    if (!currentSession?.id || !currentProspect?.id) return
    if (addedIds.has(itemId)) {
      const existing = reportItems.find(r => r.sub_selection === itemId)
      if (existing) {
        await api.reportItems.remove(existing.id)
        setReportItems(prev => prev.filter(r => r.id !== existing.id))
        setAddedIds(prev => { const s = new Set(prev); s.delete(itemId); return s })
      }
      return
    }
    const content = JSON.stringify(typeof itemData === 'string' ? { text: itemData } : itemData)
    const newItem = await api.reportItems.add({
      session_id: currentSession.id, prospect_id: currentProspect.id,
      framework: openWidget?.id || 'unknown', sub_selection: itemId, content
    })
    setReportItems(prev => [newItem, ...prev])
    setAddedIds(prev => new Set([...prev, itemId]))
  }

  async function handleAddNote (text) {
    if (!currentSession?.id || !currentProspect?.id) return
    const note = await api.notes.add({
      session_id: currentSession.id, prospect_id: currentProspect.id, content: text
    })
    setNotes(prev => [note, ...prev])
  }

  async function handleRemoveNote (id) {
    await api.notes.remove(id)
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  const addedPerFramework = useCallback(
    (widgetId) => reportItems.filter(r => r.framework === widgetId).length,
    [reportItems]
  )

  const panelKey = openWidget
    ? `${openWidget.id}_${PERSONA_AWARE.includes(openWidget.id) ? activePersona : 'static'}`
    : null

  if (!currentProspect) return null

  return (
    <div className="app-shell">
      <Topbar onEndCall={handleEndCall} callScore={callScore} />
      <div className="body-shell">

        {/* ── LEFT HALF — Frameworks (50%) ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: '1px solid var(--brd)' }}>
          {!openWidget ? (
            <div className="main-scroll">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>Sales frameworks</span>
                <span style={{ background: 'var(--card2)', border: '1px solid var(--brd)', color: 'var(--txt2)', fontSize: 11, padding: '2px 10px', borderRadius: 999 }}>
                  {frameworks.length} modules
                </span>
              </div>
              {activePersona && (
                <div style={{ marginBottom: 14, padding: '8px 14px', background: 'var(--acc3)', border: '1px solid var(--acc)', borderRadius: 9, fontSize: 12, color: 'var(--acc)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 600 }}>Persona: {activePersona}</span>
                  <span style={{ color: 'var(--txt2)' }}>— frameworks highlight the matching persona tab</span>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                {frameworks.map(widget => (
                  <FrameworkCard
                    key={widget.id}
                    widget={widget}
                    isActive={false}
                    addedCount={addedPerFramework(widget.id)}
                    onClick={() => setOpenWidget(widget)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              {openWidget.id !== 'bc' && (
                <FrameworkQuickList
                  frameworks={frameworks}
                  active={openWidget}
                  onSelect={setOpenWidget}
                  addedCounts={addedPerFramework}
                  onClose={() => setOpenWidget(null)}
                />
              )}
              {openWidget.id === 'bc' ? (
                <BattleCardFull key="bc" widget={openWidget} onClose={() => setOpenWidget(null)} />
              ) : (
                <FrameworkPanel
                  key={panelKey}
                  widget={openWidget}
                  onAddItem={handleAddItem}
                  addedIds={addedIds}
                  defaultTab={getDefaultTab(openWidget.id, activePersona)}
                />
              )}
            </div>
          )}
        </div>

        {/* ── RIGHT HALF — Qualification + SPIN notes (50%) ── */}
        <RightPanel prospect={currentProspect} session={currentSession} callSeconds={callSeconds} />

      </div>
    </div>
  )
}
