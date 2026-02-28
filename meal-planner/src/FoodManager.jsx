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
    <div style={{ padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px', marginTop: '20px', border: '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Base de Datos de Alimentos</h3>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            <Plus size={16} /> Añadir
          </button>
        )}
      </div>

      {isAdding && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', alignItems: 'center', backgroundColor: '#fff', padding: '10px', borderRadius: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <input 
            type="text" 
            placeholder="Nombre del alimento" 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{ flex: 1, padding: '5px', border: '1px solid #d1d5db', borderRadius: '4px' }}
          />
          <label style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input 
              type="checkbox" 
              checked={formData.is_recipe}
              onChange={(e) => setFormData({ ...formData, is_recipe: e.target.checked })}
            /> Receta
          </label>
          <button onClick={handleSave} style={{ color: '#10b981', background: 'none', border: 'none', cursor: 'pointer' }}><Check size={20}/></button>
          <button onClick={cancel} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><X size={20}/></button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
        {foods.map(food => (
          <div key={food.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
            <span style={{ fontSize: '14px' }}>
              {food.name} {food.is_recipe && <small style={{ color: '#6b7280', fontStyle: 'italic' }}>(Receta)</small>}
            </span>
            <div style={{ display: 'flex', gap: '5px' }}>
              <button onClick={() => startEdit(food)} style={{ color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}><Edit2 size={14}/></button>
              <button onClick={() => handleDelete(food.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}><Trash2 size={14}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
