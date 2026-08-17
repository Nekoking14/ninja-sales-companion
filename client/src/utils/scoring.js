// ── New scoring system (100 points total) ──────────────────────────────────
//
//  Base qualification   30 pts  (core fields completed)
//  Use case             10 pts  (at least one use case selected)
//  Tool stack           10 pts  (tools filled in)
//  Situation            15 pts  (SPIN — situation captured)
//  Pain                 15 pts  (SPIN — pain identified)
//  Implication          20 pts  (SPIN — implication explored)
//  ─────────────────────────────────────────────────────
//  Total               100 pts

export function computeQualScore(qual) {
  if (!qual) return 0
  let pts = 0

  // ── Base qualification (30 pts) ───────────────────────────────────────────
  if (qual.prospectType)                        pts += 3
  if (qual.cloudOk === 'yes')                   pts += 4
  if (qual.cloudFrankfurt === 'yes')            pts += 3
  if (qual.endpoints?.trim())                   pts += 5
  if (qual.decisionMaker === 'dm')              pts += 8
  else if (qual.decisionMaker === 'influencer') pts += 4
  if (qual.nameCorrect === 'confirmed')         pts += 3
  if (qual.emailCorrect === 'confirmed')        pts += 2
  if (qual.timeline?.trim())                    pts += 2

  // ── Use case (10 pts) ─────────────────────────────────────────────────────
  const useCaseLen = Array.isArray(qual.useCase) ? qual.useCase.length : (qual.useCase ? 1 : 0)
  if (useCaseLen > 0) pts += 10

  // ── Tool stack (10 pts) ───────────────────────────────────────────────────
  const filledTools = Object.values(qual.tools || {}).filter(v =>
    Array.isArray(v) ? v.length > 0 : (v?.trim() && v !== 'None')
  ).length
  if (filledTools >= 3)      pts += 10
  else if (filledTools >= 1) pts += Math.round(filledTools * 3.3)

  // ── SPIN discovery (50 pts) ───────────────────────────────────────────────
  if (qual.spinSituation)  pts += 15
  if (qual.spinPain)       pts += 15
  if (qual.spinImplication) pts += 20

  return Math.round(Math.min(pts, 100))
}

// ── Combined call quality score (same as qual score now) ──────────────────
export function computeCallScore(qual) {
  return computeQualScore(qual)
}

// ── Display helpers ────────────────────────────────────────────────────────
export function scoreColor(score) {
  if (score >= 71) return 'var(--green)'
  if (score >= 41) return 'var(--amber)'
  return 'var(--red)'
}

export function scoreLabel(score) {
  if (score >= 71) return 'Strong'
  if (score >= 41) return 'Fair'
  return 'Weak'
}
