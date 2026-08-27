import { useState, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { api } from '../api/index.js'
import MultiSelect from './MultiSelect.jsx'

const PERSONA_PRESETS = ['Head of IT', 'IT Manager', 'Service Desk', 'SysAdmin', 'Technician', 'C-Level']

const USE_CASE_OPTIONS = [
  'Patching compliance gaps','Reducing manual patching effort',
  'Vulnerability management','MDM','Software deployment',
  'Backup','IT documentation','Ticketing',
  'Consolidate from multiple tools','Remote workforce management',
  'Cyber Essentials certification','Automating repetitive IT tasks',
  'Improving device visibility','Cost reduction / budget optimisation',
  'MSP service delivery platform','NIS2 / DORA compliance','Faster incident response',
]

const TOOL_OPTIONS = {
  rmm: ['ACMP','Acronis','Action1','Addigy','Atera','Automox','Baramundi','Barracuda Managed Workplace','BigFix','Comodo One','ConnectWise Automate','ConnectWise RMM','Datto RMM','Faronics','FreshService','GoTo','Goverlan','ITarian','Ivanti','Jamf Pro','Kabuto','Kaseya VSA','Lansweeper','Level.io','LogMeIn','ManageEngine Endpoint Central','ManageEngine RMM','Matrix42','Meraki','Microsoft Intune','Microsoft SCCM','Microsoft Intune + SCCM','N-Able N-Central','N-Able RMM','Naverisk','Nexthink','NinjaRMM','No RMM Tool','Optitune','PacketTrap MSP','PDQ','Pulseway','Quest KACE','RG System','Riverbird','ServerEye','Sixsense','SolarWinds Orion','Spiceworks','SuperOps.ai','Supremo','SyncroMSP','Sysaid','Tanium'],
  ticketing: ['Accelo','ARTIS','Atera','Autotask','BlueFolder','BMC','Centron','CommitCRM','Computicate','ConnectWise Manage','Devrev.ai','Email','EzPSA','FreshService / FreshDesk','HaloPSA','HarmonyPSA','HelpDesk','In-House','Jira','Kaseya BMS','Kayako','Lansweeper','ManageEngine Service Desk Plus','N-Able MSP Manager','Ninja Ticketing','OTRS','PromysPSA','Remedy ITSM','RepairShopr','Salesforce Service Cloud','SchoolDude','ServiceNow','Sherpadesk','SolarWinds Service Desk','SolarWinds WebHelpDesk','Spiceworks','SuperOps.ai','Syncro','Sysaid','TANSS','Tigerpaw','TopDesk','Vorex','Zendesk','Zoho Desk','HappyFox','Rezolve.ai'],
  backup: ['Acronis','AFI.ai','Ahsay','Amazon AWS','Appassure','Arcserve','Asigra','AvePoint','Axcient','Azure','BackBlaze','BackupAssist','Backup Exec','Barracuda','Beemo','Box','Carbonite','Cloud Ally','Cohesity','Comet','Commvault','Crashplan','Ctera','Datto','Dell Avamar','Did Not Disclose','Dropsuite','Druva','Evault','Gigasoft','Google Cloud','Google Drive','HornetSecurity','HYCU','Hyperoo','iDrive','Infrascale','Intronis','Iperius','Macrium','MagnusBox','Matrix42','MSP360','N-Able Backup','Nakivo','Ninja Backup','No Backup','Nordic Backup','NovaStor','OneDrive','Other','Proxmox','Qnap','Quest Rapid Recovery','Redstore','Replibit','Rubrik','Servosity','ShadowCradle','SkyKick','Slide','SOS','Spanning','Stage2','Storagecraft','Synology','Terra Cloud','Unitrends','UrBackup','Veeam','Vembu','Wasabi','Zerto','Zetta'],
  saasBackup: ['Acronis','AFI.ai','Ahsay','Amazon AWS','Appassure','Arcserve','Asigra','AvePoint','Axcient','Azure','BackBlaze','BackupAssist','Backup Exec','Barracuda','Beemo','Box','Carbonite','Cloud Ally','Cohesity','Comet','Commvault','Crashplan','Ctera','Datto','Dell Avamar','Did Not Disclose','Dropsuite','Druva','Evault','Gigasoft','Google Cloud','Google Drive','HornetSecurity','HYCU','Hyperoo','iDrive','Infrascale','Intronis','Iperius','Macrium','MagnusBox','Matrix42','MSP360','N-Able Backup','Nakivo','Ninja Backup','No Backup','Nordic Backup','NovaStor','OneDrive','Other','Proxmox','Qnap','Quest Rapid Recovery','Redstore','Replibit','Rubrik','Servosity','ShadowCradle','SkyKick','Slide','SOS','Spanning','Stage2','Storagecraft','Synology','Terra Cloud','Unitrends','UrBackup','Veeam','Vembu','Wasabi','Zerto','Zetta'],
  remoteAccess: ['AnyDesk','Avast Remote Control','Beyond Trust Remote Support','Bomgar','ConnectWise Control (ScreenConnect)','ConnectWise Control + Backstage','Dameware','FastViewer','GoToAssist','ISL Online','Join.me','LogMeIn','N-Able TakeControl','Ninja Remote','Other','PC Visit','RDP','Remote PC','Splashtop','TeamViewer','UltraVNC','VNC Connect','Zoho Assist'],
  patching: ['Action1','Automox','Chocolatey','Did Not Disclose','GoverLan','Homebrew','Intune','Ivanti','Matrix42','Microsoft SCCM','Ninite','NinjaOne','No Patch Management Tool','PatchMyPC','Qualys','SolarWinds Patch Manager','Sysaid','Tanium','TeamViewer','Tenable','WSUS'],
  documentation: ['Atlassian / Confluence / Jira','Clickup','ConnectWise Manage','Document360','Documentation Tool Built into RMM','Documentation in PSA / Ticketing','Docusnap','DokuWiki','Freshdesk / Freshservice','Google Workspace','HUDU','In-House Tool','IT Boost','IT Glue','IT Portal','Keeper','M365 / SharePoint / OneNote','MediaWiki','Ninja Documentation','No Documentation Tool','Notion','Other','Passportal'],
  mdm: ['42 Gears SureMDM','Addigy','Apptec','Citrix Endpoint Management','Cortado','Did Not Disclose','ESET iOS MDM','Esper','Fleetsmith','Google Workspace','Hexnode','IBM Maas360','Iru','Ivanti MDM','JAMF','JumpCloud','KACE Cloud MDM','Kaspersky','ManageEngine MDM Plus','Meraki System Manager','Microsoft Intune','Miradore','MobileIron','Mosyle','No MDM','Other','Relution','Rippling','Samsung Knox','Scalefusion','SecurePoint','Securly','SimpleMDM','SolarWinds MDM','Sophos','Sophos Mobile Control','SOTI MobiControl','Verizon','VMware Airwatch','Workspace ONE'],
  networkMonitoring: ['Auvik','Catchpoint','Datadog','Domotz','Entuity','In-House','Kentik','Logic Monitor','ManageEngine OpManager','Micro Focus','Microsoft System Center','Nagios','Ninja Network Monitoring','No Network Monitoring','Other','PRTG','SolarWinds NPM','WhatsUp Gold','Wireshark','Zabbix'],
  antivirus: ['Avast','AVG','Bitdefender','Carbon Black','Cisco Secure Endpoint','CrowdStrike Falcon','Cylance','ESET','F-Secure','Kaspersky','Malwarebytes','McAfee','Microsoft Defender','No AV Tool','Panda','Sentinel Agent','SentinelOne','Sophos','Symantec','Trend Micro','Webroot','Windows Defender'],
  itsm: ['BMC','Cherwell','Freshservice','Halo','Hornbill','In-House Tool','Jira','No ITSM','Other','PagerDuty','Salesforce','ServiceNow','SysAid','TeamDynamix','Zendesk'],
  dns: ['Bitdefender DNS','Cisco OpenDNS','No DNS Tool','Other','Proofpoint','Quad9','Webroot DNS'],
  productivity: ['Google Workspace','Microsoft 365'],
  identity: ['Active Directory Federation Services (ADFS)','Auth0','Azure AD','CyberArk','Duo','ESET','ForgeRock','IBM Security Verify','JumpCloud','MicroFocus NetIQ','No Identity Provider','Office 365','Okta','OneLogin','Oracle Access Management'],
  networkHardware: ['Aruba','Cisco','Cisco Meraki','DrayTek','Extreme Networks','Fortinet','HPE','Juniper','Netgear','No Specific Vendor','Other','Palo Alto','Ubiquiti','Zyxel'],
}

const EMPTY_QUAL = {
  accountName: '', callType: null,
  persona: '',
  prospectType: null, usesMsp: null, mspPartner: '', mspInhouse: null, mspInhouseWhy: '',
  cloudOk: null, cloudFrankfurt: null,
  endpoints: '',
  nameCorrect: null, decisionMaker: null,
  mobileIos: '', mobileAndroid: '',
  timeline: '', useCase: [], msp: '',
  tools: {
    rmm: [], ticketing: [], backup: [], saasBackup: [],
    remoteAccess: [], patching: [], documentation: [],
    mdm: [], networkMonitoring: [], antivirus: [],
    itsm: [], dns: [], productivity: [], identity: [], networkHardware: []
  }
}

function normTool(v) {
  if (Array.isArray(v)) return v
  if (v && typeof v === 'string' && v.trim() && v !== 'None') return [v]
  return []
}

function normalise(saved) {
  if (!saved) return EMPTY_QUAL
  const r = saved.tools || {}
  // Strip note fields — owned exclusively by RightPanel, never loaded into form
  const { notesSituation, notesPain, notesImplication, notes, ...qualData } = saved
  return {
    ...EMPTY_QUAL, ...qualData,
    tools: {
      rmm:               normTool(r.rmm),
      ticketing:         normTool(r.ticketing),
      backup:            normTool(r.backup),
      saasBackup:        normTool(r.saasBackup),
      remoteAccess:      normTool(r.remoteAccess),
      patching:          normTool(r.patching || r.thirdPartyPatching),
      documentation:     normTool(r.documentation),
      mdm:               normTool(r.mdm),
      networkMonitoring: normTool(r.networkMonitoring || r.monitoring),
      antivirus:         normTool(r.antivirus || r.avEdr),
      itsm:              normTool(r.itsm),
      dns:               normTool(r.dns),
      productivity:      normTool(r.productivity),
      identity:          normTool(r.identity),
      networkHardware:   normTool(r.networkHardware),
    },
    accountName:     saved.accountName     || '',
    callType:        saved.callType        || null,
    persona:         saved.persona         || '',
    useCase:         Array.isArray(saved.useCase) ? saved.useCase : (saved.useCase ? [saved.useCase] : []),
    mspInhouse:      saved.mspInhouse      ?? null,
    mspInhouseWhy:   saved.mspInhouseWhy   || '',
    mobileIos:       saved.mobileIos       || '',
    mobileAndroid:   saved.mobileAndroid   || '',
  }
}

const MSP_STANDARD_RMMS = ['datto','n-able','solarwinds','connectwise','kaseya','atera','manageengine endpoint central','endpoint central','prtg','action1','syncromsp','pulseway','matrix42','naverisk','barracuda','superops','rg system','servereye','riverbird']
const QUALIFYING_MDMS   = ['jamf','manage engine','manageengine']

function getBasicPricingInfo(form) {
  if (!form.prospectType) return null
  if (form.prospectType === 'it') {
    const eps = parseInt(form.endpoints || '0', 10)
    if (eps > 0 && eps < 50) return { note: `${eps} endpoints — book as basic` }
    return null
  }
  if (form.prospectType === 'msp') {
    const rmmTools  = (form.tools?.rmm || []).map(v => v.toLowerCase())
    const mdmTools  = (form.tools?.mdm || []).map(v => v.toLowerCase())
    const noRmm     = rmmTools.length === 0 || rmmTools.some(v => v.includes('no rmm'))
    const hasPRTG   = rmmTools.some(v => v.includes('prtg'))
    const hasStdRmm = !noRmm && rmmTools.some(t => MSP_STANDARD_RMMS.some(s => t.includes(s) || s.includes(t)))
    const hasStdMdm = mdmTools.some(t => QUALIFYING_MDMS.some(s => t.includes(s)))
    if (!hasStdRmm && !hasStdMdm) {
      const eps  = parseInt(form.endpoints || '0', 10)
      const note = noRmm ? 'No RMM — book as 0/49'
        : hasPRTG && eps > 0 ? `PRTG: ${eps} eps ÷ 5 = ${Math.round(eps / 5)} for pricing`
        : 'Non-standard RMM — book as 0/49'
      return { note }
    }
    return null
  }
  return null
}

export default function QualificationForm({ session, prospect }) {
  const { state, dispatch } = useApp()
  const { callType } = state
  const key = `qual_${session?.id || prospect?.id || 'draft'}`

  const [form, setForm] = useState(() => {
    try { return normalise(JSON.parse(localStorage.getItem(key))) }
    catch { return EMPTY_QUAL }
  })

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key))
      const f = normalise(saved)
      // Sync callType from AppContext into form
      setForm({ ...f, callType: callType || f.callType || null })
    }
    catch { setForm({ ...EMPTY_QUAL, callType: callType || null }) }
  }, [key, callType])

  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem(key)) || {}
      // form never contains note fields (stripped in normalise)
      // so ...form cannot overwrite notes that RightPanel saved
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

  // When accountName changes, update the prospect record so sessions show the right name
  const prospectDebounce = useRef(null)
  function setAccountName(val) {
    set('accountName', val)
    // Update AppContext so topbar shows new name instantly
    if (prospect?.id) {
      dispatch({ type: 'UPDATE_PROSPECT', payload: { name: val || 'New Prospect', company: val || '' } })
    }
    // Sync to API with debounce
    clearTimeout(prospectDebounce.current)
    prospectDebounce.current = setTimeout(() => {
      if (prospect?.id && val?.trim()) {
        api.prospects.update(prospect.id, { name: val.trim(), company: val.trim(), callType: prospect?.callType }).catch(() => {})
      }
    }, 800)
  }
  const setTool = (f, v) => setForm(p => ({ ...p, tools: { ...p.tools, [f]: v } }))

  function setPersona(p) {
    set('persona', p)
    dispatch({ type: 'SET_PERSONA', payload: p })
  }

  const basicPricingInfo = getBasicPricingInfo(form)
  const [showDNB,    setShowDNB]    = useState(false)
  const [showMspDNB, setShowMspDNB] = useState(false)
  function handleDM(val)         { set('decisionMaker', val); if (val === 'no') setShowDNB(true) }
  function handleMspInhouse(val) { set('mspInhouse', val);    if (val === 'no') setShowMspDNB(true) }

  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px 20px', background: 'var(--bg)', position: 'relative' }}>

      {/* Do Not Book popups */}
      {showDNB && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(4,6,18,0.78)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
          <div style={{ background: '#0F1628', border: '2px solid var(--red)', borderRadius: 16, padding: '32px 28px', maxWidth: 360, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🚫</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--red)', marginBottom: 10 }}>Do Not Book</div>
            <div style={{ fontSize: 13, color: 'var(--txt2)', lineHeight: 1.6, marginBottom: 24 }}>
              Not the decision maker. Do not book without the DM present.
            </div>
            <button onClick={() => setShowDNB(false)} style={{ background: 'var(--red2)', color: 'var(--red)', border: '1px solid var(--red)', borderRadius: 9, padding: '10px 28px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Understood</button>
          </div>
        </div>
      )}
      {showMspDNB && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(4,6,18,0.78)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
          <div style={{ background: '#0F1628', border: '2px solid var(--amber)', borderRadius: 16, padding: '32px 28px', maxWidth: 360, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--amber)', marginBottom: 10 }}>MSP — Do Not Book</div>
            <div style={{ fontSize: 13, color: 'var(--txt2)', lineHeight: 1.6, marginBottom: 24 }}>
              They plan to keep using their MSP. No direct path to NinjaOne at this time.
            </div>
            <button onClick={() => setShowMspDNB(false)} style={{ background: 'var(--amber2)', color: 'var(--amber)', border: '1px solid var(--amber)', borderRadius: 9, padding: '10px 28px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Understood</button>
          </div>
        </div>
      )}

      {/* Account name */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--acc)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
          🏢 Account name
        </div>
        <input
          className="input"
          value={form.accountName}
          onChange={e => setAccountName(e.target.value)}
          placeholder="Company / account name…"
          style={{ fontSize: 14, padding: '10px 12px', fontWeight: 600 }}
        />
      </div>

      {/* Combined: Persona + CRM confirmation + Prospect type */}
      <Block title="Who are you speaking with?">

        {/* Persona */}
        <Label text="PERSONA" />
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 }}>
          {PERSONA_PRESETS.map(p => {
            const active = form.persona === p
            return (
              <button key={p} type="button" onClick={() => setPersona(active ? '' : p)} style={{
                padding: '6px 13px', borderRadius: 20, fontSize: 12,
                fontWeight: active ? 600 : 400,
                background: active ? 'var(--acc2)' : 'var(--card2)',
                color: active ? 'var(--acc)' : 'var(--txt2)',
                border: `1px solid ${active ? 'var(--acc)' : 'var(--brd2)'}`,
                transition: 'all 0.12s', cursor: 'pointer'
              }}>{p}</button>
            )
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '6px 0 8px' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--brd)' }} />
          <span style={{ fontSize: 10, color: 'var(--txt3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>or enter custom</span>
          <div style={{ flex: 1, height: 1, background: 'var(--brd)' }} />
        </div>
        <input
          className="input"
          value={PERSONA_PRESETS.includes(form.persona) ? '' : form.persona}
          onChange={e => setPersona(e.target.value)}
          placeholder="e.g. IT Director, Head of Infrastructure…"
          style={{ fontSize: 13, padding: '9px 12px', marginBottom: 14 }}
        />

        {/* CRM confirmation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
          <div>
            <Label text="NAME & TITLE CORRECT?" />
            <BtnGroup value={form.nameCorrect} onChange={v => set('nameCorrect', v)} options={[
              { value: 'confirmed', label: 'Confirmed',     bg: 'var(--green2)', color: 'var(--green)', brd: 'var(--green)' },
              { value: 'update',    label: 'Update needed', bg: 'var(--amber2)', color: 'var(--amber)', brd: 'var(--amber)' }
            ]} />
          </div>
          <div>
            <Label text="DECISION MAKER IN IT?" />
            <BtnGroup value={form.decisionMaker} onChange={handleDM} options={[
              { value: 'dm',         label: 'Yes — DM',   bg: 'var(--green2)', color: 'var(--green)', brd: 'var(--green)' },
              { value: 'no',         label: 'No',         bg: 'var(--red2)',   color: 'var(--red)',   brd: 'var(--red)'   },
              { value: 'influencer', label: 'Influencer', bg: 'var(--amber2)', color: 'var(--amber)', brd: 'var(--amber)' }
            ]} />
          </div>
        </div>

        {/* Prospect type */}
        <Label text="MSP OR INTERNAL IT?" />
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <BtnGroup value={form.prospectType} onChange={v => set('prospectType', v)} options={[
              { value: 'msp', label: 'MSP',         bg: 'var(--blue2)', color: 'var(--blue)', brd: 'var(--blue)' },
              { value: 'it',  label: 'Internal IT', bg: 'var(--acc2)',  color: 'var(--acc)',  brd: 'var(--acc)'  }
            ]} />
          </div>
          {basicPricingInfo && (
            <div style={{ marginTop: 2, flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--amber2)', border: '1px solid var(--amber)', borderRadius: 8, padding: '7px 12px', fontSize: 12, color: 'var(--amber)', fontWeight: 600 }}>
              <span>⚡</span>
              <div>
                <div>Basic Pricing</div>
                {basicPricingInfo.note && <div style={{ fontSize: 10, fontWeight: 400, opacity: 0.85 }}>{basicPricingInfo.note}</div>}
              </div>
            </div>
          )}
        </div>
        {form.prospectType === 'it' && (
          <div style={{ marginTop: 10 }}>
            <Label text="DO THEY USE AN MSP?" />
            <BtnGroup value={form.usesMsp} onChange={v => set('usesMsp', v)} options={[
              { value: 'yes', label: 'Yes — uses an MSP', bg: 'var(--amber2)', color: 'var(--amber)', brd: 'var(--amber)' },
              { value: 'no',  label: 'No — self-managed', bg: 'var(--green2)', color: 'var(--green)', brd: 'var(--green)' }
            ]} />
            {form.usesMsp === 'yes' && (
              <div style={{ marginTop: 8 }}>
                <Label text="MSP NAME" />
                <input className="input" value={form.mspPartner} onChange={e => set('mspPartner', e.target.value)} placeholder="e.g. Computacenter, SHI…" style={{ fontSize: 13, padding: '9px 12px' }} />
                <div style={{ marginTop: 10 }}>
                  <Label text="PLAN TO BRING IN-HOUSE?" />
                  <BtnGroup value={form.mspInhouse} onChange={handleMspInhouse} options={[
                    { value: 'yes', label: 'Yes', bg: 'var(--green2)', color: 'var(--green)', brd: 'var(--green)' },
                    { value: 'no',  label: 'No',  bg: 'var(--red2)',   color: 'var(--red)',   brd: 'var(--red)'   }
                  ]} />
                </div>
                {form.mspInhouse === 'yes' && (
                  <div style={{ marginTop: 8 }}>
                    <Label text="WHY?" />
                    <textarea className="input" value={form.mspInhouseWhy} onChange={e => set('mspInhouseWhy', e.target.value)} placeholder="Why bring IT in-house…" rows={3} style={{ fontSize: 13, padding: '9px 12px', resize: 'vertical', minHeight: 72, lineHeight: 1.5 }} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {form.prospectType === 'msp' && (
          <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--blue2)', borderRadius: 8, fontSize: 12, color: 'var(--blue)', lineHeight: 1.5 }}>
            MSP prospect — check if they manage endpoints for clients. Do NOT pursue direct sale. Mark as DNC in Salesforce.
          </div>
        )}
      </Block>

        <Block title="Qualification">
          <div style={{ marginBottom: 10 }}>
            <Label text="USE CASE — DEMO HOOK" />
            <MultiSelect value={form.useCase} onChange={v => set('useCase', v)} options={USE_CASE_OPTIONS} placeholder="Select use cases…" color="var(--acc)" />
          </div>
          <div>
            <Label text="TIMELINE / CONTRACT END" />
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 }}>
              {['1 month','1–3 months','3–6 months','6–12 months','12+ months'].map(opt => {
                const active = form.timeline === opt
                return (
                  <button key={opt} type="button" onClick={() => set('timeline', active ? '' : opt)} style={{
                    padding: '5px 11px', borderRadius: 20, fontSize: 11,
                    fontWeight: active ? 600 : 400,
                    background: active ? 'var(--acc2)' : 'var(--card2)',
                    color: active ? 'var(--acc)' : 'var(--txt2)',
                    border: `1px solid ${active ? 'var(--acc)' : 'var(--brd2)'}`,
                    transition: 'all 0.12s', cursor: 'pointer'
                  }}>{opt}</button>
                )
              })}
            </div>
            <input
              className="input"
              value={['1 month','1–3 months','3–6 months','6–12 months','12+ months'].includes(form.timeline) ? '' : form.timeline}
              onChange={e => set('timeline', e.target.value)}
              placeholder="Custom — e.g. contract ends Oct, 8 months…"
              style={{ fontSize: 13, padding: '9px 12px' }}
            />
          </div>
        </Block>

      {/* 3 — Disqualifiers */}
      <div style={{ background: 'rgba(239,68,68,0.06)', border: '1.5px solid var(--red)', borderRadius: 10, padding: '14px 16px', marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--red)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          ⚠ Disqualifiers — check first
        </div>
        <Label text="CLOUD OK?" />
        <BtnGroup value={form.cloudOk} onChange={v => set('cloudOk', v)} options={[
          { value: 'yes', label: 'Yes — cloud fine',      bg: 'var(--green2)', color: 'var(--green)', brd: 'var(--green)' },
          { value: 'no',  label: 'No — on-prem required', bg: 'var(--red2)',   color: 'var(--red)',   brd: 'var(--red)'   }
        ]} />
        {form.cloudOk === 'yes' && (
          <div style={{ marginTop: 10 }}>
            <Label text="CLOUD HOSTED IN FRANKFURT, EU — OK?" />
            <BtnGroup value={form.cloudFrankfurt} onChange={v => set('cloudFrankfurt', v)} options={[
              { value: 'yes', label: 'Yes — Frankfurt OK',      bg: 'var(--green2)', color: 'var(--green)', brd: 'var(--green)' },
              { value: 'no',  label: 'No — needs other region', bg: 'var(--amber2)', color: 'var(--amber)', brd: 'var(--amber)' }
            ]} />
          </div>
        )}
        <div style={{ marginTop: 10 }}>
          <Label text="NUMBER OF ENDPOINTS" />
          <input className="input" value={form.endpoints} onChange={e => set('endpoints', e.target.value)} placeholder="Enter number" style={{ fontSize: 13, padding: '9px 12px' }} />
        </div>
        <div style={{ marginTop: 8 }}>
          <Label text="MOBILE ENDPOINTS" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div><div style={{ fontSize: 10, color: 'var(--txt3)', marginBottom: 4 }}>iOS</div><input className="input" value={form.mobileIos} onChange={e => set('mobileIos', e.target.value)} placeholder="e.g. 50" style={{ fontSize: 13, padding: '9px 12px' }} /></div>
            <div><div style={{ fontSize: 10, color: 'var(--txt3)', marginBottom: 4 }}>Android</div><input className="input" value={form.mobileAndroid} onChange={e => set('mobileAndroid', e.target.value)} placeholder="e.g. 30" style={{ fontSize: 13, padding: '9px 12px' }} /></div>
          </div>
        </div>

      </div>


        <Block title="Current tool stack">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { k: 'rmm',               l: 'RMM Tools',          c: 'var(--purple)' },
              { k: 'ticketing',         l: 'PSA / Ticketing',    c: 'var(--amber)'  },
              { k: 'backup',            l: 'Backup',             c: 'var(--green)'  },
              { k: 'saasBackup',        l: 'SaaS Backup',        c: 'var(--green)'  },
              { k: 'remoteAccess',      l: 'Remote Access',      c: 'var(--acc)'    },
              { k: 'patching',          l: 'Patch Management',   c: 'var(--blue)'   },
              { k: 'documentation',     l: 'Documentation',      c: 'var(--amber)'  },
              { k: 'mdm',               l: 'MDM',                c: 'var(--coral)'  },
              { k: 'networkMonitoring', l: 'Network Monitoring', c: 'var(--blue)'   },
              { k: 'antivirus',         l: 'Anti Virus / EDR',   c: 'var(--red)'    },
              { k: 'itsm',              l: 'ITSM',               c: 'var(--purple)' },
              { k: 'dns',               l: 'DNS Tool',           c: 'var(--acc)'    },
              { k: 'productivity',      l: 'Productivity',       c: 'var(--blue)'   },
              { k: 'identity',          l: 'Identity',           c: 'var(--amber)'  },
              { k: 'networkHardware',   l: 'Network Hardware',   c: 'var(--coral)'  },
            ].map(({ k, l, c }) => (
              <div key={k} style={{ position: 'relative' }}>
                <Label text={l} />
                <MultiSelect value={form.tools[k]} onChange={v => setTool(k, v)} options={TOOL_OPTIONS[k]} placeholder="Select or type…" color={c} />
              </div>
            ))}
          </div>
        </Block>
    </div>
  )
}

function Block({ title, children }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--brd)', borderRadius: 10, padding: '14px 16px', marginBottom: 14 }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--txt3)', marginBottom: 12 }}>{title}</div>
      {children}
    </div>
  )
}
function Label({ text }) {
  return <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--txt3)', marginBottom: 5 }}>{text}</div>
}
function BtnGroup({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {options.map(opt => {
        const active = value === opt.value
        return (
          <button key={opt.value} type="button" onClick={() => onChange(active ? null : opt.value)} style={{ flex: 1, padding: '8px 10px', borderRadius: 8, fontSize: 12, fontWeight: active ? 600 : 400, background: active ? opt.bg : 'var(--card2)', color: active ? opt.color : 'var(--txt2)', border: `1px solid ${active ? opt.brd : 'var(--brd2)'}`, transition: 'all 0.12s', cursor: 'pointer' }}>
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
