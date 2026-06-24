import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext.jsx'
import ProspectSelector from './pages/ProspectSelector.jsx'
import Dashboard        from './pages/Dashboard.jsx'
import ProspectList     from './pages/ProspectList.jsx'
import EditFrameworks   from './pages/EditFrameworks.jsx'

export default function App () {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"          element={<ProspectSelector />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/prospects" element={<ProspectList />} />
          <Route path="/edit"      element={<EditFrameworks />} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
