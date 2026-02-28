import React from 'react';
import MealSlot from './MealSlot';

export default function DayRow({ day, data, options, onAddItem, onRemoveItem }) {
  return (
    <div style={{ background: 'var(--bg-card)', padding: 16, borderRadius: 12, boxShadow: '0 1px 2px rgba(0,0,0,0.04)', border: '1px solid var(--border-card)', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 15 }}>
      <h3 style={{ fontWeight: 900, color: 'var(--text-title)', borderBottom: '1px solid var(--border-card)', paddingBottom: 8 }}>
        {day}
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <MealSlot 
          label="Almuerzo"
          items={data.almuerzo}
          options={options}
          onAddItem={(id, amount, unit) => onAddItem('almuerzo', id, amount, unit)}
          onRemoveItem={(id) => onRemoveItem('almuerzo', id)}
        />
        <MealSlot 
          label="Cena"
          items={data.cena}
          options={options}
          onAddItem={(id, amount, unit) => onAddItem('cena', id, amount, unit)}
          onRemoveItem={(id) => onRemoveItem('cena', id)}
        />
      </div>
    </div>
  );
}
