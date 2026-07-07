import { useState, useEffect, useRef } from 'react'
import { api } from '../api/index.js'
import ToolSelect  from './ToolSelect.jsx'
import MultiSelect from './MultiSelect.jsx'

// ── Preset options ──────────────────────────────────────────────────────────
const USE_CASE_OPTIONS = [
  'Patching compliance gaps',
  'Consolidate from multiple tools',
  'Remote workforce management',
  'Security posture improvement',
  'Cyber Essentials certification',
  'Reducing ticket volume',
  'Automating repetitive IT tasks',
  'Improving device visibility',
  'Cost reduction / budget optimisation',
  'MSP service delivery platform',
  'NIS2 / DORA compliance',
  'Onboarding / offboarding automation',
  'Reducing manual patching effort',
  'Faster incident response',
]

const TOOL_OPTIONS = {
  rmm:                ['Kaseya VSA', 'ConnectWise Automate', 'ManageEngine RMM', 'Datto RMM', 'N-Able N-sight', 'Atera', 'Syncro', 'Pulseway', 'Freshservice', 'None'],
  patching:           ['Intune / SCCM', 'Ivanti Patch', 'ManageEngine Patch Manager', 'BigFix', 'SolarWinds Patch Manager', 'None'],
  thirdPartyPatching: ['PDQ Deploy', 'Chocolatey', 'Heimdal', 'Automox', 'Patch My PC', 'None'],
  remoteAccess:       ['TeamViewer', 'AnyDesk', 'Splashtop', 'LogMeIn', 'GoTo Resolve', 'RDP only', 'None'],
  ticketing:          ['ServiceNow', 'Jira Service Management', 'Freshdesk', 'Zendesk', 'HaloITSM', 'Autotask', 'ConnectWise Manage', 'None'],
  mdm:                ['Intune', 'Jamf', 'VMware Workspace ONE', 'Cisco Meraki', 'SOTI MobiControl', 'None'],
  backup:             ['Veeam', 'Acronis', 'Datto Backup', 'Backup Exec', 'Azure Backup', 'Commvault', 'None'],
  avEdr:              ['Microsoft Defender', 'CrowdStrike Falcon', 'SentinelOne', 'Sophos Intercept X', 'Carbon Black', 'Malwarebytes', 'Trend Micro', 'None'],
  monitoring:         ['PRTG', 'Zabbix', 'Nagios', 'SolarWinds Observability', 'Datadog', 'Dynatrace', 'None'],
  complianceTool:     ['Qualys', 'Tenable / Nessus', 'Rapid7 InsightVM', 'Orca Security', 'Wiz', 'None'],
}

// ── Empty form state ────────────────────────────────────────────────────────
export const EMPTY_QUAL = {
  prospectType:   null,
  usesMsp:        null,
  mspPartner:     '',
  cloudOk:        null,
  cloudFrankfurt: null,
  endpoints:      '',
  nameCorrect:    null,
  emailCorrect:   null,
  decisionMaker:  null,
  mobileIos:      '',
  mobileAndroid:  '',
  timeline:       '',
  useCase:        [],    // array for multi-select
  msp:            '',
  tools: {
    rmm: '', patching: '', thirdPartyPatching: '',
    remoteAccess: '', ticketing: '', mdm: '',
    backup: '', avEdr: '', monitoring: '', complianceTool: ''
  }
}

// Normalise saved data (handles old string useCase, old mobileEndpoints)
function normalise (saved) {
  if (!saved) return EMPTY_QUAL
  return {
    ...EMPTY_QUAL,
    ...saved,
    tools: { ...EMPTY_QUAL.tools, ...saved.tools },
    useCase: Array.isArray(saved.useCase)
      ? saved.useCase
      : (saved.useCase ? [saved.useCase] : []),
    // keep backwards compat
    mobileIos:     saved.mobileIos     || '',
    mobileAndroid: saved.mobileAndroid || '',
  }
}

