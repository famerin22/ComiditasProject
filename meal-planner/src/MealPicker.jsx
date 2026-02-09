import React from 'react';

export default function MealPicker({ label, value, options = [], onChange, onRequestAddFoods }) {
  const handleChange = (e) => {
    const val = e.target.value;
    const opt = options.find(o => o.name === val);
    if (opt && opt.is_recipe && typeof onRequestAddFoods === 'function') {
      onRequestAddFoods(opt);
    } else {
      onChange(val);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
      <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginLeft: 4 }}>
        {label}
      </label>
      <select value={value} onChange={handleChange} style={{ width: '100%', background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, padding: 8 }}>
        <option value="">— Nada seleccionado —</option>
        <optgroup label="Recetas">
          {options.filter(opt => opt.is_recipe).map(opt => (
            <option key={opt.id} value={opt.name}>{opt.name}</option>
          ))}
        </optgroup>

        <optgroup label="Ingredientes">
          {options.filter(opt => !opt.is_recipe).map(opt => (
            <option key={opt.id} value={opt.name}>{opt.name}</option>
          ))}
        </optgroup>
      </select>
    </div>
  );
}