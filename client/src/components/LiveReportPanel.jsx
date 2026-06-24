import { useState } from 'react'
import { api } from '../api/index.js'

export default function LiveReportPanel ({
  prospect, session, reportItems, notes,
  onRemoveItem, onAddNote, onRemoveNote
}) {
  const [noteText, setNoteText] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleAddNote () {
    if (!noteText.trim() || !session?.id) return
    setSaving(true)
    try {
      await onAddNote(noteText.trim())
      setNoteText('')
    } finally {
      setSaving(false)
    }
  }

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
      {/* Panel header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--brd)',
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'var(--surf)', flexShrink: 0
      }}>
        <span style={{ fontSize: 14 }}>📋</span>
        <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>Live report</span>
        <span className="pill" style={{ background: 'var(--red2)', color: 'var(--red)', fontSize: 10 }}>
          ● LIVE
        </span>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>

        {/* Prospect card */}
        {prospect && (
          <div className="card" style={{ marginBottom: 12, padding: 14 }}>
            <div className="section-label">Prospect</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div className="avatar avatar-sq" style={{
                width: 38, height: 38, fontSize: 14, flexShrink: 0,
                background: 'linear-gradient(135deg, #05C49A, #0891B2)'
              }}>
                {initials}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 1 }}>{prospect.name}</div>
                <div style={{ fontSize: 11, color: 'var(--txt2)' }}>
                  {prospect.role && `${prospect.role} · `}{prospect.company}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {[
                ['Industry',      prospect.industry,     'var(--txt2)'],
                ['Current tool',  prospect.current_tool, 'var(--amber)'],
                ['Call duration', formatDuration(session), 'var(--green)'],
              ].filter(([, v]) => v).map(([label, val, color]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: 'var(--txt3)' }}>{label}</span>
                  <span style={{ fontSize: 11, color }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Report items */}
        <div className="section-label">Selected items</div>
        {reportItems.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '24px 12px',
            color: 'var(--txt3)', fontSize: 12, lineHeight: 1.5
          }}>
            Open a framework and click items to add them here
          </div>
        ) : (
          reportItems.map(item => (
            <ReportItem key={item.id} item={item} onRemove={() => onRemoveItem(item.id)} />
          ))
        )}

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--brd)', margin: '12px 0' }} />

        {/* Notes */}
        <div className="section-label">Notes</div>
        {notes.length === 0 && (
          <p style={{ fontSize: 11, color: 'var(--txt3)', marginBottom: 8 }}>No notes yet</p>
        )}
        {notes.map(note => (
          <NoteItem key={note.id} note={note} onRemove={() => onRemoveNote(note.id)} />
        ))}
      </div>

      {/* Notes input */}
      <div style={{
        padding: 12,
        borderTop: '1px solid var(--brd)',
        background: 'var(--surf)', flexShrink: 0
      }}>
        <textarea
          className="input"
          value={noteText}
          onChange={e => setNoteText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleAddNote()
          }}
          placeholder="Add a call note… (Ctrl+Enter to save)"
          style={{ height: 54, marginBottom: 8, fontSize: 12 }}
        />
        <button
          onClick={handleAddNote}
          disabled={!noteText.trim() || saving}
          className="btn"
          style={{
            width: '100%', justifyContent: 'center',
            background: 'var(--acc2)', color: 'var(--acc)',
            fontSize: 12, opacity: (!noteText.trim() || saving) ? 0.5 : 1
          }}
        >
          {saving ? 'Saving…' : '+ Add note'}
        </button>
      </div>
    </aside>
  )
}

function ReportItem ({ item, onRemove }) {
  const colorMap = {
    opener:   'var(--purple)',
    spin:     'var(--acc)',
    aapa:     'var(--coral)',
    bc:       'var(--amber)',
    personas: 'var(--blue)',
    vp:       'var(--green)',
    vuln:     'var(--amber)',
    cal:      'var(--acc)',
  }
  const color = colorMap[item.framework] || 'var(--acc)'

  let preview = ''
  try {
    const data = JSON.parse(item.content)
    preview = data.text || data.scenario || data.pain || data.opener || item.content
  } catch {
    preview = item.content
  }

  return (
    <div className="animate-fadeUp" style={{
      background: 'var(--card2)', border: '1px solid var(--brd)',
      borderRadius: 10, padding: '10px 12px', marginBottom: 7,
      position: 'relative'
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
        <span>{item.framework?.toUpperCase()}</span>
        {item.sub_selection && <span style={{ opacity: 0.7 }}>· {item.sub_selection}</span>}
      </div>
      <div style={{ fontSize: 11, color: 'var(--txt2)', lineHeight: 1.4 }}>
        {preview.length > 120 ? preview.slice(0, 120) + '…' : preview}
      </div>
      <button
        onClick={onRemove}
        style={{
          position: 'absolute', top: 8, right: 8,
          background: 'none', color: 'var(--txt3)', fontSize: 14,
          padding: '0 4px'
        }}
        title="Remove from report"
      >×</button>
    </div>
  )
}

function NoteItem ({ note, onRemove }) {
  const time = new Date(note.created_at).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit'
  })
  return (
    <div className="animate-fadeUp" style={{
      background: 'var(--card2)', border: '1px solid var(--brd)',
      borderRadius: 9, padding: '8px 10px', marginBottom: 6,
      position: 'relative'
    }}>
      <div style={{ fontSize: 12, lineHeight: 1.4, marginBottom: 3, paddingRight: 16 }}>
        {note.content}
      </div>
      <div style={{ fontSize: 10, color: 'var(--txt3)' }}>⏱ {time}</div>
      <button
        onClick={onRemove}
        style={{
          position: 'absolute', top: 6, right: 6,
          background: 'none', color: 'var(--txt3)', fontSize: 14,
          padding: '0 4px'
        }}
        title="Delete note"
      >×</button>
    </div>
  )
}

function formatDuration (session) {
  if (!session) return null
  const started = new Date(session.started_at)
  const diff = Math.floor((Date.now() - started.getTime()) / 1000)
  const m = Math.floor(diff / 60)
  const s = diff % 60
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
}
