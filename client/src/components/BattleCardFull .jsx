import { useState, useMemo } from 'react'
import { BATTLECARD_DATA } from '../data/battlecardData.js'

// ─── All static product/scenario data extracted from Discovery Assistant Nhi Hao ────

const PRODUCTS = ['Vuln. Manager','Backup','MDM','Ticketing','M365 Backup','IT Asset Mgmt','Patching']

const PRODUCT_LABEL = {
  'Vuln. Manager': 'Vulnerability Manager',
  'Backup':        'Backup',
  'MDM':           'MDM',
  'Ticketing':     'Ticketing',
  'M365 Backup':   'M365 Backup',
  'IT Asset Mgmt': 'IT Asset Management',
  'Patching':      'Patching',
}

const PRODUCT_ICON = {
  'Vuln. Manager': '🛡',
  'Backup':        '💾',
  'MDM':           '📱',
  'Ticketing':     '🎫',
  'M365 Backup':   '☁',
  'IT Asset Mgmt': '📦',
  'Patching':      '🩹',
}

const PRODUCT_DESC = {
  'Vuln. Manager': 'Patch management, CVE remediation and vulnerability scanning — positioned around NIS-2, ISO 27001 and GDPR compliance pressure.',
  'Backup':        'Endpoint and server backup, disaster recovery, RTO/RPO and ransomware recovery — with an emphasis on tested, provable restores.',
  'MDM':           'Mobile device management — BYOD vs. corporate devices, enrollment, remote wipe, policy management and compliance enforcement.',
  'Ticketing':     'Ticketing and PSA — incident management, SLA tracking, workflow transparency and giving IT visibility to the rest of the business.',
  'M365 Backup':   "Backup for Exchange, SharePoint, OneDrive and Teams — closing the gap left by Microsoft's own retention limits and native tools.",
  'IT Asset Mgmt': 'Asset discovery and inventory, license compliance, shadow IT detection, audit readiness and warranty tracking.',
  'Patching':      'OS and third-party application patching across Windows, macOS and Linux — reducing CVE exposure and maintaining compliance without manual triage.',
}

const PRODUCT_PITCH = {
  'Vuln. Manager': 'Find and fix the vulnerabilities attackers actually exploit — before they do.',
  'Backup':        'Backups only matter if the restore actually works — we prove it does.',
  'MDM':           'One console for every device, company-owned or BYOD, with real enforcement, not just visibility.',
  'Ticketing':     'Give IT the same visibility and accountability the rest of the business expects.',
  'M365 Backup':   "Microsoft keeps your data available, not backed up. We close that gap.",
  'IT Asset Mgmt': "You can't secure or license what you can't see. We make every asset visible.",
  'Patching':      'Most breaches exploit vulnerabilities that patches already exist for. NinjaOne closes that window automatically.',
}

const PRODUCT_POINTS = {
  'Vuln. Manager': [
    'Continuous vulnerability scanning across every managed endpoint, not a point-in-time audit',
    'Automated patch deployment tied to CVE severity — no manual triage required',
    'Audit-ready reporting mapped to NIS-2, ISO 27001 and GDPR requirements',
  ],
  'Backup': [
    'Automated, verified backups across endpoints and servers — not a nightly job that might fail silently',
    'Fast, tested recovery with clear RTO/RPO, critical during a ransomware event',
    'Immutable, ransomware-resistant retention kept separate from the production network',
  ],
  'MDM': [
    'Full lifecycle management: enroll, configure, patch and remote-wipe from one place',
    'Granular BYOD vs. corporate policies without invading personal data',
    'Compliance enforcement that blocks non-compliant devices automatically',
  ],
  'Ticketing': [
    'SLA tracking and escalation so nothing silently slips past deadline',
    'One workflow from ticket to resolution, with a full audit trail',
    "Reporting that shows IT's impact in language leadership actually reads",
  ],
  'M365 Backup': [
    'Independent, immutable backup of Exchange, SharePoint, OneDrive and Teams',
    "Recovery from accidental deletion, insider threat or ransomware beyond Microsoft's retention windows",
    'Granular, fast restores without opening a Microsoft support ticket',
  ],
  'IT Asset Mgmt': [
    'Automatic discovery of every device, license and piece of shadow IT on the network',
    'Warranty and lifecycle tracking that turns budgeting into a data-driven conversation',
    'Audit-ready inventory reporting in minutes, not a multi-week manual reconciliation',
  ],
  'Patching': [
    'Automated patch deployment across Windows, macOS and Linux — OS and 100+ third-party apps',
    'Policy-based scheduling with maintenance windows, staged rollouts and rollback capability',
    'Real-time compliance dashboards mapped to NIS-2, ISO 27001 and cyber insurance requirements',
  ],
}

