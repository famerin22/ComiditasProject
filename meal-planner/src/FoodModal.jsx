import React, { useState } from 'react';

export default function FoodModal({ open, onClose, items = [], onAdd }) {
  const [selected, setSelected] = useState(new Set());
  if (!open) return null;

  const toggle = (id) => {
    setSelected(prev => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id); else s.add(id);
      return s;
    });
  };

  const handleAdd = () => {
    const chosen = items.filter(i => selected.has(i.id));
    onAdd && onAdd(chosen);
    setSelected(new Set());
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', padding: 20, borderRadius: 8, width: 420, maxHeight: '80vh', overflowY: 'auto' }}>
        <h3 style={{ marginTop: 0 }}>Add foods from DB</h3>
        <div>
          {items.map(item => (
            <label key={item.id} style={{ display: 'block', marginBottom: 8 }}>
              <input type="checkbox" checked={selected.has(item.id)} onChange={() => toggle(item.id)} /> {item.name}
            </label>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
          <button onClick={() => { setSelected(new Set()); onClose && onClose(); }} style={{ padding: '6px 12px' }}>Cancel</button>
          <button onClick={handleAdd} style={{ padding: '6px 12px', background: '#ff6b35', color: 'white', border: 'none' }}>Add</button>
        </div>
      </div>
    </div>
  );
}
