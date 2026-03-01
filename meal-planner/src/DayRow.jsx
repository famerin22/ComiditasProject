import React from 'react';
import MealSlot from './MealSlot';
import { Coffee, Utensils, Cookie, Moon, Trash2 } from 'lucide-react';

export default function DayRow({ day, isToday, data, options, onAddItem, onRemoveItem, onUpdateItem, onCopyMeal, onCopyToTomorrow, onClearDay, recentFoods }) {
  if (!data) return null;

  return (
    <div style={{ 
      background: isToday ? 'rgba(99, 102, 241, 0.05)' : 'var(--bg-card)', 
      padding: '16px', 
      borderRadius: '16px', 
      boxShadow: isToday ? '0 0 0 2px #6366f1' : '0 4px 6px -1px rgba(0,0,0,0.1)', 
      border: '1px solid var(--border-card)', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '15px', 
      marginBottom: '20px',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-card)', paddingBottom: '10px' }}>
        <h3 style={{ fontWeight: 900, fontSize: '18px', color: isToday ? '#6366f1' : 'var(--text-title)', margin: 0 }}>
          {day} {isToday && <span style={{ fontSize: '10px', verticalAlign: 'middle', backgroundColor: '#6366f1', color: 'white', padding: '2px 6px', borderRadius: '10px', marginLeft: '5px' }}>HOY</span>}
        </h3>
        <button 
          onClick={() => onClearDay(day)}
          title="Vaciar día"
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '5px' }}
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <MealSlot 
            label={<><Coffee size={14} /> Desayuno</>}
            items={data.desayuno}
            options={options}
            onAddItem={(id, amount, unit) => onAddItem('desayuno', id, amount, unit)}
            onRemoveItem={(id) => onRemoveItem('desayuno', id)}
            onUpdateItem={(id, amount, unit) => onUpdateItem('desayuno', id, amount, unit)}
            onCopyAll={() => onCopyMeal(day, 'desayuno')}
            onCopyToTomorrow={() => onCopyToTomorrow(day, 'desayuno')}
            recentFoods={recentFoods}
          />
          <MealSlot 
            label={<><Utensils size={14} /> Almuerzo</>}
            items={data.almuerzo}
            options={options}
            onAddItem={(id, amount, unit) => onAddItem('almuerzo', id, amount, unit)}
            onRemoveItem={(id) => onRemoveItem('almuerzo', id)}
            onUpdateItem={(id, amount, unit) => onUpdateItem('almuerzo', id, amount, unit)}
            onCopyAll={() => onCopyMeal(day, 'almuerzo')}
            onCopyToTomorrow={() => onCopyToTomorrow(day, 'almuerzo')}
            recentFoods={recentFoods}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <MealSlot 
            label={<><Cookie size={14} /> Merienda</>}
            items={data.merienda}
            options={options}
            onAddItem={(id, amount, unit) => onAddItem('merienda', id, amount, unit)}
            onRemoveItem={(id) => onRemoveItem('merienda', id)}
            onUpdateItem={(id, amount, unit) => onUpdateItem('merienda', id, amount, unit)}
            onCopyAll={() => onCopyMeal(day, 'merienda')}
            onCopyToTomorrow={() => onCopyToTomorrow(day, 'merienda')}
            recentFoods={recentFoods}
          />
          <MealSlot 
            label={<><Moon size={14} /> Cena</>}
            items={data.cena}
            options={options}
            onAddItem={(id, amount, unit) => onAddItem('cena', id, amount, unit)}
            onRemoveItem={(id) => onRemoveItem('cena', id)}
            onUpdateItem={(id, amount, unit) => onUpdateItem('cena', id, amount, unit)}
            onCopyAll={() => onCopyMeal(day, 'cena')}
            onCopyToTomorrow={() => onCopyToTomorrow(day, 'cena')}
            recentFoods={recentFoods}
          />
        </div>
      </div>
    </div>
  );
}