export default function QualificationForm ({ session, prospect }) {
  const key = `qual_${session?.id || prospect?.id || 'draft'}`

  const [form, setForm] = useState(() => {
    try { return normalise(JSON.parse(localStorage.getItem(key))) }
    catch { return EMPTY_QUAL }
  })

  useEffect(() => {
    try { setForm(normalise(JSON.parse(localStorage.getItem(key)))) }
    catch { setForm(EMPTY_QUAL) }
  }, [key])

  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem(key)) || {}
      localStorage.setItem(key, JSON.stringify({ ...existing, ...form, tools: form.tools }))
    } catch {}
  }, [form, key])

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

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', background: 'var(--bg)' }}>

      {/* Prospect type */}
      <Block title="Prospect type">
        <Label text="MSP OR INTERNAL IT?" />
        <BtnGroup value={form.prospectType} onChange={v => set('prospectType', v)} options={[
          { value: 'msp', label: 'MSP',          bg: 'var(--blue2)', color: 'var(--blue)', brd: 'var(--blue)' },
          { value: 'it',  label: 'Internal IT',  bg: 'var(--acc2)',  color: 'var(--acc)',  brd: 'var(--acc)'  }
        ]} />
        {form.prospectType === 'it' && (
          <div style={{ marginTop: 10 }}>
            <Label text="DO THEY USE AN MSP?" />
            <BtnGroup value={form.usesMsp} onChange={v => set('usesMsp', v)} options={[
              { value: 'yes', label: 'Yes — uses an MSP',   bg: 'var(--amber2)', color: 'var(--amber)', brd: 'var(--amber)' },
              { value: 'no',  label: 'No — self-managed',   bg: 'var(--green2)', color: 'var(--green)', brd: 'var(--green)' }
            ]} />
            {form.usesMsp === 'yes' && (
              <div style={{ marginTop: 8 }}>
                <Label text="MSP NAME" />
                <Input value={form.mspPartner} onChange={v => set('mspPartner', v)} placeholder="e.g. Computacenter, SHI…" />
              </div>
            )}
          </div>
        )}
        {form.prospectType === 'msp' && (
          <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--blue2)', borderRadius: 8, fontSize: 12, color: 'var(--blue)', lineHeight: 1.5 }}>
            MSP prospect — check if they manage endpoints for clients. If so, do NOT pursue direct sale. Mark as DNC in Salesforce.
          </div>
        )}
      </Block>

      {/* Disqualifiers */}
      <Block title="Disqualifiers — check first">
        <Label text="CLOUD OK?" />
        <BtnGroup value={form.cloudOk} onChange={v => set('cloudOk', v)} options={[
          { value: 'yes', label: 'Yes — cloud fine',      bg: 'var(--green2)', color: 'var(--green)', brd: 'var(--green)' },
          { value: 'no',  label: 'No — on-prem required', bg: 'var(--red2)',   color: 'var(--red)',   brd: 'var(--red)'   }
        ]} />
        {form.cloudOk === 'yes' && (
          <div style={{ marginTop: 10 }}>
            <Label text="CLOUD HOSTED IN FRANKFURT, EU — OK?" />
            <BtnGroup value={form.cloudFrankfurt} onChange={v => set('cloudFrankfurt', v)} options={[
              { value: 'yes', label: 'Yes — Frankfurt OK',       bg: 'var(--green2)', color: 'var(--green)', brd: 'var(--green)' },
              { value: 'no',  label: 'No — needs other region',  bg: 'var(--amber2)', color: 'var(--amber)', brd: 'var(--amber)' }
            ]} />
          </div>
        )}
        <div style={{ marginTop: 10 }}>
          <Label text="NUMBER OF ENDPOINTS" />
          <Input value={form.endpoints} onChange={v => set('endpoints', v)} placeholder="Enter number" />
        </div>
      </Block>

      {/* CRM */}
      <Block title="Confirm from CRM">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <Label text="NAME & TITLE CORRECT?" />
            <BtnGroup value={form.nameCorrect} onChange={v => set('nameCorrect', v)} options={[
              { value: 'confirmed', label: 'Confirmed',     bg: 'var(--green2)', color: 'var(--green)', brd: 'var(--green)' },
              { value: 'update',    label: 'Update needed', bg: 'var(--amber2)', color: 'var(--amber)', brd: 'var(--amber)' }
            ]} />
          </div>
          <div>
            <Label text="EMAIL CORRECT?" />
            <BtnGroup value={form.emailCorrect} onChange={v => set('emailCorrect', v)} options={[
              { value: 'confirmed', label: 'Confirmed',     bg: 'var(--green2)', color: 'var(--green)', brd: 'var(--green)' },
              { value: 'update',    label: 'Update needed', bg: 'var(--amber2)', color: 'var(--amber)', brd: 'var(--amber)' }
            ]} />
          </div>
          <div>
            <Label text="DECISION MAKER?" />
            <BtnGroup value={form.decisionMaker} onChange={v => set('decisionMaker', v)} options={[
              { value: 'dm',         label: 'Yes — DM',   bg: 'var(--green2)', color: 'var(--green)', brd: 'var(--green)' },
              { value: 'no',         label: 'No',         bg: 'var(--red2)',   color: 'var(--red)',   brd: 'var(--red)'   },
              { value: 'influencer', label: 'Influencer', bg: 'var(--amber2)', color: 'var(--amber)', brd: 'var(--amber)' }
            ]} />
          </div>
        </div>
      </Block>

      {/* Qualification */}
      <Block title="Qualification">
        {/* Mobile endpoints — split iOS / Android */}
        <Label text="MOBILE ENDPOINTS" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 10, color: 'var(--txt3)', marginBottom: 4 }}>iOS devices</div>
            <Input value={form.mobileIos} onChange={v => set('mobileIos', v)} placeholder="e.g. 50" />
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--txt3)', marginBottom: 4 }}>Android devices</div>
            <Input value={form.mobileAndroid} onChange={v => set('mobileAndroid', v)} placeholder="e.g. 30" />
          </div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <Label text="TIMELINE / CONTRACT END" />
          <Input value={form.timeline} onChange={v => set('timeline', v)} placeholder="e.g. Q3 — contract ends Aug" />
        </div>

        {/* Use case — multi-select */}
        <div style={{ marginBottom: 10, position: 'relative' }}>
          <Label text="USE CASE — DEMO HOOK" />
          <MultiSelect
            value={form.useCase}
            onChange={v => set('useCase', v)}
            options={USE_CASE_OPTIONS}
            placeholder="Select use cases…"
            color="var(--acc)"
          />
        </div>

        <div>
          <Label text="MSP / PROVIDER NAME" />
          <Input value={form.msp} onChange={v => set('msp', v)} placeholder="MSP name — or Internal IT" />
        </div>
      </Block>

      {/* Tool stack */}
      <Block title="Current tool stack">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { k: 'rmm',                l: 'RMM / EPM'         },
            { k: 'patching',           l: 'Patching'          },
            { k: 'thirdPartyPatching', l: '3rd party patching'},
            { k: 'remoteAccess',       l: 'Remote access'     },
            { k: 'ticketing',          l: 'Ticketing'         },
            { k: 'mdm',                l: 'MDM'               },
            { k: 'backup',             l: 'Backup'            },
            { k: 'avEdr',              l: 'AV / EDR'          },
            { k: 'monitoring',         l: 'Monitoring'        },
          ].map(({ k, l }) => (
            <div key={k}>
              <Label text={l} />
              <ToolSelect
                value={form.tools[k]}
                onChange={v => setTool(k, v)}
                options={TOOL_OPTIONS[k]}
                placeholder="Select or type…"
              />
            </div>
          ))}
          <div style={{ gridColumn: '1 / -1' }}>
            <Label text="COMPLIANCE TOOL" />
            <ToolSelect
              value={form.tools.complianceTool}
              onChange={v => setTool('complianceTool', v)}
              options={TOOL_OPTIONS.complianceTool}
              placeholder="Select or type…"
            />
          </div>
        </div>
      </Block>

    </div>
  )
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function Block ({ title, children }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--brd)', borderRadius: 10, padding: '14px 16px', marginBottom: 10 }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--txt3)', marginBottom: 12 }}>{title}</div>
      {children}
    </div>
  )
}
function Label ({ text }) {
  return <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--txt3)', marginBottom: 5 }}>{text}</div>
}
function Input ({ value, onChange, placeholder }) {
  return <input className="input" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ fontSize: 13, padding: '9px 12px' }} />
}
function BtnGroup ({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {options.map(opt => {
        const active = value === opt.value
        return (
          <button key={opt.value} type="button" onClick={() => onChange(active ? null : opt.value)} style={{
            flex: 1, padding: '8px 10px', borderRadius: 8, fontSize: 12, fontWeight: active ? 600 : 400,
            background: active ? opt.bg : 'var(--card2)', color: active ? opt.color : 'var(--txt2)',
            border: `1px solid ${active ? opt.brd : 'var(--brd2)'}`, transition: 'all 0.12s', cursor: 'pointer'
          }}>{opt.label}</button>
        )
      })}
    </div>
  )
}
