import React, { useState } from 'react';
import { Plus, X, Check } from 'lucide-react';

export default function MealSlot({ label, items = [], options = [], onAddItem, onRemoveItem }) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [amount, setAmount] = useState('1');
  const [unit, setUnit] = useState('');

  const handleSelect = (e) => {
    const id = e.target.value;
    if (id) {
      const food = options.find(o => o.id === Number(id));
      setSelectedFood(food);
      setAmount('1');
      setUnit(food.is_recipe ? 'unidades' : '');
    }
  };

  const confirmAdd = () => {
    if (selectedFood) {
      onAddItem(selectedFood.id, amount, unit);
      setSelectedFood(null);
      setShowPicker(false);
      setAmount('1');
      setUnit('');
    }
  };

  const cancelSelection = () => {
    setSelectedFood(null);
    setShowPicker(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginLeft: 4 }}>
          {label}
        </label>
        <button 
          onClick={() => { setShowPicker(!showPicker); setSelectedFood(null); }}
          style={{ padding: '2px', background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          {showPicker ? <X size={16} /> : <Plus size={16} />}
        </button>
      </div>

      {showPicker && !selectedFood && (
        <select 
          autoFocus
          onChange={handleSelect} 
          style={{ width: '100%', padding: '4px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '12px', marginBottom: '8px' }}
        >
          <option value="">Seleccionar...</option>
          <optgroup label="Recetas" style={{ backgroundColor: 'var(--bg-input)' }}>
            {options.filter(o => o.is_recipe).map(o => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </optgroup>
          <optgroup label="Ingredientes" style={{ backgroundColor: 'var(--bg-input)' }}>
            {options.filter(o => !o.is_recipe).map(o => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </optgroup>
        </select>
      )}

      {showPicker && selectedFood && (
        <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', alignItems: 'center', backgroundColor: 'var(--bg-item)', padding: '4px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '11px', fontWeight: 'bold', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-main)' }}>
            {selectedFood.name}
          </span>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Cant."
            style={{ width: '40px', padding: '2px', fontSize: '11px', border: '1px solid var(--border-color)', borderRadius: '2px', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)' }}
          />
          {!selectedFood.is_recipe && (
            <input 
              type="text" 
              value={unit} 
              onChange={(e) => setUnit(e.target.value)}
              placeholder="Unid. (g, ml...)"
              style={{ width: '60px', padding: '2px', fontSize: '11px', border: '1px solid var(--border-color)', borderRadius: '2px', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)' }}
            />
          )}
          {selectedFood.is_recipe && (
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>unidades</span>
          )}
          <button onClick={confirmAdd} style={{ color: '#10b981', background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
            <Check size={16} />
          </button>
          <button onClick={cancelSelection} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
            <X size={16} />
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map(item => (
          <div key={item.id} style={{ position: 'relative', padding: '8px', border: '1px solid var(--border-card)', borderRadius: '6px', backgroundColor: 'var(--bg-item)' }}>
            <button 
              onClick={() => onRemoveItem(item.id)}
              style={{ position: 'absolute', top: '4px', right: '4px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
            >
              <X size={12} />
            </button>

            {item.type === 'recipe' ? (
              <div>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-title)', marginBottom: '4px', borderBottom: '1px solid var(--border-card)', paddingBottom: '2px', display: 'flex', justifyContent: 'space-between', paddingRight: '15px' }}>
                  <span>{item.name}</span>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>{item.amount} {item.unit}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {item.ingredients.map((ing, idx) => (
                    <span key={idx} style={{ fontSize: '10px', background: 'var(--bg-tag)', color: 'var(--text-tag)', padding: '2px 6px', borderRadius: '10px' }}>
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '12px', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between', paddingRight: '15px' }}>
                <span>{item.name}</span>
                <span style={{ color: 'var(--text-muted)' }}>{item.amount} {item.unit}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
