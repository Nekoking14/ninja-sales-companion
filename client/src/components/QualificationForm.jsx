import { useState, useEffect, useRef } from 'react'
import { api } from '../api/index.js'

const EMPTY = {
  cloudOk: null, endpoints: '',
  nameCorrect: null, emailCorrect: null, decisionMaker: null,
  mobileEndpoints: '', timeline: '', useCase: '', msp: '',
  tools: {
    rmm: '', patching: '', thirdPartyPatching: '',
    remoteAccess: '', ticketing: '', mdm: '',
    backup: '', avEdr: '', monitoring: '', complianceTool: ''
  },
  notes: ''
}

export default function QualificationForm ({ session, prospect }) {
  const key = `qual_${session?.id || prospect?.id || 'draft'}`

  const [form, setForm] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key))
      return saved ? { ...EMPTY, ...saved, tools: { ...EMPTY.tools, ...saved.tools } } : EMPTY
    } catch { return EMPTY }
  })

  // Save to localStorage immediately
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(form))
  }, [form, key])

  // Debounce-save to DB (1 second after last change)
  const debounce = useRef(null)
  useEffect(() => {
    if (!session?.id) return
    clearTimeout(debounce.current)
    debounce.current = setTimeout(() => {
      api.sessions.saveQualification(session.id, form).catch(() => {})
    }, 1000)
    return () => clearTimeout(debounce.current)
  }, [form, session?.id])

  const set     = (f, v) => setForm(p => ({ ...p, [f]: v }))
  const setTool = (f, v) => setForm(p => ({ ...p, tools: { ...p.tools, [f]: v } }))

  function copySummary () {
    const t = form.tools
    const lines = [
      `QUALIFICATION — ${prospect?.name || ''} / ${prospect?.company || ''}`,
      `Date: ${new Date().toLocaleDateString()}`,
      '',
      `Cloud OK: ${form.cloudOk === 'yes' ? 'Yes — cloud fine' : form.cloudOk === 'no' ? 'No — on-prem required' : '—'}`,
      `Endpoints: ${form.endpoints || '—'}`,
      `Name/title correct: ${form.nameCorrect || '—'}`,
      `Email correct: ${form.emailCorrect || '—'}`,
      `Decision maker: ${form.decisionMaker || '—'}`,
      '',
      `Mobile endpoints: ${form.mobileEndpoints || '—'}`,
      `Timeline / contract end: ${form.timeline || '—'}`,
      `Use case / demo hook: ${form.useCase || '—'}`,
      `MSP: ${form.msp || '—'}`,
      '',
      'TOOL STACK:',
      `  RMM/EPM: ${t.rmm || '—'}  |  Patching: ${t.patching || '—'}  |  3rd Party: ${t.thirdPartyPatching || '—'}`,
      `  Remote Access: ${t.remoteAccess || '—'}  |  Ticketing: ${t.ticketing || '—'}  |  MDM: ${t.mdm || '—'}`,
      `  Backup: ${t.backup || '—'}  |  AV/EDR: ${t.avEdr || '—'}  |  Monitoring: ${t.monitoring || '—'}`,
      `  Compliance Tool: ${t.complianceTool || '—'}`,
      '',
      `NOTES: ${form.notes || '—'}`
    ]
    navigator.clipboard.writeText(lines.join('\n'))
      .then(() => alert('Qualification summary copied!'))
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', background: 'var(--bg)' }}>

      {/* Disqualifiers */}
      <Block title="Disqualifiers — check first">
        <Label text="CLOUD OK?" />
        <BtnGroup value={form.cloudOk} onChange={v => set('cloudOk', v)} options={[
          { value: 'yes', label: 'Yes — cloud fine',      bg: 'var(--green2)', color: 'var(--green)', brd: 'var(--green)' },
          { value: 'no',  label: 'No — on-prem required', bg: 'var(--red2)',   color: 'var(--red)',   brd: 'var(--red)'   }
        ]} />
        <div style={{ marginTop: 10 }}>
          <Label text="NUMBER OF ENDPOINTS" />
          <Input value={form.endpoints} onChange={v => set('endpoints', v)} placeholder="Enter number" />
        </div>
      </Block>

      {/* Confirm from CRM */}
      <Block title="Confirm from CRM">
        <Label text="NAME & TITLE CORRECT?" />
        <BtnGroup value={form.nameCorrect} onChange={v => set('nameCorrect', v)} options={[
          { value: 'confirmed', label: 'Confirmed',     bg: 'var(--green2)', color: 'var(--green)', brd: 'var(--green)' },
          { value: 'update',    label: 'Update needed', bg: 'var(--amber2)', color: 'var(--amber)', brd: 'var(--amber)' }
        ]} />
        <div style={{ marginTop: 10 }}>
          <Label text="EMAIL CORRECT?" />
          <BtnGroup value={form.emailCorrect} onChange={v => set('emailCorrect', v)} options={[
            { value: 'confirmed', label: 'Confirmed',     bg: 'var(--green2)', color: 'var(--green)', brd: 'var(--green)' },
            { value: 'update',    label: 'Update needed', bg: 'var(--amber2)', color: 'var(--amber)', brd: 'var(--amber)' }
          ]} />
        </div>
        <div style={{ marginTop: 10 }}>
          <Label text="DECISION MAKER?" />
          <BtnGroup value={form.decisionMaker} onChange={v => set('decisionMaker', v)} options={[
            { value: 'dm',         label: 'Yes — DM',   bg: 'var(--green2)', color: 'var(--green)', brd: 'var(--green)' },
            { value: 'no',         label: 'No',         bg: 'var(--red2)',   color: 'var(--red)',   brd: 'var(--red)'   },
            { value: 'influencer', label: 'Influencer', bg: 'var(--amber2)', color: 'var(--amber)', brd: 'var(--amber)' }
          ]} />
        </div>
      </Block>

      {/* Qualification */}
      <Block title="Qualification">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <Label text="MOBILE ENDPOINTS" />
            <Input value={form.mobileEndpoints} onChange={v => set('mobileEndpoints', v)} placeholder="e.g. iOS 50, Android 30" />
          </div>
          <div>
            <Label text="TIMELINE / CONTRACT END" />
            <Input value={form.timeline} onChange={v => set('timeline', v)} placeholder="e.g. Q3 — contract ends Aug" />
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <Label text="USE CASE — DEMO HOOK" />
          <Input value={form.useCase} onChange={v => set('useCase', v)} placeholder="e.g. Patching compliance gaps, consolidate from 3 tools" />
        </div>
        <div style={{ marginTop: 10 }}>
          <Label text="MSP?" />
          <Input value={form.msp} onChange={v => set('msp', v)} placeholder="MSP name — or Internal IT" />
        </div>
      </Block>

      {/* Tool stack */}
      <Block title="Current tool stack">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { k: 'rmm',                l: 'RMM / EPM',          p: 'e.g. Kaseya'     },
            { k: 'patching',           l: 'Patching',           p: 'e.g. Intune'     },
            { k: 'thirdPartyPatching', l: '3rd party patching', p: 'e.g. PDQ'        },
            { k: 'remoteAccess',       l: 'Remote access',      p: 'e.g. TeamViewer' },
            { k: 'ticketing',          l: 'Ticketing',          p: 'e.g. ServiceNow' },
            { k: 'mdm',                l: 'MDM',                p: 'e.g. Jamf'       },
            { k: 'backup',             l: 'Backup',             p: 'e.g. Veeam'      },
            { k: 'avEdr',              l: 'AV / EDR',           p: 'e.g. Defender'   },
            { k: 'monitoring',         l: 'Monitoring',         p: 'e.g. PRTG'       },
          ].map(({ k, l, p }) => (
            <div key={k}>
              <Label text={l} />
              <Input value={form.tools[k]} onChange={v => setTool(k, v)} placeholder={p} small />
            </div>
          ))}
          <div style={{ gridColumn: '1 / -1' }}>
            <Label text="COMPLIANCE TOOL" />
            <Input value={form.tools.complianceTool} onChange={v => setTool('complianceTool', v)} placeholder="e.g. Qualys, Tenable" />
          </div>
        </div>
      </Block>

      {/* Notes */}
      <Block title="Notes">
        <textarea
          className="input"
          value={form.notes}
          onChange={e => set('notes', e.target.value)}
          placeholder="Pain points, contract dates, follow-up flags..."
          style={{ height: 80, fontSize: 13 }}
        />
        <button
          onClick={copySummary}
          className="btn btn-ghost"
          style={{ marginTop: 10, fontSize: 12 }}
        >
          Copy summary
        </button>
      </Block>

    </div>
  )
}

// ── Small helpers ─────────────────────────────────────────────────────────────

function Block ({ title, children }) {
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--brd)',
      borderRadius: 10, padding: '14px 16px', marginBottom: 10
    }}>
      <div style={{
        fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.09em', color: 'var(--txt3)', marginBottom: 12
      }}>
        {title}
      </div>
      {children}
    </div>
  )
}

function Label ({ text }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
      letterSpacing: '0.08em', color: 'var(--txt3)', marginBottom: 5
    }}>
      {text}
    </div>
  )
}

function Input ({ value, onChange, placeholder, small }) {
  return (
    <input
      className="input"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ fontSize: small ? 12 : 13, padding: small ? '7px 10px' : '9px 12px' }}
    />
  )
}

function BtnGroup ({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {options.map(opt => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(active ? null : opt.value)}
            style={{
              flex: 1, padding: '8px 10px', borderRadius: 8,
              fontSize: 12, fontWeight: active ? 600 : 400,
              background: active ? opt.bg  : '#0D1222',
              color:      active ? opt.color : 'var(--txt2)',
              border:     `1px solid ${active ? opt.brd : 'var(--brd2)'}`,
              transition: 'all 0.12s'
            }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
