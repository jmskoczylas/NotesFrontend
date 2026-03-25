import { useEffect, useState } from 'react'
import { createNote, deleteNote, getNotes, updateNote } from './api'

const emptyCreateForm = { title: '', text: '' }

export default function App() {
  const [notes, setNotes] = useState([])
  const [createForm, setCreateForm] = useState(emptyCreateForm)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ id: 0, title: '', text: '', noteVersion: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  function replaceNote(updatedNote) {
    setNotes((current) =>
      current.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    )
  }

  async function loadNotes() {
    setIsLoading(true)
    setError('')

    try {
      const data = await getNotes()
      setNotes(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadNotes()
  }, [])

  async function handleCreate(event) {
    event.preventDefault()
    setIsSaving(true)
    setError('')

    try {
      await createNote(createForm)
      setCreateForm(emptyCreateForm)
      await loadNotes()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  function startEditing(note) {
    setEditingId(note.id)
    setEditForm({
      id: note.id,
      title: note.title,
      text: note.text || '',
      noteVersion: note.noteVersion
    })
  }

  function cancelEditing() {
    setEditingId(null)
    setEditForm({ id: 0, title: '', text: '', noteVersion: 0 })
  }

  async function handleUpdate(event) {
    event.preventDefault()
    setIsSaving(true)
    setError('')

    try {
      const updatedNote = await updateNote(editForm)
      replaceNote(updatedNote)
      setEditForm({
        id: updatedNote.id,
        title: updatedNote.title,
        text: updatedNote.text || '',
        noteVersion: updatedNote.noteVersion
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(noteId) {
    setError('')

    try {
      await deleteNote(noteId)
      if (editingId === noteId) {
        cancelEditing()
      }
      await loadNotes()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="app-shell">
      <section className="hero">
        <p className="eyebrow">Notes UI</p>
        <h1>Small frontend for the notes API</h1>
        <p className="intro">
          Create, edit, and delete notes against the local ASP.NET API. The list view reflects the
          current API contract, including optimistic concurrency via note version.
        </p>
      </section>

      {error ? <div className="error-banner">{error}</div> : null}

      <div className="layout">
        <section className="panel">
          <h2>Create note</h2>
          <form onSubmit={handleCreate} className="form">
            <label>
              <span>Title</span>
              <input
                value={createForm.title}
                onChange={(event) =>
                  setCreateForm((current) => ({ ...current, title: event.target.value }))
                }
                maxLength={50}
                required
              />
            </label>
            <label>
              <span>Text</span>
              <textarea
                value={createForm.text}
                onChange={(event) =>
                  setCreateForm((current) => ({ ...current, text: event.target.value }))
                }
                maxLength={200}
                rows={5}
                required
              />
            </label>
            <button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Create note'}
            </button>
          </form>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>Notes</h2>
            <button type="button" className="secondary" onClick={loadNotes} disabled={isLoading}>
              Refresh
            </button>
          </div>

          {isLoading ? <p className="empty-state">Loading notes...</p> : null}

          {!isLoading && notes.length === 0 ? (
            <p className="empty-state">No notes yet. Create the first one from the form.</p>
          ) : null}

          <div className="note-list">
            {notes.map((note) => {
              const isEditing = editingId === note.id

              return (
                <article key={note.id} className="note-card">
                  {isEditing ? (
                    <form onSubmit={handleUpdate} className="form">
                      <label>
                        <span>Title</span>
                        <input
                          value={editForm.title}
                          onChange={(event) =>
                            setEditForm((current) => ({ ...current, title: event.target.value }))
                          }
                          maxLength={50}
                          required
                        />
                      </label>
                      <label>
                        <span>Text</span>
                        <textarea
                          value={editForm.text}
                          onChange={(event) =>
                            setEditForm((current) => ({ ...current, text: event.target.value }))
                          }
                          maxLength={200}
                          rows={4}
                          required
                        />
                      </label>
                      <div className="meta-row">
                        <span>ID {note.id}</span>
                        <span>Version {note.noteVersion}</span>
                      </div>
                      <div className="actions">
                        <button type="submit" disabled={isSaving}>
                          {isSaving ? 'Saving...' : 'Save'}
                        </button>
                        <button type="button" className="secondary" onClick={cancelEditing}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="note-header">
                        <h3>{note.title}</h3>
                        <span className="badge">v{note.noteVersion}</span>
                      </div>
                      <p className="note-text">{note.text}</p>
                      <div className="meta-stack">
                        <span>ID: {note.id}</span>
                        <span>Created: {note.createdOn || 'n/a'}</span>
                        <span>Modified: {note.modifiedOn || 'n/a'}</span>
                      </div>
                      <div className="actions">
                        <button type="button" className="secondary" onClick={() => startEditing(note)}>
                          Edit
                        </button>
                        <button type="button" className="danger" onClick={() => handleDelete(note.id)}>
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </article>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
