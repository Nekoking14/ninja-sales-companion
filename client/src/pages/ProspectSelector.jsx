import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { api } from '../api/index.js'

const PERSONAS = [
  {
    role: 'Head of IT yolo',
    fullRole: 'Director / Head of IT',
    titles: 'CTO · CIO · VP of IT · IT Director',
    cares: 'Strategy, scalability, security posture, cost control',
    color: 'var(--purple)',
    bg: 'var(--purple2)',
    grad: 'linear-gradient(135deg,#8B5CF6,#6366F1)'
  },
  {
    role: 'IT Manager',
    fullRole: 'IT Manager',
    titles: 'IT Manager · IT Operations Manager',
    cares: 'Standardisation, risk reduction, tool sprawl, team efficiency',
    color: 'var(--acc)',
    bg: 'var(--acc2)',
    grad: 'linear-gradient(135deg,#05C49A,#0891B2)'
  },
  {
    role: 'Service Desk',
    fullRole: 'Service Desk Manager',
    titles: 'Service Desk Manager · Help Desk Manager',
    cares: 'Ticket volume, SLA adherence, first-contact resolution',
    color: 'var(--blue)',
    bg: 'var(--blue2)',
    grad: 'linear-gradient(135deg,#4B8EF5,#6366F1)'
  },
  {
    role: 'SysAdmin',
    fullRole: 'Systems Administrator',
    titles: 'Sysadmin · IT Specialist · IT Engineer',
    cares: 'Control, automation, reliability, fewer manual tasks',
    color: 'var(--amber)',
    bg: 'var(--amber2)',
    grad: 'linear-gradient(135deg,#F59E0B,#FB923C)'
  },
  {
    role: 'CISO',
    fullRole: 'CISO / Security Leader',
    titles: 'CISO · CSO · VP of Cybersecurity',
    cares: 'Risk mitigation, security posture, attack surface, compliance',
    color: 'var(--coral)',
    bg: 'var(--coral2)',
    grad: 'linear-gradient(135deg,#F97316,#EF4444)'
  },
  {
    role: 'Technician',
    fullRole: 'IT Technician',
    titles: 'Help Desk Technician · IT Support Specialist',
    cares: 'Day-to-day speed, less repetitive work, solid alerting',
    color: 'var(--green)',
    bg: 'var(--green2)',
    grad: 'linear-gradient(135deg,#22C55E,#16A34A)'
  }
]

export default function ProspectSelector () {
  const { dispatch } = useApp()
  const navigate = useNavigate()

  async function startWithPersona (persona) {
    // Create a lightweight prospect using the persona role as the name
    const prospect = await api.prospects.create({
      name:    persona.role,
      company: persona.fullRole,
      role:    persona.fullRole
    })
    const session = await api.sessions.start(prospect.id)

    dispatch({ type: 'SET_PROSPECT', payload: prospect })
    dispatch({ type: 'SET_SESSION',  payload: session  })
    dispatch({ type: 'SET_PERSONA',  payload: persona.role })

    navigate('/dashboard')
  }

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      background: 'var(--bg)', overflow: 'hidden'
    }}>

      {/* Header */}
      <header style={{
        height: 56, background: 'var(--surf)',
        borderBottom: '1px solid var(--brd)',
        display: 'flex', alignItems: 'center',
        padding: '0 32px', gap: 12, flexShrink: 0
      }}>
        <div style={{
          width: 30, height: 30, background: 'var(--acc)', borderRadius: 7,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 13, color: '#042D22'
        }}>N</div>
        <span style={{ fontWeight: 600, fontSize: 14 }}>NinjaOne</span>
        <span style={{ color: 'var(--txt3)', fontSize: 12 }}>/</span>
        <span style={{ color: 'var(--txt2)', fontSize: 12 }}>Sales Companion</span>
        <span style={{
          marginLeft: 8, background: 'var(--acc2)', color: 'var(--acc)',
          fontSize: 10, fontWeight: 700, padding: '2px 10px', borderRadius: 999
        }}>BETA</span>
        <div style={{
          marginLeft: 'auto', width: 30, height: 30,
          background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 700, color: '#fff'
        }}>SC</div>
      </header>

      {/* Main */}
      <div style={{
        flex: 1, overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
        padding: '48px 64px 32px'
      }}>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.5px', marginBottom: 8 }}>
            Who are you speaking to?
          </div>
          <div style={{ color: 'var(--txt2)', fontSize: 14 }}>
            Select the persona that best matches your prospect to start the call session
          </div>
        </div>

        {/* Persona grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          width: '100%',
          maxWidth: 900
        }}>
          {PERSONAS.map(persona => (
            <button
              key={persona.role}
              onClick={() => startWithPersona(persona)}
              style={{
                background: 'var(--card)',
                border: '1px solid var(--brd)',
                borderRadius: 14,
                padding: '22px 20px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'border-color 0.15s, background 0.15s, transform 0.1s',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = persona.color
                e.currentTarget.style.background  = 'var(--card2)'
                e.currentTarget.style.transform   = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--brd)'
                e.currentTarget.style.background  = 'var(--card)'
                e.currentTarget.style.transform   = 'translateY(0)'
              }}
            >
              {/* Color top accent */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: 3, background: persona.color, opacity: 0.6
              }} />

              {/* Avatar */}
              <div style={{
                width: 44, height: 44,
                background: persona.grad,
                borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, marginBottom: 14,
                fontWeight: 700, color: '#fff'
              }}>
                {persona.role.slice(0, 1)}
              </div>

              {/* Role */}
              <div style={{
                fontSize: 15, fontWeight: 600,
                color: 'var(--txt)',
                marginBottom: 4
              }}>
                {persona.role}
              </div>

              {/* Titles */}
              <div style={{
                fontSize: 11, color: persona.color,
                marginBottom: 10, fontWeight: 500
              }}>
                {persona.titles}
              </div>

              {/* Cares about */}
              <div style={{
                fontSize: 12, color: 'var(--txt2)',
                lineHeight: 1.5
              }}>
                {persona.cares}
              </div>

              {/* Arrow */}
              <div style={{
                position: 'absolute', bottom: 16, right: 16,
                fontSize: 16, color: persona.color, opacity: 0.5
              }}>→</div>
            </button>
          ))}
        </div>

        {/* View all past sessions link */}
        <button
          onClick={() => {
            const navigate2 = () => {}
            window.location.href = '/prospects'
          }}
          style={{
            marginTop: 32,
            background: 'none',
            color: 'var(--txt3)',
            fontSize: 12,
            textDecoration: 'underline',
            cursor: 'pointer'
          }}
        >
          View past sessions →
        </button>

      </div>
    </div>
  )
}
