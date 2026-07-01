// ── Pain keywords ─────────────────────────────────────────────────────────
const KEYWORDS = [
  'manual', 'manually', 'slow', 'slowness', 'broken', 'patch', 'patching',
  'breach', 'breached', 'compliance', 'risk', 'outage', 'downtime',
  'frustrated', 'frustrating', 'multiple tools', 'no visibility', 'security',
  'vulnerability', 'vulnerable', 'expensive', 'difficult', 'problem', 'issue',
  'pain', 'challenge', 'legacy', 'outdated', 'contract ends', 'renewal',
  'switching', 'migrate', 'migration', 'budget', 'scattered', 'inconsistent',
  'unreliable', 'maintenance', 'time consuming', 'alert fatigue', 'reactive',
  'spreadsheet', 'ticket', 'backlog', 'overwhelmed', 'understaffed',
  'audit', 'reporting', 'no insight', 'blind spot', 'gaps', 'gap',
  'too many', 'consolidate', 'streamline', 'automate', 'manual process',
  'can\'t see', 'can\'t track', 'no control', 'losing control'
]

// ── Qualification score (0–100) ────────────────────────────────────────────
export function computeQualScore (qual) {
  if (!qual) return 0
  let pts = 0

  if (qual.prospectType)                    pts += 5
  if (qual.prospectType === 'it')           pts += 10
  if (qual.cloudOk === 'yes')              pts += 10
  if (qual.cloudFrankfurt === 'yes')       pts += 5
  if (qual.decisionMaker === 'dm')         pts += 15
  else if (qual.decisionMaker === 'influencer') pts += 5
  if (qual.nameCorrect === 'confirmed')    pts += 5
  if (qual.emailCorrect === 'confirmed')   pts += 5
  if (qual.endpoints?.trim())              pts += 10
  if (qual.timeline?.trim())               pts += 10
  if (qual.useCase?.trim())                pts += 15

  const filled = Object.values(qual.tools || {}).filter(v => v?.trim()).length
  pts += Math.min(filled * 2, 16)

  return Math.round(Math.min((pts / 106) * 100, 100))
}

// ── Pain score from notes (0–100) ─────────────────────────────────────────
export function computePainScore (notes) {
  if (!notes?.trim()) return 0
  const text = notes.toLowerCase()

  // Length component (0–15 pts)
  const len = text.length
  const lenPts = len > 300 ? 15 : len > 150 ? 10 : len > 50 ? 5 : 0

  // Keyword component (0–20 pts)
  const hits = new Set(KEYWORDS.filter(kw => text.includes(kw)))
  const kwPts = Math.min(hits.size * 2, 20)

  return Math.round(Math.min(((lenPts + kwPts) / 35) * 100, 100))
}

// ── Combined call quality score (0–100) ───────────────────────────────────
export function computeCallScore (qual, notes) {
  const q = computeQualScore(qual)
  const p = computePainScore(notes)
  return Math.round(q * 0.6 + p * 0.4)
}

// ── Score display helpers ─────────────────────────────────────────────────
export function scoreColor (score) {
  if (score >= 71) return 'var(--green)'
  if (score >= 41) return 'var(--amber)'
  return 'var(--red)'
}

export function scoreLabel (score) {
  if (score >= 71) return 'Strong'
  if (score >= 41) return 'Fair'
  return 'Weak'
}
