import React, { useState } from 'react';
import { addLink } from '../lib/api';

export default function AddLink({ onAdded }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const normalizeUrl = (u) => (/^https?:\/\//i.test(u) ? u : `https://${u}`);

  async function handleAdd(e) {
    e?.preventDefault();
    if (!url.trim()) return alert('Enter URL');
    setLoading(true);
    try {
      await addLink({ title: title.trim() || url.trim(), url: normalizeUrl(url.trim()) });
      setTitle('');
      setUrl('');
      onAdded?.();
    } catch (e) {
      alert('Failed to add: ' + (e?.response?.data?.error || e.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="add" onSubmit={handleAdd}>
      <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <input className="input" placeholder="URL (drive.google.com/...)" value={url} onChange={e=>setUrl(e.target.value)} />
      <button className="btn primary" disabled={loading} type="submit">{loading ? 'Adding…' : 'Add'}</button>
    </form>
  );
}
