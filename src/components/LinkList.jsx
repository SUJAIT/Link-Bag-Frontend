import React from 'react';
import { deleteLink } from '../lib/api';
import { openQrWindow } from '../utils/qr';

export default function LinkList({ links, onChanged }) {
  async function handleDelete(id) {
    if (!confirm('Delete this link?')) return;
    await deleteLink(id);
    onChanged?.();
  }

  if (!links?.length) return <div>No links found.</div>;

  return (
    <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
      {links.map(l => (
        <div key={l._id} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600 }}>{l.title}</div>
            <div style={{ color: '#666' }}>{l.url}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => window.open(l.url, '_blank')}>Open</button>
            <button onClick={() => navigator.clipboard.writeText(l.url)}>Copy</button>
            <button onClick={() => openQrWindow(l.url)}>QR</button>
            <button onClick={() => handleDelete(l._id)} style={{ color: 'red' }}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
