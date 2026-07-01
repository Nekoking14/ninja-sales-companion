import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { scoreColor, scoreLabel } from '../utils/scoring.js'

const PERSONAS = [
  'Head of IT',
  'IT Manager',
  'Service Desk',
  'SysAdmin',
  'CISO',
  'Technician'
]

function formatTime (sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0')
  const s = String(sec % 60).padStart(2, '0')
  return `${m}:${s}`
}

export default function Topbar ({ onEndCall, callScore = 0 }) {
  const { state, dispatch } = useApp()
  const { currentProspect, currentSession, callSeconds, activePersona, darkMode } = state
  const navigate = useNavigate()

  return (
    <header style={{
      height: 'var(--top-h)',
      background: 'var(--surf)',
      borderBottom: '1px solid var(--brd)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: 12,
      flexShrink: 0,
      zIndex: 100
    }}>
      {/* Logo */}
      <button
        onClick={() => navigate('/')}
        style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none' }}
      >
        <div style={{
          width: 30, height: 30,
          background: 'var(--acc)',
          borderRadius: 7,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 13, color: '#042D22'
        }}>N</div>
        <span style={{ fontWeight: 600, fontSize: 14 }}>NinjaOne</span>
        <span style={{ color: 'var(--txt3)', fontSize: 12 }}>/</span>
        <span style={{ color: 'var(--txt2)', fontSize: 12 }}>Sales Companion</span>
      </button>

      {/* Call indicator */}
      {currentSession && (
        <div style={{
          marginLeft: 'auto',
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(34,197,94,0.08)',
          border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: 999, padding: '5px 14px'
        }}>
          <div style={{
            width: 7, height: 7,
            background: 'var(--green)',
            borderRadius: '50%',
            animation: 'pulse 1.6s ease-in-out infinite'
          }} />
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--green)' }}>
            Call in progress
          </span>
          <span style={{
            fontSize: 12, fontWeight: 700, color: 'var(--green)',
            fontVariantNumeric: 'tabular-nums'
          }}>
            {formatTime(callSeconds)}
          </span>
        </div>
      )}

      {/* Call quality score — live during session */}
      {currentSession && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: scoreColor(callScore) + '15',
          border: `1px solid ${scoreColor(callScore)}40`,
          borderRadius: 999, padding: '4px 12px',
          transition: 'background 0.4s, border-color 0.4s'
        }}>
          <span style={{ fontSize: 11, color: 'var(--txt2)' }}>Call quality</span>
          <span style={{
            fontSize: 14, fontWeight: 800,
            color: scoreColor(callScore),
            fontVariantNumeric: 'tabular-nums',
            minWidth: 26, textAlign: 'center'
          }}>
            {callScore}
          </span>
          <span style={{ fontSize: 10, fontWeight: 600, color: scoreColor(callScore) }}>
            {scoreLabel(callScore)}
          </span>
        </div>
      )}

      {/* Persona selector — shown when on a call */}
      {currentSession && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--txt3)' }}>Persona</span>
          <select
            value={activePersona || ''}
            onChange={e => dispatch({ type: 'SET_PERSONA', payload: e.target.value || null })}
            style={{
              background: 'var(--card2)',
              border: '1px solid var(--brd2)',
              borderRadius: 8,
              color: activePersona ? 'var(--acc)' : 'var(--txt2)',
              fontSize: 12,
              fontWeight: activePersona ? 500 : 400,
              padding: '5px 10px',
              outline: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
          >
            <option value="">— select —</option>
            {PERSONAS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      )}

      {/* Prospect badge */}
      {currentProspect && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--card2)',
          border: '1px solid var(--brd)',
          borderRadius: 999, padding: '4px 12px 4px 4px',
          marginLeft: currentSession ? 0 : 'auto'
        }}>
          <div style={{
            width: 26, height: 26,
            background: 'linear-gradient(135deg, #05C49A, #0891B2)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 700, color: 'white'
          }}>
            {currentProspect.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <span style={{ fontSize: 12, fontWeight: 500 }}>{currentProspect.name}</span>
          <span style={{ color: 'var(--txt3)', fontSize: 11 }}>{currentProspect.company}</span>
        </div>
      )}

      {/* End call */}
      {currentSession && onEndCall && (
        <button
          onClick={onEndCall}
          className="btn btn-danger"
          style={{ padding: '7px 16px', fontSize: 12 }}
        >
          End call
        </button>
      )}

      {/* Dark / light toggle */}
      <button
        onClick={() => dispatch({ type: 'SET_DARK_MODE', payload: !darkMode })}
        title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        style={{
          width: 32, height: 32,
          background: 'var(--card2)',
          border: '1px solid var(--brd)',
          borderRadius: 8,
          color: 'var(--txt2)',
          fontSize: 15,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          marginLeft: currentSession ? 0 : 'auto'
        }}
      >
        {darkMode ? '☀' : '🌙'}
      </button>

      {/* User avatar */}
      <div style={{
        width: 30, height: 30,
        background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, fontWeight: 700, color: 'white',
        marginLeft: currentSession ? 0 : 'auto'
      }}>
        SC
      </div>
    </header>
  )
}
