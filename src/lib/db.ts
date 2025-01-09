import { openDB, DBSchema } from 'idb';

interface NotesDB extends DBSchema {
  notes: {
    key: number;
    value: {
      id?: number;
      title: string;
      content: string;
    };
    indexes: { 'by-title': string };
  };
}

export async function getDB() {
  return openDB<NotesDB>('notesDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('notes')) {
        const store = db.createObjectStore('notes', {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('by-title', 'title');
      }
    },
  });
}

export async function getAllNotes() {
  const db = await getDB();
  return db.getAll('notes');
}

export async function addNote(note: { title: string; content: string }) {
  const db = await getDB();
  return db.add('notes', note);
}

export async function updateNote(note: { id: number; title: string; content: string }) {
  const db = await getDB();
  return db.put('notes', note);
}

export async function deleteNote(id: number) {
  const db = await getDB();
  return db.delete('notes', id);
}
