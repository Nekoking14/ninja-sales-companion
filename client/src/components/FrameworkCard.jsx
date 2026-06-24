export default function FrameworkCard ({ widget, isActive, addedCount, onClick }) {
  const { title, desc, tag, icon, color, count } = widget
  return (
    <div
      onClick={onClick}
      style={{
        background: isActive ? 'var(--card2)' : 'var(--card)',
        border: isActive ? `1.5px solid ${color}` : '1px solid var(--brd)',
        borderRadius: 12,
        padding: 14,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.15s, background 0.15s'
      }}
      onMouseEnter={e => {
        if (!isActive) e.currentTarget.style.borderColor = 'var(--brd2)'
      }}
      onMouseLeave={e => {
        if (!isActive) e.currentTarget.style.borderColor = 'var(--brd)'
      }}
    >
      {/* Active left accent bar */}
      {isActive && (
        <div style={{
          position: 'absolute', left: 0, top: 10, bottom: 10,
          width: 3, background: color, borderRadius: '0 2px 2px 0'
        }} />
      )}

      {/* Icon + tag */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: color + '20',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, color
        }}>
          {icon}
        </div>
        <span className="tag" style={{ background: color + '18', color }}>
          {tag}
        </span>
      </div>

      {/* Title + desc */}
      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3 }}>{title}</div>
      <div style={{ fontSize: 11, color: 'var(--txt2)', lineHeight: 1.4, marginBottom: 12 }}>{desc}</div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: 'var(--txt3)' }}>
          {addedCount > 0 ? `${addedCount} added` : `${count} items`}
        </span>
        <span style={{
          fontSize: 11, fontWeight: isActive ? 600 : 500,
          padding: '4px 10px', borderRadius: 7,
          background: isActive ? color + '20' : 'var(--brd2)',
          color: isActive ? color : 'var(--txt2)'
        }}>
          {isActive ? '✓ Active' : 'Open'}
        </span>
      </div>
    </div>
  )
}
