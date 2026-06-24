import QualificationForm from './QualificationForm.jsx'

export default function RightPanel ({ prospect, session, callSeconds }) {
  const initials = prospect?.name
    ? prospect.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '??'

  return (
    <aside style={{
      width: 'var(--panel-w)',
      background: 'var(--surf)',
      borderLeft: '1px solid var(--brd)',
      display: 'flex', flexDirection: 'column',
      flexShrink: 0, overflow: 'hidden'
    }}>

      {/* Prospect strip */}
      <div style={{
        padding: '10px 16px', borderBottom: '1px solid var(--brd)',
        display: 'flex', alignItems: 'center', gap: 10,
        flexShrink: 0, background: 'var(--card2)'
      }}>
        <div style={{
          width: 32, height: 32,
          background: 'linear-gradient(135deg,#05C49A,#0891B2)',
          borderRadius: 8, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 12, fontWeight: 700,
          color: '#fff', flexShrink: 0
        }}>{initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {prospect?.name}
          </div>
          <div style={{ fontSize: 11, color: 'var(--txt2)' }}>{prospect?.company}</div>
        </div>
        {session && (
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
            {fmt(callSeconds)}
          </div>
        )}
      </div>

      {/* Label */}
      <div style={{
        padding: '9px 16px', borderBottom: '1px solid var(--brd)',
        fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.08em', color: 'var(--txt3)',
        flexShrink: 0, background: 'var(--surf)'
      }}>
        Qualification
      </div>

      {/* Form — fills remaining space */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <QualificationForm session={session} prospect={prospect} />
      </div>

    </aside>
  )
}

function fmt (sec) {
  return String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0')
}
