import React from 'react';
import MealSlot from './MealSlot';
import { Coffee, Utensils, Cookie, Moon } from 'lucide-react';

export default function DayRow({ day, data, options, onAddItem, onRemoveItem, onCopyMeal }) {
  return (
    <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid var(--border-card)', display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
      <h3 style={{ fontWeight: 900, fontSize: '18px', color: 'var(--text-title)', borderBottom: '2px solid var(--border-card)', paddingBottom: '10px', margin: 0 }}>
        {day}
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <MealSlot 
            label={<><Coffee size={14} /> Desayuno</>}
            items={data.desayuno}
            options={options}
            onAddItem={(id, amount, unit) => onAddItem('desayuno', id, amount, unit)}
            onRemoveItem={(id) => onRemoveItem('desayuno', id)}
            onCopyAll={() => onCopyMeal(day, 'desayuno')}
          />
          <MealSlot 
            label={<><Utensils size={14} /> Almuerzo</>}
            items={data.almuerzo}
            options={options}
            onAddItem={(id, amount, unit) => onAddItem('almuerzo', id, amount, unit)}
            onRemoveItem={(id) => onRemoveItem('almuerzo', id)}
            onCopyAll={() => onCopyMeal(day, 'almuerzo')}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <MealSlot 
            label={<><Cookie size={14} /> Merienda</>}
            items={data.merienda}
            options={options}
            onAddItem={(id, amount, unit) => onAddItem('merienda', id, amount, unit)}
            onRemoveItem={(id) => onRemoveItem('merienda', id)}
            onCopyAll={() => onCopyMeal(day, 'merienda')}
          />
          <MealSlot 
            label={<><Moon size={14} /> Cena</>}
            items={data.cena}
            options={options}
            onAddItem={(id, amount, unit) => onAddItem('cena', id, amount, unit)}
            onRemoveItem={(id) => onRemoveItem('cena', id)}
            onCopyAll={() => onCopyMeal(day, 'cena')}
          />
        </div>
      </div>
    </div>
  );
}
}
