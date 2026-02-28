import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { addFood, updateFood, deleteFood, getFoods } from './mockDb';

export default function FoodManager({ onDatabaseChange }) {
  const [foods, setFoods] = useState(getFoods());
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', is_recipe: false });

  const refresh = () => {
    const updated = getFoods();
    setFoods(updated);
    onDatabaseChange(updated);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;
    if (editingId) {
      updateFood(editingId, formData);
    } else {
      addFood(formData);
    }
    setFormData({ name: '', is_recipe: false });
    setIsAdding(false);
    setEditingId(null);
    refresh();
  };

  const startEdit = (food) => {
    setEditingId(food.id);
    setFormData({ name: food.name, is_recipe: food.is_recipe });
    setIsAdding(true);
  };

  const handleDelete = (id) => {
    if (confirm('¿Borrar este alimento?')) {
      deleteFood(id);
      refresh();
    }
  };

  const cancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', is_recipe: false });
  };

  return (
    <div style={{ padding: '20px', backgroundColor: 'var(--bg-card)', borderRadius: '12px', marginTop: '20px', border: '1px solid var(--border-card)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-title)' }}>Base de Datos de Alimentos</h3>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            <Plus size={16} /> Añadir
          </button>
        )}
      </div>

      {isAdding && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', alignItems: 'center', backgroundColor: 'var(--bg-item)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <input 
            type="text" 
            placeholder="Nombre del alimento" 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{ flex: 1, padding: '8px', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)' }}
          />
          <label style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)' }}>
            <input 
              type="checkbox" 
              checked={formData.is_recipe}
              onChange={(e) => setFormData({ ...formData, is_recipe: e.target.checked })}
            /> Receta
          </label>
          <button onClick={handleSave} style={{ color: '#10b981', background: 'none', border: 'none', cursor: 'pointer' }}><Check size={24}/></button>
          <button onClick={cancel} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><X size={24}/></button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
        {foods.map(food => (
          <div key={food.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--bg-item)', border: '1px solid var(--border-card)', borderRadius: '8px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-main)' }}>
              {food.name} {food.is_recipe && <small style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>(Receta)</small>}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => startEdit(food)} style={{ color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><Edit2 size={16}/></button>
              <button onClick={() => handleDelete(food.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
