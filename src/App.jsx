import React, { useEffect, useMemo, useState } from 'react';
import { getLinks, deleteLink } from './lib/api';
import AddLink from './components/AddLink.jsx';
import LinkList from './components/LinkList.jsx';
import './App.css';

export default function App() {
  const [links, setLinks] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(new Set());
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  async function load() {
    setLoading(true);
    try {
      const data = await getLinks();
      setLinks(data);
      setSelected(new Set());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return links.filter(l => l.title?.toLowerCase().includes(s) || l.url?.toLowerCase().includes(s));
  }, [links, q]);

  const allVisibleIds = useMemo(() => filtered.map(l => l._id), [filtered]);
  const allSelectedOnPage = useMemo(() => allVisibleIds.every(id => selected.has(id)) && allVisibleIds.length > 0, [allVisibleIds, selected]);

  function toggleSelect(id) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleSelectAllVisible() {
    setSelected(prev => {
      const next = new Set(prev);
      if (allSelectedOnPage) {
        allVisibleIds.forEach(id => next.delete(id));
      } else {
        allVisibleIds.forEach(id => next.add(id));
      }
      return next;
    });
  }

  async function handleBulkDelete() {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} selected link(s)?`)) return;
    const ids = Array.from(selected);
    await Promise.all(ids.map(id => deleteLink(id)));
    await load();
  }

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <span className="logo">🔗</span>
          <span>LinkBag 🛍️</span>
        </div>
        <div className="actions">
          <button className="btn ghost" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <a className="btn accent" href={import.meta.env.VITE_API_URL} target="_blank" rel="noreferrer">API</a>
        </div>
      </header>

      <main className="container">
        <p className="subtitle">This is Link-Bag Application , It's Only For SUJAIT</p>
        <AddLink onAdded={load} />

        <div className="toolbar">
          <input
            className="input"
            placeholder="Search links…"
            value={q}
            onChange={e=>setQ(e.target.value)}
          />
          <div className="toolbar-right">
            <button className="btn" onClick={load}>Refresh</button>
            <button className="btn warn" disabled={selected.size===0} onClick={handleBulkDelete}>
              🗑️ Delete selected ({selected.size})
            </button>
            <button className="btn ghost" onClick={toggleSelectAllVisible} disabled={allVisibleIds.length===0}>
              {allSelectedOnPage ? 'Unselect all' : 'Select all'}
            </button>
          </div>
        </div>

        {loading ? <div className="loading">Loading…</div> : (
          <LinkList
            links={filtered}
            selected={selected}
            onToggle={toggleSelect}
            onChanged={load}
          />
        )}
      </main>

      <footer className="footer">Made for quick link sharing • Responsive + Dark mode</footer>
    </div>
  );
}