const PRODUCT_TRIGGERS = {
  'Vuln. Manager': ['Recent CVE/breach','Upcoming compliance audit','Cyber insurance renewal','New security hire'],
  'Backup':        ['Recent ransomware scare','Failed/untested restore','Cyber insurance requirement','Data loss incident'],
  'MDM':           ['Lost/stolen device','BYOD policy gaps','Remote workforce growth','Compliance mandate'],
  'Ticketing':     ['SLA misses','"What does IT even do"','Disjointed tools/spreadsheets','Team growth outpacing process'],
  'M365 Backup':   ['Assumed Microsoft "has it covered"','Retention policy gap','Accidental deletion incident','Compliance/e-discovery need'],
  'IT Asset Mgmt': ['Painful license audit','Shadow IT discovery','Budget planning season','M&A / device consolidation'],
  'Patching':      ['Recent CVE/breach','WSUS reliability issues','Cyber insurance renewal','Failed compliance audit'],
}

const PRODUCT_BC_CAT = {
  'Vuln. Manager': 'RMM',
  'Backup':        'Backup',
  'MDM':           'MDM',
  'Ticketing':     'PSA / ITSM',
  'M365 Backup':   'Backup',
  'IT Asset Mgmt': 'RMM',
  'Patching':      'Patching',
}

const ROLES       = ['IT Manager','Sysadmin','CFO / MD','CISO / SecOps']

const PRODUCT_COLOR  = { 'Vuln. Manager':'var(--acc)','Backup':'var(--amber)','MDM':'var(--blue)','Ticketing':'var(--coral)','M365 Backup':'var(--blue)','IT Asset Mgmt':'var(--purple)','Patching':'var(--green)' }
const CAT_COLOR      = { 'RMM':'var(--purple)','MDM':'var(--blue)','Backup':'var(--amber)','Remote Access':'var(--acc)','PSA / ITSM':'var(--coral)','AV / Security':'#ec4899','Patching':'var(--blue)' }

// ─── Root component ──────────────────────────────────────────────────────────

