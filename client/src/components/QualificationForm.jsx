import { useState, useEffect, useRef } from 'react'
import { api } from '../api/index.js'
import MultiSelect from './MultiSelect.jsx'

const USE_CASE_OPTIONS = [
  'Patching compliance gaps','Consolidate from multiple tools','Remote workforce management',
  'Security posture improvement','Cyber Essentials certification','Reducing ticket volume',
  'Automating repetitive IT tasks','Improving device visibility','Cost reduction / budget optimisation',
  'MSP service delivery platform','NIS2 / DORA compliance','Onboarding / offboarding automation',
  'Reducing manual patching effort','Faster incident response',
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

export const EMPTY_QUAL = {
  prospectType: null, usesMsp: null, mspPartner: '',
  cloudOk: null, cloudFrankfurt: null,
  endpoints: '', implTime: '',
  nameCorrect: null, emailCorrect: null, decisionMaker: null,
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
  return {
    ...EMPTY_QUAL, ...saved,
    tools: {
      rmm:              normTool(r.rmm),
      ticketing:        normTool(r.ticketing),
      backup:           normTool(r.backup),
      saasBackup:       normTool(r.saasBackup),
      remoteAccess:     normTool(r.remoteAccess),
      patching:         normTool(r.patching || r.thirdPartyPatching),
      documentation:    normTool(r.documentation),
      mdm:              normTool(r.mdm),
      networkMonitoring:normTool(r.networkMonitoring || r.monitoring),
      antivirus:        normTool(r.antivirus || r.avEdr),
      itsm:             normTool(r.itsm),
      dns:              normTool(r.dns),
      productivity:     normTool(r.productivity),
      identity:         normTool(r.identity),
      networkHardware:  normTool(r.networkHardware),
    },
    useCase: Array.isArray(saved.useCase) ? saved.useCase : (saved.useCase ? [saved.useCase] : []),
    mobileIos:     saved.mobileIos     || '',
    mobileAndroid: saved.mobileAndroid || '',
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
    const rmmTools = (form.tools?.rmm || []).map(v => v.toLowerCase())
    const mdmTools = (form.tools?.mdm || []).map(v => v.toLowerCase())
    const noRmm    = rmmTools.length === 0 || rmmTools.some(v => v.includes('no rmm'))
    const hasPRTG  = rmmTools.some(v => v.includes('prtg'))
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

  const basicPricingInfo = getBasicPricingInfo(form)
  const disqComplete = form.cloudOk !== null
    && (form.cloudOk === 'no' || form.cloudFrankfurt !== null)
    && form.endpoints.trim() !== ''

  const [showDNB, setShowDNB] = useState(false)
  function handleDM(val) { set('decisionMaker', val); if (val === 'no') setShowDNB(true) }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', background: 'var(--bg)', position: 'relative' }}>

      {/* Do Not Book popup */}
      {showDNB && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(4,6,18,0.78)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
          <div style={{ background: '#0F1628', border: '2px solid var(--red)', borderRadius: 16, padding: '32px 28px', maxWidth: 360, textAlign: 'center', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🚫</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--red)', marginBottom: 10 }}>Do Not Book</div>
            <div style={{ fontSize: 13, color: 'var(--txt2)', lineHeight: 1.6, marginBottom: 24 }}>
              The contact is not the decision maker. Do not book a demo without the DM present or a confirmed path to the DM.
            </div>
            <button onClick={() => setShowDNB(false)} style={{ background: 'var(--red2)', color: 'var(--red)', border: '1px solid var(--red)', borderRadius: 9, padding: '10px 28px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Understood
            </button>
          </div>
        </div>
      )}

      {/* 1 — Prospect type */}
      <Block title="Prospect type">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <Label text="MSP OR INTERNAL IT?" />
            <BtnGroup value={form.prospectType} onChange={v => set('prospectType', v)} options={[
              { value: 'msp', label: 'MSP',         bg: 'var(--blue2)', color: 'var(--blue)', brd: 'var(--blue)' },
              { value: 'it',  label: 'Internal IT', bg: 'var(--acc2)',  color: 'var(--acc)',  brd: 'var(--acc)'  }
            ]} />
          </div>
          {basicPricingInfo && (
            <div style={{ marginTop: 15, flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--amber2)', border: '1px solid var(--amber)', borderRadius: 8, padding: '7px 12px', fontSize: 12, color: 'var(--amber)', fontWeight: 600, lineHeight: 1.4 }}>
              <span style={{ fontSize: 14 }}>⚡</span>
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

      {/* 2 — Confirm from CRM */}
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
            <Label text="DECISION MAKER IN IT?" />
            <BtnGroup value={form.decisionMaker} onChange={handleDM} options={[
              { value: 'dm',         label: 'Yes — DM',   bg: 'var(--green2)', color: 'var(--green)', brd: 'var(--green)' },
              { value: 'no',         label: 'No',         bg: 'var(--red2)',   color: 'var(--red)',   brd: 'var(--red)'   },
              { value: 'influencer', label: 'Influencer', bg: 'var(--amber2)', color: 'var(--amber)', brd: 'var(--amber)' }
            ]} />
          </div>
        </div>
      </Block>

      {/* 3 — Disqualifiers (RED) */}
      <div style={{ background: 'rgba(239,68,68,0.06)', border: '1.5px solid var(--red)', borderRadius: 10, padding: '14px 16px', marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--red)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          ⚠ Disqualifiers — check first
          {disqComplete
            ? <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--green)', background: 'var(--green2)', padding: '2px 8px', borderRadius: 999 }}>✓ Done</span>
            : <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--red)', background: 'var(--red2)', padding: '2px 8px', borderRadius: 999 }}>Complete to unlock form</span>
          }
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
            <div><div style={{ fontSize: 10, color: 'var(--txt3)', marginBottom: 4 }}>iOS devices</div><input className="input" value={form.mobileIos} onChange={e => set('mobileIos', e.target.value)} placeholder="e.g. 50" style={{ fontSize: 13, padding: '9px 12px' }} /></div>
            <div><div style={{ fontSize: 10, color: 'var(--txt3)', marginBottom: 4 }}>Android devices</div><input className="input" value={form.mobileAndroid} onChange={e => set('mobileAndroid', e.target.value)} placeholder="e.g. 30" style={{ fontSize: 13, padding: '9px 12px' }} /></div>
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <Label text="IMPLEMENTATION TIME (WEEKS)" />
          <select className="input" value={form.implTime || ''} onChange={e => set('implTime', e.target.value)} style={{ fontSize: 13, padding: '9px 12px', cursor: 'pointer' }}>
            <option value="">Select timeframe…</option>
            <option value="0–3 weeks">0–3 weeks</option>
            <option value="3–6 weeks">3–6 weeks</option>
            <option value="6–9 weeks">6–9 weeks</option>
            <option value="9–12 weeks">9–12 weeks</option>
            <option value="12+ weeks">12+ weeks</option>
          </select>
        </div>
      </div>

      {/* 4 + 5 — Blurred until disqualifiers complete */}
      <div style={{ filter: disqComplete ? 'none' : 'blur(3px)', pointerEvents: disqComplete ? 'auto' : 'none', userSelect: disqComplete ? 'auto' : 'none', transition: 'filter 0.3s ease', position: 'relative' }}>
        {!disqComplete && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--red)', borderRadius: 10, padding: '10px 20px', fontSize: 12, color: 'var(--red)', fontWeight: 600 }}>
              ⚠ Complete the Disqualifiers section first
            </div>
          </div>
        )}

        <Block title="Qualification">
          <div style={{ marginBottom: 10 }}>
            <Label text="TIMELINE / CONTRACT END" />
            <input className="input" value={form.timeline} onChange={e => set('timeline', e.target.value)} placeholder="e.g. Q3 — contract ends Aug" style={{ fontSize: 13, padding: '9px 12px' }} />
          </div>
          <div style={{ position: 'relative' }}>
            <Label text="USE CASE — DEMO HOOK" />
            <MultiSelect value={form.useCase} onChange={v => set('useCase', v)} options={USE_CASE_OPTIONS} placeholder="Select use cases…" color="var(--acc)" />
          </div>
        </Block>

        <Block title="Current tool stack">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { k: 'rmm',              l: 'RMM Tools',          c: 'var(--purple)' },
              { k: 'ticketing',        l: 'PSA / Ticketing',    c: 'var(--amber)'  },
              { k: 'backup',           l: 'Backup',             c: 'var(--green)'  },
              { k: 'saasBackup',       l: 'SaaS Backup',        c: 'var(--green)'  },
              { k: 'remoteAccess',     l: 'Remote Access',      c: 'var(--acc)'    },
              { k: 'patching',         l: 'Patch Management',   c: 'var(--blue)'   },
              { k: 'documentation',    l: 'Documentation',      c: 'var(--amber)'  },
              { k: 'mdm',              l: 'MDM',                c: 'var(--coral)'  },
              { k: 'networkMonitoring',l: 'Network Monitoring', c: 'var(--blue)'   },
              { k: 'antivirus',        l: 'Anti Virus / EDR',   c: 'var(--red)'    },
              { k: 'itsm',             l: 'ITSM',               c: 'var(--purple)' },
              { k: 'dns',              l: 'DNS Tool',           c: 'var(--acc)'    },
              { k: 'productivity',     l: 'Productivity',       c: 'var(--blue)'   },
              { k: 'identity',         l: 'Identity',           c: 'var(--amber)'  },
              { k: 'networkHardware',  l: 'Network Hardware',   c: 'var(--coral)'  },
            ].map(({ k, l, c }) => (
              <div key={k} style={{ position: 'relative' }}>
                <Label text={l} />
                <MultiSelect value={form.tools[k]} onChange={v => setTool(k, v)} options={TOOL_OPTIONS[k]} placeholder="Select or type…" color={c} />
              </div>
            ))}
          </div>
        </Block>
      </div>

    </div>
  )
}

function Block({ title, children }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--brd)', borderRadius: 10, padding: '14px 16px', marginBottom: 10 }}>
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
