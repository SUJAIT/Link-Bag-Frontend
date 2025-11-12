import React, { useState } from 'react';
import { addLink } from '../lib/api';

export default function AddLink({ onAdded }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    if (!url.trim()) return alert('Enter URL');
    setLoading(true);
    try {
      await addLink({ title: title.trim() || url.trim(), url: url.trim() });
      setTitle('');
      setUrl('');
      onAdded?.();
    } catch (e) {
      alert('Error adding link: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} style={{ flex: 1, padding: 8 }} />
      <input placeholder="URL (drive.google.com/...)" value={url} onChange={e=>setUrl(e.target.value)} style={{ flex: 2, padding: 8 }} />
      <button onClick={handleAdd} disabled={loading} style={{ padding: '8px 12px' }}>
        {loading ? 'Adding...' : 'Add'}
      </button>
    </div>
  );
}
