import React, { useEffect, useState } from 'react';
import { getLinks } from './lib/api';
import AddLink from './components/AddLink';
import LinkList from './components/LinkList';

export default function App() {
  const [links, setLinks] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await getLinks();
      setLinks(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = links.filter(l =>
    l.title?.toLowerCase().includes(q.toLowerCase()) ||
    l.url?.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 16, fontFamily: 'system-ui' }}>
      <h1>🔗 LinkBag 🛍️</h1>
      <p>This is Link-Bag ... Only For SUJAIT</p>
      <AddLink onAdded={load} />
      <input
        placeholder="Search links..."
        value={q}
        onChange={e=>setQ(e.target.value)}
        style={{ marginTop: 10, padding: 8, width: '100%' }}
      />
      {loading ? <p>Loading...</p> : <LinkList links={filtered} onChanged={load} />}
    </div>
  );
}
