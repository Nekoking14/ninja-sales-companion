const BASE = '/api'

async function req (method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}

// ── Prospects ─────────────────────────────────────────────────────────────────
export const api = {
  prospects: {
    list:   ()          => req('GET',    '/prospects'),
    get:    (id)        => req('GET',    `/prospects/${id}`),
    create: (data)      => req('POST',   '/prospects', data),
    update: (id, data)  => req('PUT',    `/prospects/${id}`, data),
    remove: (id)        => req('DELETE', `/prospects/${id}`)
  },
  sessions: {
    start:             (prospect_id)            => req('POST', '/sessions', { prospect_id }),
    get:               (id)                     => req('GET',  `/sessions/${id}`),
    end:               (id, duration_sec)       => req('PUT',  `/sessions/${id}/end`, { duration_sec }),
    saveQualification: (id, qualification_data) => req('PUT',  `/sessions/${id}/qualification`, { qualification_data })
  },
  reportItems: {
    add:    (data)  => req('POST',   '/report-items', data),
    remove: (id)    => req('DELETE', `/report-items/${id}`)
  },
  notes: {
    add:    (data)  => req('POST',   '/notes', data),
    remove: (id)    => req('DELETE', `/notes/${id}`)
  },
  settings: {
    list:   (prefix)     => req('GET',    `/settings${prefix ? `?prefix=${encodeURIComponent(prefix)}` : ''}`),
    get:    (key)        => req('GET',    `/settings/${key}`),
    put:    (key, value) => req('PUT',    `/settings/${key}`, { value }),
    remove: (key)        => req('DELETE', `/settings/${key}`)
  }
}
