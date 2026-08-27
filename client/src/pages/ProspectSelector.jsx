import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { api } from '../api/index.js'

export default function ProspectSelector() {
  const { dispatch } = useApp()
  const navigate     = useNavigate()

  async function startCall(callType) {
    const prospect = await api.prospects.create({ name: 'New Prospect', company: '', role: '', callType })
    const session  = await api.sessions.start(prospect.id)
    dispatch({ type: 'SET_PROSPECT',  payload: { ...prospect, callType } })
    dispatch({ type: 'SET_SESSION',   payload: session  })
    dispatch({ type: 'SET_CALL_TYPE', payload: callType })
    navigate('/dashboard')
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', overflow: 'hidden' }}>

      {/* Header */}
      <header style={{ height: 56, background: 'var(--surf)', borderBottom: '1px solid var(--brd)', display: 'flex', alignItems: 'center', padding: '0 32px', gap: 12, flexShrink: 0 }}>
        <div style={{ width: 30, height: 30, background: 'var(--acc)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: '#042D22' }}>N</div>
        <span style={{ fontWeight: 600, fontSize: 14 }}>NinjaOne</span>
        <span style={{ color: 'var(--txt3)', fontSize: 12 }}>/</span>
        <span style={{ color: 'var(--txt2)', fontSize: 12 }}>Sales Companion</span>
        <div style={{ marginLeft: 'auto', width: 30, height: 30, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'white' }}>SC</div>
      </header>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32 }}>

        <div style={{ width: 72, height: 72, background: 'var(--acc)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 800, color: '#042D22', marginBottom: 4 }}>N</div>

        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 6 }}>NinjaOne Sales Companion</div>
          <div style={{ color: 'var(--txt2)', fontSize: 14 }}>How did this call come in?</div>
        </div>

        {/* Inbound */}
        <button
          onClick={() => startCall('inbound')}
          style={{
            width: 280, padding: '15px 24px', borderRadius: 14, fontSize: 15,
            fontWeight: 700, background: 'var(--acc)', color: '#042D22',
            border: 'none', cursor: 'pointer', transition: 'opacity 0.15s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <span style={{ fontSize: 20 }}>📥</span>
          <div style={{ textAlign: 'left' }}>
            <div>Inbound Call</div>
            <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.75 }}>They reached out to us</div>
          </div>
        </button>

        {/* Outbound */}
        <button
          onClick={() => startCall('outbound')}
          style={{
            width: 280, padding: '15px 24px', borderRadius: 14, fontSize: 15,
            fontWeight: 600, background: 'var(--card)', color: 'var(--txt)',
            border: '1px solid var(--brd)', cursor: 'pointer', transition: 'border-color 0.15s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--acc)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--brd)'}
        >
          <span style={{ fontSize: 20 }}>📤</span>
          <div style={{ textAlign: 'left' }}>
            <div>Outbound Call</div>
            <div style={{ fontSize: 11, fontWeight: 400, color: 'var(--txt2)' }}>We reached out to them</div>
          </div>
        </button>

        {/* Sessions */}
        <button
          onClick={() => navigate('/prospects')}
          style={{
            width: 280, padding: '12px 24px', borderRadius: 14, fontSize: 14,
            fontWeight: 500, background: 'transparent', color: 'var(--txt2)',
            border: '1px solid var(--brd)', cursor: 'pointer', marginTop: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'border-color 0.15s'
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brd2)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--brd)'}
        >
          <span>📋</span> Past Sessions
        </button>

      </div>
    </div>
  )
}
