import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check, Database, Search, UtensilsCrossed } from 'lucide-react';
import { addFood, updateFood, deleteFood, getFoods } from './mockDb';

function RecipeIngredientEditor({ ingredients = [], allFoods = [], onUpdate }) {
  const [showAdd, setShowAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [amount, setAmount] = useState('1');
  const [unit, setUnit] = useState('');

  const availableIngredients = allFoods.filter(f => !f.is_recipe);
  const filtered = availableIngredients.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAdd = (food) => {
    setSelectedFood(food);
    setAmount('1');
    setUnit(food.default_unit || 'g');
  };

  const confirmAdd = () => {
    const newIngs = [...ingredients, { id: selectedFood.id, amount, unit }];
    onUpdate(newIngs);
    setSelectedFood(null);
    setShowAdd(false);
    setSearchTerm('');
  };

  const removeIng = (idx) => {
    const newIngs = ingredients.filter((_, i) => i !== idx);
    onUpdate(newIngs);
  };

  return (
    <div style={{ marginTop: '15px', borderTop: '1px solid var(--border-card)', paddingTop: '15px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text-title)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <UtensilsCrossed size={16} /> Ingredientes de la Receta
        </h4>
        {!showAdd && !selectedFood && (
          <button onClick={() => setShowAdd(true)} style={{ padding: '4px 8px', fontSize: '12px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            + Añadir Ingrediente
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
        {ingredients.map((ing, idx) => {
          const food = allFoods.find(f => f.id === ing.id);
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--bg-tag)', color: 'var(--text-tag)', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' }}>
              <span>{food?.name} ({ing.amount}{ing.unit})</span>
              <X size={14} onClick={() => removeIng(idx)} style={{ cursor: 'pointer', color: '#ef4444' }} />
            </div>
          );
        })}
      </div>

      {showAdd && !selectedFood && (
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px' }}>
          <input 
            type="text" 
            placeholder="Buscar ingrediente..." 
            value={searchTerm}
            autoFocus
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', marginBottom: '8px', boxSizing: 'border-box' }}
          />
          <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
            {filtered.map(f => (
              <div key={f.id} onClick={() => handleAdd(f)} style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid var(--border-card)', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span>{f.name}</span>
                <span style={{ color: 'var(--text-muted)' }}>{f.default_unit}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setShowAdd(false)} style={{ marginTop: '8px', width: '100%', padding: '6px', background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-muted)', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Cancelar</button>
        </div>
      )}

      {selectedFood && (
        <div style={{ backgroundColor: 'var(--bg-item)', border: '1px solid #10b981', borderRadius: '8px', padding: '12px', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>{selectedFood.name}</div>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Unidad</div>
            <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
          </div>
          <button onClick={confirmAdd} style={{ padding: '8px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Check size={18}/></button>
          <button onClick={() => setSelectedFood(null)} style={{ padding: '8px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><X size={18}/></button>
        </div>
      )}
    </div>
  );
}

export default function FoodManager({ onDatabaseChange }) {
  const [foods, setFoods] = useState(getFoods());
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', is_recipe: false, default_unit: 'g', ingredients: [] });
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
    setFormData({ name: '', is_recipe: false, default_unit: 'g', ingredients: [] });
    setIsAdding(false);
    setEditingId(null);
    refresh();
  };

  const startEdit = (food) => {
    setEditingId(food.id);
    setFormData({ 
      name: food.name, 
      is_recipe: food.is_recipe, 
      default_unit: food.default_unit || 'g',
      ingredients: food.ingredients || []
    });
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
    setFormData({ name: '', is_recipe: false, default_unit: 'g', ingredients: [] });
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
                <div style={{ backgroundColor: 'var(--bg-item)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: 2, minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', marginLeft: '2px' }}>Nombre</span>
                      <input 
                        type="text" 
                        placeholder="Ej: Pechuga de Pollo" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{ width: '100%', padding: '10px', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                      />
                    </div>
                    
                    <div style={{ flex: 1, minWidth: '100px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', marginLeft: '2px' }}>Unidad</span>
                      {formData.is_recipe ? (
                        <div style={{ padding: '10px', borderRadius: '6px', backgroundColor: 'rgba(0,0,0,0.05)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', fontSize: '14px', height: '38px', boxSizing: 'border-box', display: 'flex', alignItems: 'center' }}>
                          unidades
                        </div>
                      ) : (
                        <input 
                          type="text" 
                          placeholder="g, ml..." 
                          value={formData.default_unit}
                          onChange={(e) => setFormData({ ...formData, default_unit: e.target.value })}
                          style={{ width: '100%', padding: '10px', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                        />
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center', minWidth: '70px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>¿Receta?</span>
                      <label style={{ height: '38px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={formData.is_recipe}
                          onChange={(e) => setFormData({ ...formData, is_recipe: e.target.checked, default_unit: e.target.checked ? 'unidades' : 'g' })}
                          style={{ width: '18px', height: '18px' }}
                        />
                      </label>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={handleSave} style={{ padding: '10px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}><Check size={20}/></button>
                      <button onClick={cancel} style={{ padding: '10px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}><X size={20}/></button>
                    </div>
                  </div>

                  {formData.is_recipe && (
                    <RecipeIngredientEditor 
                      ingredients={formData.ingredients} 
                      allFoods={foods} 
                      onUpdate={(newIngs) => setFormData({ ...formData, ingredients: newIngs })} 
                    />
                  )}
                </div>
              )}

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-card)', color: 'var(--text-muted)', fontSize: '14px' }}>
                      <th style={{ padding: '12px 8px' }}>Nombre</th>
                      <th style={{ padding: '12px 8px' }}>Tipo</th>
                      <th style={{ padding: '12px 8px' }}>Unidad Defecto</th>
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
                        <td style={{ padding: '12px 8px', color: 'var(--text-muted)', fontSize: '13px' }}>
                          {food.default_unit || (food.is_recipe ? 'unidades' : 'g')}
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