export default function BattleCardFull({ widget, onClose }) {
  const [product,  setProduct]   = useState('Vuln. Manager')
  const [role,     setRole]      = useState('IT Manager')
  const [competitor, setCompetitor] = useState(null)
  const [openObj,  setOpenObj]   = useState(null)

  // Auto-select first competitor in category when product changes
  const bcCat = PRODUCT_BC_CAT[product]
  const bcCompetitors = useMemo(() => {
    return Object.entries(BATTLECARD_DATA.competitors)
      .filter(([, d]) => d.category === bcCat)
      .sort((a, b) => a[0].localeCompare(b[0]))
  }, [bcCat])

  const currentComp = competitor && BATTLECARD_DATA.competitors[competitor]?.category === bcCat
    ? competitor
    : (bcCompetitors[0]?.[0] || null)
  const compData = currentComp ? BATTLECARD_DATA.competitors[currentComp] : null

  const pc = PRODUCT_COLOR[product]  || 'var(--acc)'
  const cc = CAT_COLOR[bcCat] || 'var(--amber)'

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg)' }}>

      {/* ── Top bar: back + product tabs + role ── */}
      <div style={{ flexShrink: 0, background: 'var(--surf)', borderBottom: '1px solid var(--brd)' }}>

        {/* Row 1: back button + product pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px 6px', flexWrap: 'wrap' }}>
          <button
            onClick={onClose}
            style={{ padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 500, background: 'var(--card2)', color: 'var(--txt2)', border: '1px solid var(--brd)', cursor: 'pointer', marginRight: 4, flexShrink: 0 }}
          >
            ← Back
          </button>
          {PRODUCTS.map(p => {
            const active = product === p
            const c = PRODUCT_COLOR[p] || 'var(--acc)'
            return (
              <button key={p} onClick={() => { setProduct(p); setOpenObj(null) }} style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px',
                borderRadius: 20, fontSize: 12, fontWeight: active ? 600 : 400,
                background: active ? c + '20' : 'var(--card2)',
                color: active ? c : 'var(--txt2)',
                border: `1px solid ${active ? c + '60' : 'var(--brd)'}`,
                transition: 'all 0.12s', cursor: 'pointer', flexShrink: 0
              }}>
                <span style={{ fontSize: 13 }}>{PRODUCT_ICON[p]}</span>
                {PRODUCT_LABEL[p]}
              </button>
            )
          })}
        </div>

        {/* Row 2: role pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 18px 8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: 4 }}>Speaking with:</span>
          {ROLES.map(r => {
            const active = role === r
            return (
              <button key={r} onClick={() => { setRole(r) }} style={{
                padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: active ? 600 : 400,
                background: active ? 'var(--brd2)' : 'transparent',
                color: active ? 'var(--txt)' : 'var(--txt2)',
                border: `1px solid ${active ? 'var(--brd2)' : 'transparent'}`,
                cursor: 'pointer', transition: 'all 0.12s'
              }}>
                {r}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── 2-column body ── */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '320px 1fr', overflow: 'hidden', gap: 0 }}>

        {/* ─── LEFT: Product talk track ─── */}
        <div style={{ borderRight: '1px solid var(--brd)', overflowY: 'auto', padding: '22px 18px', background: 'var(--surf)' }}>

          {/* Product hero */}
          <div style={{ width: 48, height: 48, borderRadius: 14, background: pc + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 14 }}>
            {PRODUCT_ICON[product]}
          </div>

          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--txt)', marginBottom: 4 }}>
            {PRODUCT_LABEL[product]}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--txt2)', marginBottom: 14 }}>
            <span>🎯</span> Speaking with: {role}
          </div>

          <div style={{ fontSize: 12.5, color: 'var(--txt2)', lineHeight: 1.65, marginBottom: 18 }}>
            {PRODUCT_DESC[product]}
          </div>

          {/* Pitch box */}
          <div style={{ background: 'linear-gradient(135deg, #0D1F4E, #142A6A)', borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>"</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', fontStyle: 'italic', lineHeight: 1.5 }}>
              {PRODUCT_PITCH[product]}
            </div>
          </div>

          {/* Key talking points */}
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--txt3)', marginBottom: 10 }}>
            Key talking points
          </div>
          {PRODUCT_POINTS[product]?.map((pt, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 9, alignItems: 'flex-start' }}>
              <span style={{ width: 18, height: 18, borderRadius: 5, background: 'var(--green2)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, flexShrink: 0, marginTop: 1 }}>✓</span>
              <span style={{ fontSize: 12, color: 'var(--txt2)', lineHeight: 1.5 }}>{pt}</span>
            </div>
          ))}

          {/* Listen for triggers */}
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--txt3)', margin: '16px 0 10px' }}>
            Listen for these triggers
          </div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {PRODUCT_TRIGGERS[product]?.map((tr, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, background: 'var(--amber2)', color: 'var(--amber)', padding: '4px 10px', borderRadius: 20 }}>
                <span style={{ fontSize: 9 }}>⚠</span> {tr}
              </span>
            ))}
          </div>
        </div>

        {/* ─── RIGHT: Battle card ─── */}
        <div style={{ borderLeft: '1px solid var(--brd)', overflowY: 'auto', background: 'var(--surf)', display: 'flex', flexDirection: 'column' }}>

          {/* BC header */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--brd)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
              <span style={{ fontSize: 14, color: cc }}>🛡</span>
              <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--txt)' }}>Battle Cards</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--txt2)' }}>Competitors in {bcCat}</div>
          </div>

          {/* Competitor selector */}
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--brd)', flexShrink: 0 }}>
            <select
              value={currentComp || ''}
              onChange={e => { setCompetitor(e.target.value); setOpenObj(null) }}
              style={{
                width: '100%', background: 'var(--card)', border: '1px solid var(--brd2)',
                color: 'var(--txt)', borderRadius: 8, padding: '8px 10px', fontSize: 13,
                fontWeight: 600, cursor: 'pointer'
              }}
            >
              {bcCompetitors.map(([name]) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          {compData ? (
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>

              {/* Competitor header */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 15.5, fontWeight: 800, color: 'var(--txt)', marginBottom: 3 }}>
                  NinjaOne vs {currentComp}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--txt2)', fontStyle: 'italic', lineHeight: 1.45 }}>
                  {compData.tagline}
                </div>
                {compData.avMode && compData.defaultPartner && (
                  <div style={{ marginTop: 8, padding: '6px 10px', borderRadius: 7, fontSize: 11, background: '#ec489912', border: '1px solid #ec489930', color: '#ec4899' }}>
                    AV displacement → recommend <strong>{compData.defaultPartner}</strong>
                  </div>
                )}
              </div>

              {/* G2 ratings table */}
              {compData.g2?.overall?.length === 2 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--txt3)', marginBottom: 8 }}>
                    G2 Ratings
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--brd)' }}>
                        <th style={{ textAlign: 'left', padding: '4px 6px', fontWeight: 700, color: 'var(--txt3)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Metric</th>
                        <th style={{ textAlign: 'right', padding: '4px 6px', fontWeight: 700, color: 'var(--green)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>NinjaOne</th>
                        <th style={{ textAlign: 'right', padding: '4px 6px', fontWeight: 700, color: 'var(--txt3)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{currentComp.split(' ')[0]}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(compData.g2).map(([key, vals]) =>
                        Array.isArray(vals) && vals.length === 2 ? (
                          <tr key={key} style={{ borderBottom: '1px solid var(--brd)' }}>
                            <td style={{ padding: '6px 6px', color: 'var(--txt2)', textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</td>
                            <td style={{ padding: '6px 6px', textAlign: 'right', fontWeight: 700, color: 'var(--green)' }}>{vals[0]}</td>
                            <td style={{ padding: '6px 6px', textAlign: 'right', color: parseFloat(vals[1]) < parseFloat(vals[0]) ? 'var(--red)' : 'var(--txt2)' }}>{vals[1]}</td>
                          </tr>
                        ) : null
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Head-to-head */}
              <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--txt3)', marginBottom: 8 }}>
                Head-to-head
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                <div style={{ background: 'var(--card)', border: '1px solid var(--brd)', borderRadius: 8, padding: '10px 10px' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--red)', marginBottom: 8 }}>
                    Where {currentComp.split(' ')[0]} falls short
                  </div>
                  {compData.weaknesses?.map((w, i) => (
                    <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 6 }}>
                      <span style={{ color: 'var(--red)', fontSize: 8, marginTop: 3, flexShrink: 0, fontWeight: 900 }}>●</span>
                      <span style={{ fontSize: 11, color: 'var(--txt2)', lineHeight: 1.45 }}>{w}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'var(--card)', border: '1px solid var(--brd)', borderRadius: 8, padding: '10px 10px' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--green)', marginBottom: 8 }}>
                    Where NinjaOne wins
                  </div>
                  {compData.ninja_wins?.map((w, i) => (
                    <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 6 }}>
                      <span style={{ color: 'var(--green)', fontSize: 8, marginTop: 3, flexShrink: 0, fontWeight: 900 }}>●</span>
                      <span style={{ fontSize: 11, color: 'var(--txt2)', lineHeight: 1.45 }}>{w}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Objections */}
              {compData.objections?.length > 0 && (
                <>
                  <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--txt3)', marginBottom: 8 }}>
                    Objection handling
                  </div>
                  {compData.objections.map((obj, i) => (
                    <div key={i} style={{ border: '1px solid var(--brd)', borderRadius: 8, marginBottom: 6, overflow: 'hidden' }}>
                      <button
                        onClick={() => setOpenObj(openObj === i ? null : i)}
                        style={{
                          width: '100%', textAlign: 'left', padding: '9px 12px', cursor: 'pointer',
                          background: openObj === i ? 'var(--card2)' : 'var(--card)', border: 'none',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6
                        }}
                      >
                        <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--txt)', lineHeight: 1.4, flex: 1 }}>{obj.q}</span>
                        <span style={{ color: 'var(--txt3)', fontSize: 9, flexShrink: 0, marginTop: 2 }}>{openObj === i ? '▲' : '▼'}</span>
                      </button>
                      {openObj === i && (
                        <div style={{ padding: '10px 12px', borderTop: '1px solid var(--brd)', background: 'var(--bg)' }}>
                          {obj.a.split(/(?<=\.)\s+(?=[A-Z])/).map((sentence, si) => (
                            <div key={si} style={{ display: 'flex', gap: 7, alignItems: 'flex-start', marginBottom: 5 }}>
                              <span style={{ color: 'var(--acc)', fontSize: 8, marginTop: 3, flexShrink: 0, fontWeight: 900 }}>●</span>
                              <span style={{ fontSize: 11, color: 'var(--txt2)', lineHeight: 1.5 }}>{sentence.trim()}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          ) : (
            <div style={{ padding: 20, color: 'var(--txt2)', fontSize: 12 }}>
              No competitors found for this product
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

function CoachRow({ label, text, italic, small }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--txt2)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: small ? 11 : 12, color: 'var(--txt2)', lineHeight: 1.5, fontStyle: italic ? 'italic' : 'normal' }}>{text}</div>
    </div>
  )
}
