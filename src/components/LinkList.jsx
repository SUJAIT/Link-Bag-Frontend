import React from 'react';
import { deleteLink } from '../lib/api';
import { openQrWindow } from '../utils/qr';

export default function LinkList({ links, onChanged, selected, onToggle }) {
  async function handleDelete(id) {
    if (!confirm('Delete this link?')) return;
    await deleteLink(id);
    onChanged?.();
  }

  if (!links?.length) return <div className="empty">No links found.</div>;

  return (
    <div className="grid">
      {links.map(l => (
        <article key={l._id} className={`card ${selected?.has(l._id) ? 'selected' : ''}`}>
          <label className="pick">
            <input type="checkbox" checked={selected?.has(l._id) || false} onChange={() => onToggle?.(l._id)} />
          </label>
          <div className="meta" onClick={() => window.open(l.url, '_blank')}>
            <h4 className="title" title={l.title}>{l.title}</h4>
            <p className="url" title={l.url}>{l.url}</p>
          </div>
          <div className="btns">
            <button className="btn" onClick={() => window.open(l.url, '_blank')}>Open</button>
            <button className="btn ghost" onClick={() => navigator.clipboard.writeText(l.url)}>Copy</button>
            <button className="btn accent" onClick={() => openQrWindow(l.url)}>QR</button>
            <button className="btn warn" onClick={() => handleDelete(l._id)}>Delete</button>
          </div>
        </article>
      ))}
    </div>
  );
}
