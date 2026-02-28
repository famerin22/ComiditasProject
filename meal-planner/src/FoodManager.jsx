import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check, Database, Search } from 'lucide-react';
import { addFood, updateFood, deleteFood, getFoods } from './mockDb';

export default function FoodManager({ onDatabaseChange }) {
  const [foods, setFoods] = useState(getFoods());
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', is_recipe: false });
  const [showMainModal, setShowMainModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredFoods = foods.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <button 
        onClick={() => setShowMainModal(true)}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          padding: '10px 16px', 
          backgroundColor: 'var(--bg-card)', 
          color: 'var(--text-main)', 
          border: '1px solid var(--border-color)', 
          borderRadius: '8px', 
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: '0.2s'
        }}
        title="Gestionar Base de Datos de Alimentos"
      >
        <Database size={18} /> <span style={{ fontSize: '14px' }}>Gestionar Alimentos</span>
      </button>

      {showMainModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', width: '100%', maxWidth: '700px', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: 'var(--text-title)' }}>Base de Datos de Alimentos</h3>
              <button onClick={() => setShowMainModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: '20px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
                  <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    placeholder="Buscar..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                  />
                </div>
                {!isAdding && (
                  <button 
                    onClick={() => setIsAdding(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    <Plus size={18} /> Nuevo Alimento
                  </button>
                )}
              </div>

              {isAdding && (
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center', backgroundColor: 'var(--bg-item)', padding: '15px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <input 
                    type="text" 
                    placeholder="Nombre del alimento" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ flex: 1, padding: '10px', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)' }}
                  />
                  <label style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={formData.is_recipe}
                      onChange={(e) => setFormData({ ...formData, is_recipe: e.target.checked })}
                    /> Receta
                  </label>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={handleSave} style={{ color: '#10b981', background: 'none', border: 'none', cursor: 'pointer' }}><Check size={28}/></button>
                    <button onClick={cancel} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><X size={28}/></button>
                  </div>
                </div>
              )}

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-card)', color: 'var(--text-muted)', fontSize: '14px' }}>
                      <th style={{ padding: '12px 8px' }}>Nombre</th>
                      <th style={{ padding: '12px 8px' }}>Tipo</th>
                      <th style={{ padding: '12px 8px', textAlign: 'right' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFoods.map(food => (
                      <tr key={food.id} style={{ borderBottom: '1px solid var(--border-card)', fontSize: '15px' }}>
                        <td style={{ padding: '12px 8px', color: 'var(--text-main)' }}>{food.name}</td>
                        <td style={{ padding: '12px 8px' }}>
                          <span style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '6px', backgroundColor: food.is_recipe ? 'var(--bg-tag)' : 'rgba(0,0,0,0.05)', color: food.is_recipe ? 'var(--text-tag)' : 'var(--text-muted)' }}>
                            {food.is_recipe ? 'Receta' : 'Ingrediente'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button onClick={() => startEdit(food)} style={{ color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><Edit2 size={18}/></button>
                            <button onClick={() => handleDelete(food.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><Trash2 size={18}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
