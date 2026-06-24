export default function FrameworkQuickList ({ frameworks, active, onSelect, addedCounts, onClose }) {
  return (
    <div style={{
      width: 188,
      background: 'var(--surf)',
      borderRight: '1px solid var(--brd)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      overflow: 'hidden'
    }}>

      {/* Header */}
      <div style={{
        padding: '12px 14px',
        borderBottom: '1px solid var(--brd)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span style={{
          fontSize: 11, fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--txt3)'
        }}>Frameworks</span>
        <button
          onClick={onClose}
          title="Back to grid"
          style={{
            background: 'var(--brd)',
            color: 'var(--txt2)',
            borderRadius: 6,
            fontSize: 11,
            padding: '3px 8px',
            fontWeight: 500
          }}
        >
          ← Grid
        </button>
      </div>

      {/* Framework list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 6px' }}>
        {frameworks.map(w => {
          const isActive = active?.id === w.id
          const count = addedCounts(w.id)

          return (
            <button
              key={w.id}
              onClick={() => onSelect(w)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 10px',
                borderRadius: 8,
                marginBottom: 2,
                background: isActive ? w.color + '18' : 'none',
                border: `1px solid ${isActive ? w.color + '50' : 'transparent'}`,
                color: isActive ? 'var(--txt)' : 'var(--txt2)',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.12s',
                position: 'relative'
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--card2)'
                  e.currentTarget.style.color = 'var(--txt)'
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'none'
                  e.currentTarget.style.color = 'var(--txt2)'
                }
              }}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  left: 0, top: 6, bottom: 6,
                  width: 2.5,
                  background: w.color,
                  borderRadius: '0 2px 2px 0'
                }} />
              )}

              {/* Icon */}
              <span style={{
                fontSize: 14,
                width: 20,
                textAlign: 'center',
                color: isActive ? w.color : 'var(--txt3)',
                flexShrink: 0
              }}>
                {w.icon}
              </span>

              {/* Label */}
              <span style={{
                fontSize: 12,
                fontWeight: isActive ? 500 : 400,
                flex: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {w.title}
              </span>

              {/* Added count badge */}
              {count > 0 && (
                <span style={{
                  fontSize: 10,
                  fontWeight: 600,
                  background: w.color + '20',
                  color: w.color,
                  padding: '1px 6px',
                  borderRadius: 999,
                  flexShrink: 0
                }}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
