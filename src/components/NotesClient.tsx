"use client";

import { useEffect, useState, FormEvent } from 'react';
import { getAllNotes, addNote, updateNote, deleteNote } from '../lib/db';

interface Note {
  id?: number;
  title: string;
  content: string;
}

export default function NotesClient() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

  // Fetch notes once the component mounts (client-side)
  useEffect(() => {
    async function fetchNotes() {
      const allNotes = await getAllNotes();
      setNotes(allNotes);
    }
    fetchNotes();
  }, []);

  async function handleAddNote(e: FormEvent) {
    e.preventDefault();
    if (!title || !content) return;
    await addNote({ title, content });
    const updatedNotes = await getAllNotes();
    setNotes(updatedNotes);
    setTitle('');
    setContent('');
  }

  async function handleEdit(note: Note) {
    setTitle(note.title);
    setContent(note.content);
    setEditingNoteId(note.id ?? null);
  }

  async function handleUpdateNote(e: FormEvent) {
    e.preventDefault();
    if (!editingNoteId) return;
    await updateNote({ id: editingNoteId, title, content });
    const updatedNotes = await getAllNotes();
    setNotes(updatedNotes);
    setTitle('');
    setContent('');
    setEditingNoteId(null);
  }

  async function handleDelete(id: number | undefined) {
    if (typeof id !== 'number') return;
    await deleteNote(id);
    const updatedNotes = await getAllNotes();
    setNotes(updatedNotes);
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>IndexNote (iNote)</h1>
      <form onSubmit={editingNoteId ? handleUpdateNote : handleAddNote} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ display: 'block', marginBottom: '10px', width: '300px' }}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          style={{ display: 'block', marginBottom: '10px', width: '300px', height: '100px' }}
        />
        <button type="submit">
          {editingNoteId ? 'Update Note' : 'Add Note'}
        </button>
        {editingNoteId && (
          <button
            type="button"
            onClick={() => {
              setEditingNoteId(null);
              setTitle('');
              setContent('');
            }}
            style={{ marginLeft: '10px' }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {notes.map((note) => (
          <li
            key={note.id}
            style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px' }}
          >
            <h2>{note.title}</h2>
            <p>{note.content}</p>
            <button onClick={() => handleEdit(note)} style={{ marginRight: '10px' }}>Edit</button>
            {note.id && (
              <button onClick={() => handleDelete(note.id)} style={{ marginRight: '10px' }}>Delete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
