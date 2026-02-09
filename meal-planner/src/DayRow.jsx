import React from 'react';
import MealPicker from './MealPicker';

// We destructure the props here for cleaner code
export default function DayRow({ day, data, options, onChange, onRequestAddFoods }) {
  return (
    <div style={{ background: 'white', padding: 16, borderRadius: 12, boxShadow: '0 1px 2px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h3 style={{ fontWeight: 900, color: '#334155', borderBottom: '1px solid #f1f5f9', paddingBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {day}
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <MealPicker 
          label="Almuerzo"
          value={data.almuerzo || ""}
          options={options}
          onChange={(val) => onChange('almuerzo', val)}
          onRequestAddFoods={(opt) => onRequestAddFoods && onRequestAddFoods('almuerzo', opt)}
        />
        <MealPicker 
          label="Cena"
          value={data.cena || ""}
          options={options}
          onChange={(val) => onChange('cena', val)}
          onRequestAddFoods={(opt) => onRequestAddFoods && onRequestAddFoods('cena', opt)}
        />
      </div>
    </div>
  );
}