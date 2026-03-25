const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

async function request(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  })

  if (response.status === 204) {
    return null
  }

  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    throw new Error(data?.message || `Request failed with status ${response.status}`)
  }

  return data
}

export function getNotes(page = 1, pageSize = 10) {
  return request(`/api/Note?page=${page}&pageSize=${pageSize}`)
}

export function createNote(payload) {
  return request('/api/Note', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export function updateNote(payload) {
  return request('/api/Note', {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
}

export function deleteNote(noteId) {
  return request(`/api/Note/${noteId}`, {
    method: 'DELETE'
  })
}
