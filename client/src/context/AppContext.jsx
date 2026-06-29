import { createContext, useContext, useReducer, useEffect } from 'react'

const AppContext = createContext(null)

const initialState = {
  currentProspect: null,
  currentSession:  null,
  callSeconds:     0,
  activePersona:   null,
  darkMode:        true,
}

function reducer (state, action) {
  switch (action.type) {
    case 'SET_PROSPECT':
      return {
        ...state,
        currentProspect: action.payload,
        currentSession:  null,
        callSeconds:     0,
        activePersona:   inferPersona(action.payload?.role)
      }
    case 'SET_SESSION':
      return { ...state, currentSession: action.payload }
    case 'SET_PERSONA':
      return { ...state, activePersona: action.payload }
    case 'SET_DARK_MODE':
      return { ...state, darkMode: action.payload }
    case 'TICK':
      return { ...state, callSeconds: state.callSeconds + 1 }
    case 'END_CALL':
      return { ...state, currentSession: null, callSeconds: 0 }
    case 'CLEAR':
      return initialState
    default:
      return state
  }
}

// Infer persona label from free-text role
function inferPersona (role) {
  if (!role) return null
  const r = role.toLowerCase()
  if (r.includes('cio') || r.includes('cto') || r.includes('head of it') || r.includes('vp of it') || r.includes('director of it')) return 'Head of IT'
  if (r.includes('it manager') || r.includes('it director') || r.includes('it operations')) return 'IT Manager'
  if (r.includes('service desk') || r.includes('help desk')) return 'Service Desk'
  if (r.includes('sysadmin') || r.includes('systems admin') || r.includes('administrator')) return 'SysAdmin'
  if (r.includes('ciso') || r.includes('security officer') || r.includes('security leader')) return 'CISO'
  if (r.includes('technician') || r.includes('support specialist') || r.includes('it support')) return 'Technician'
  return null
}

export function AppProvider ({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : 'light')
  }, [state.darkMode])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp () {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}
