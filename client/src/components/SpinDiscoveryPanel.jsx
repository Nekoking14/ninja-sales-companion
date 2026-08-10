import { useState, useMemo } from 'react'
import { SPIN_DISCOVERY } from '../data/spinDiscoveryData.js'

const PRODUCTS = ['Backup', 'IT Asset Mgmt', 'M365 Backup', 'MDM', 'Ticketing', 'Vuln. Manager']

const SCENARIOS = ['Situation', 'Problem', 'Implication', 'Need-Payoff', 'Book demo']

const SCENARIO_LABEL = {
  'Situation':   'S — Situation',
  'Problem':     'P — Problem',
  'Implication': 'I — Implication',
  'Need-Payoff': 'N — Need-Payoff',
  'Book demo':   '→ Book Demo',
}

const ROLES = ['All roles', 'IT Manager', 'Sysadmin', 'CFO / MD', 'CISO / SecOps']

const PRODUCT_COLOR = {
  'Backup':         '#f59e0b',
  'IT Asset Mgmt':  '#8b5cf6',
  'M365 Backup':    '#0ea5e9',
  'MDM':            '#10b981',
  'Ticketing':      '#ef4444',
  'Vuln. Manager':  '#ec4899',
}

const SCENARIO_COLOR = {
  'Situation':   '#0ea5e9',
  'Problem':     '#f59e0b',
  'Implication': '#ef4444',
  'Need-Payoff': '#10b981',
  'Book demo':   '#8b5cf6',
}

export default function SpinDiscoveryPanel({ widget }) {
  const [product,  setProduct]  = useState(PRODUCTS[0])
  const [scenario, setScenario] = useState(SCENARIOS[0])
  const [role,     setRole]     = useState('All roles')
  const [openQ,    setOpenQ]    = useState(null)

  const questions = useMemo(() => {
    return SPIN_DISCOVERY.filter(q =>
      q.p === product &&
      q.s === scenario &&
      (role === 'All roles' || q.r === role)
    ).sort((a, b) => a.n - b.n)
  }, [product, scenario, role])

  const pc  = PRODUCT_COLOR[product]  || widget.color
  const sc  = SCENARIO_COLOR[scenario] || widget.color

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg)' }}>

      {/* ─ Header ─ */}
      <div style={{ padding: '14px 20px 0', borderBottom: '1px solid var(--brd)', flexShrink: 0, background: 'var(--surf)' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: widget.color + '20', color: widget.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>
            {widget.icon}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{widget.title}</div>
            <div style={{ fontSize: 11, color: 'var(--txt2)' }}>
              1,200 discovery questions · 6 products · 5 phases
            </div>
          </div>
        </div>

        {/* Product selector */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 }}>
          {PRODUCTS.map(p => {
            const active = product === p
            const c = PRODUCT_COLOR[p] || widget.color
            return (
              <button
                key={p}
                onClick={() => { setProduct(p); setOpenQ(null) }}
                style={{
                  padding: '5px 12px', borderRadius: 8, fontSize: 11,
                  fontWeight: active ? 600 : 400,
                  background: active ? c + '20' : 'var(--card2)',
                  color: active ? c : 'var(--txt2)',
                  border: `1px solid ${active ? c + '60' : 'var(--brd)'}`,
                  transition: 'all 0.12s', cursor: 'pointer'
                }}
              >
                {p}
              </button>
            )
          })}
        </div>

        {/* Scenario tabs */}
        <div style={{ display: 'flex', overflowX: 'auto', marginLeft: -20, marginRight: -20, paddingLeft: 20 }}>
          {SCENARIOS.map(s => {
            const active = scenario === s
            const c = SCENARIO_COLOR[s]
            return (
              <button
                key={s}
                onClick={() => { setScenario(s); setOpenQ(null) }}
                style={{
                  padding: '10px 14px', fontSize: 12, whiteSpace: 'nowrap',
                  fontWeight: active ? 600 : 400,
                  color: active ? c : 'var(--txt2)',
                  borderBottom: active ? `2px solid ${c}` : '2px solid transparent',
                  background: 'none', border: 'none',
                  borderBottom: active ? `2px solid ${c}` : '2px solid transparent',
                  marginBottom: -1, cursor: 'pointer', transition: 'color 0.12s'
                }}
              >
                {SCENARIO_LABEL[s]}
              </button>
            )
          })}
        </div>
      </div>

      {/* ─ Role filter bar ─ */}
      <div style={{ padding: '8px 20px', borderBottom: '1px solid var(--brd)', flexShrink: 0, background: 'var(--surf)', display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {ROLES.map(r => {
          const active = role === r
          return (
            <button
              key={r}
              onClick={() => { setRole(r); setOpenQ(null) }}
              style={{
                padding: '3px 10px', borderRadius: 20, fontSize: 11,
                fontWeight: active ? 600 : 400,
                background: active ? sc + '20' : 'var(--card2)',
                color: active ? sc : 'var(--txt2)',
                border: `1px solid ${active ? sc + '50' : 'var(--brd)'}`,
                transition: 'all 0.12s', cursor: 'pointer'
              }}
            >
              {r}
            </button>
          )
        })}
        <span style={{ fontSize: 11, color: 'var(--txt3)', alignSelf: 'center', marginLeft: 4 }}>
          {questions.length} questions
        </span>
      </div>

      {/* ─ Questions ─ */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px' }}>
        {questions.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--txt2)', padding: '40px 0', fontSize: 13 }}>
            No questions for this combination
          </div>
        )}

        {questions.map((q, idx) => {
          const key   = `${q.p}|${q.r}|${q.s}|${q.n}`
          const open  = openQ === key
          return (
            <QuestionCard
              key={key}
              q={q}
              idx={idx}
              open={open}
              sc={sc}
              pc={pc}
              onToggle={() => setOpenQ(open ? null : key)}
            />
          )
        })}
      </div>
    </div>
  )
}

function QuestionCard({ q, idx, open, sc, pc, onToggle }) {
  return (
    <div style={{
      border: `1px solid ${open ? sc + '60' : 'var(--brd)'}`,
      borderRadius: 11, marginBottom: 8, overflow: 'hidden',
      transition: 'border-color 0.12s'
    }}>
      {/* Question row */}
      <button
        onClick={onToggle}
        style={{
          width: '100%', textAlign: 'left', background: open ? 'var(--card2)' : 'var(--card)',
          border: 'none', padding: '12px 14px', cursor: 'pointer',
          display: 'flex', alignItems: 'flex-start', gap: 10
        }}
      >
        {/* Number badge */}
        <span style={{
          width: 22, height: 22, borderRadius: 6, background: sc + '20', color: sc,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 1
        }}>
          {q.n}
        </span>

        {/* Question text */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--txt)', lineHeight: 1.45 }}>
            {q.q}
          </div>
          {/* Role badge inline — shown only if "All roles" selected */}
          {q.r && (
            <span style={{
              display: 'inline-block', marginTop: 5, fontSize: 9, fontWeight: 600,
              background: pc + '15', color: pc, padding: '2px 7px', borderRadius: 99
            }}>
              {q.r}
            </span>
          )}
        </div>

        <span style={{ color: 'var(--txt2)', fontSize: 10, flexShrink: 0, marginTop: 4 }}>
          {open ? '▲' : '▼'}
        </span>
      </button>

      {/* Coaching panel */}
      {open && (
        <div style={{ padding: '14px 16px', borderTop: '1px solid var(--brd)', background: 'var(--bg)', display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Why it matters */}
          <CoachRow label="Why this matters" color={sc} text={q.why} />

          {/* Follow-up */}
          <CoachRow label="Suggested follow-up" color={pc} text={q.fu} italic />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <CoachRow label="🔴 Risk signal" color="var(--red)"   text={q.risk} small />
            <CoachRow label="🟢 Opportunity" color="var(--green)" text={q.opp}  small />
          </div>
        </div>
      )}
    </div>
  )
}

function CoachRow({ label, color, text, italic, small }) {
  return (
    <div>
      <div style={{
        fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.06em', color, marginBottom: 3
      }}>
        {label}
      </div>
      <div style={{
        fontSize: small ? 11 : 12, color: 'var(--txt2)', lineHeight: 1.5,
        fontStyle: italic ? 'italic' : 'normal'
      }}>
        {text}
      </div>
    </div>
  )
}
