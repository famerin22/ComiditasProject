import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, X, Check, Database, Search, UtensilsCrossed, Tag, BookOpen, Star, Scale, AlertCircle } from 'lucide-react';
import * as db from './db';
import { CATEGORIES, getSuggestedFactor } from './mockDb';
import { normalizeText, getSimilarity } from './utils';

function RecipeIngredientEditor({ ingredients = [], allFoods = [], onUpdate, currentFoodId }) {
  const [showAdd, setShowAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [amount, setAmount] = useState('1');
  const [unit, setUnit] = useState('');

  const availableIngredients = allFoods.filter(f => f.id !== currentFoodId);
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
          <UtensilsCrossed size={16} /> Ingredientes
        </h4>
        {!showAdd && !selectedFood && (
          <button onClick={() => setShowAdd(true)} style={{ padding: '8px 12px', fontSize: '12px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            + Añadir
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
        {ingredients.map((ing, idx) => {
          const food = allFoods.find(f => f.id === ing.id);
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--bg-tag)', color: 'var(--text-tag)', padding: '6px 12px', borderRadius: '20px', fontSize: '13px' }}>
              <span>{food?.name} ({ing.amount}{ing.unit})</span>
              <X size={16} onClick={() => removeIng(idx)} style={{ cursor: 'pointer', color: '#ef4444' }} />
            </div>
          );
        })}
      </div>

      {showAdd && !selectedFood && (
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <input 
            type="text" 
            placeholder="Buscar ingrediente..." 
            value={searchTerm}
            autoFocus
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', marginBottom: '10px', boxSizing: 'border-box', fontSize: '16px' }}
          />
          <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--border-card)', borderRadius: '8px' }}>
            {filtered.map(f => (
              <div key={f.id} onClick={() => handleAdd(f)} style={{ padding: '12px', cursor: 'pointer', borderBottom: '1px solid var(--border-card)', display: 'flex', justifyContent: 'space-between', fontSize: '14px', backgroundColor: 'var(--bg-input)' }}>
                <span>{f.name}</span>
                <span style={{ color: 'var(--text-muted)' }}>{f.default_unit}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setShowAdd(false)} style={{ marginTop: '10px', width: '100%', padding: '10px', background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-muted)', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>Cancelar</button>
        </div>
      )}

      {selectedFood && (
        <div style={{ backgroundColor: 'var(--bg-item)', border: '1px solid #10b981', borderRadius: '10px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-main)' }}>{selectedFood.name}</div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Cantidad</label>
              <input type="number" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '16px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Unidad</label>
              <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '16px' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setSelectedFood(null)} style={{ flex: 1, padding: '10px', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
            <button onClick={confirmAdd} style={{ flex: 1, padding: '10px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Añadir</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FoodManager({ onDatabaseChange }) {
  const [foods, setFoods] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', is_recipe: false, default_unit: 'g', ingredients: [], category: 'Otros', instructions: '', favorite: false, conversion_factor: 1.0 });
  const [showMainModal, setShowMainModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const refresh = async () => {
    const updated = await db.getFoods();
    setFoods(updated);
    onDatabaseChange(updated);
  };

  React.useEffect(() => {
    if (showMainModal) refresh();
  }, [showMainModal]);

  const normalizedFoods = useMemo(() => {
    return foods.map(f => ({ ...f, _normalized: normalizeText(f.name) }));
  }, [foods]);

  const duplicates = useMemo(() => {
    if (!formData.name.trim()) return [];
    const normalizedName = normalizeText(formData.name);
    return normalizedFoods.filter(f => f._normalized === normalizedName && f.id !== editingId);
  }, [formData.name, normalizedFoods, editingId]);

  const similarities = useMemo(() => {
    if (!formData.name.trim() || duplicates.length > 0) return [];
    return normalizedFoods
      .filter(f => f.id !== editingId)
      .map(f => ({ ...f, score: getSimilarity(formData.name, f.name) }))
      .filter(f => f.score >= 0.6)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [formData.name, normalizedFoods, editingId, duplicates]);

  const handleNameChange = (e) => {
    const name = e.target.value;
    const factor = getSuggestedFactor(name);
    setFormData({ ...formData, name, conversion_factor: factor });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;
    if (duplicates.length > 0) {
      alert(`El alimento "${duplicates[0].name}" ya existe en la base de datos.`);
      return;
    }
    if (editingId) {
      await db.updateFood(editingId, formData);
    } else {
      await db.addFood(formData);
    }
    setFormData({ name: '', is_recipe: false, default_unit: 'g', ingredients: [], category: 'Otros', instructions: '', favorite: false, conversion_factor: 1.0 });
    setIsAdding(false);
    setEditingId(null);
    refresh();
  };

  const toggleQuickFav = async (food) => {
    await db.updateFood(food.id, { ...food, favorite: !food.favorite });
    refresh();
  };

  const startEdit = (food) => {
    setEditingId(food.id);
    setFormData({ 
      name: food.name, 
      is_recipe: food.is_recipe, 
      default_unit: food.default_unit || 'g',
      ingredients: food.ingredients || [],
      category: food.category || 'Otros',
      instructions: food.instructions || '',
      favorite: food.favorite || false,
      conversion_factor: food.conversion_factor || 1.0
    });
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Borrar este alimento?')) {
      await db.deleteFood(id);
      refresh();
    }
  };

  const cancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', is_recipe: false, default_unit: 'g', ingredients: [], category: 'Otros', instructions: '', favorite: false, conversion_factor: 1.0 });
  };

  const filteredFoods = foods
    .filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0));

  return (
    <>
      <button onClick={() => setShowMainModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}>
        <Database size={18} /> <span style={{ fontSize: '14px' }}>Gestionar Alimentos</span>
      </button>

      {showMainModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '10px' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', width: '100%', maxWidth: '750px', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: 'var(--text-title)' }}>Base de Datos de Alimentos</h3>
              <button onClick={() => setShowMainModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
            </div>

            <div style={{ padding: '20px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
                  <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', boxSizing: 'border-box' }} />
                </div>
                {!isAdding && (
                  <button onClick={() => setIsAdding(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    <Plus size={18} /> Nuevo
                  </button>
                )}
              </div>

              {isAdding && (
                <div style={{ backgroundColor: 'var(--bg-item)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px', alignItems: 'flex-end' }}>
                    <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Nombre</span>
                      <input type="text" value={formData.name} onChange={handleNameChange} style={{ width: '100%', padding: '10px', border: `1px solid ${duplicates.length > 0 ? '#ef4444' : 'var(--border-color)'}`, borderRadius: '6px', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Categoría</span>
                      <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', boxSizing: 'border-box', height: '38px' }}>
                        {CATEGORIES.map(cat => <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>)}
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Unidad</span>
                      <input type="text" disabled={formData.is_recipe} value={formData.is_recipe ? 'unidades' : formData.default_unit} onChange={(e) => setFormData({ ...formData, default_unit: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: formData.is_recipe ? 'rgba(0,0,0,0.05)' : 'var(--bg-input)', color: 'var(--text-main)', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Factor (Cocido/Crudo)</span>
                      <div style={{ position: 'relative', width: '100%' }}>
                        <Scale size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }} />
                        <input type="number" step="0.05" value={formData.conversion_factor} onChange={(e) => setFormData({ ...formData, conversion_factor: parseFloat(e.target.value) || 1 })} style={{ width: '100%', padding: '10px 10px 10px 30px', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', boxSizing: 'border-box' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', height: '38px' }}>
                      <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)', cursor: 'pointer' }}>
                        <input type="checkbox" checked={formData.is_recipe} onChange={(e) => setFormData({ ...formData, is_recipe: e.target.checked, default_unit: e.target.checked ? 'unidades' : 'g' })} /> Receta
                      </label>
                      <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', cursor: 'pointer' }}>
                        <input type="checkbox" checked={formData.favorite} onChange={(e) => setFormData({ ...formData, favorite: e.target.checked })} /> Favorito
                      </label>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button onClick={handleSave} disabled={duplicates.length > 0} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '10px 18px', backgroundColor: duplicates.length > 0 ? '#94a3b8' : '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: duplicates.length > 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold', height: '38px' }}>
                        {duplicates.length > 0 ? 'Bloqueado' : <Check size={20}/>}
                      </button>
                      <button onClick={cancel} style={{ padding: '10px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', height: '38px' }}><X size={20}/></button>
                    </div>
                  </div>

                  {duplicates.length > 0 && (
                    <div style={{ marginTop: '10px', padding: '10px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertCircle size={16} />
                      <span>Ya existe un alimento con este nombre: <strong>{duplicates[0].name}</strong> ({duplicates[0].category})</span>
                    </div>
                  )}

                  {similarities.length > 0 && (
                    <div style={{ marginTop: '10px', padding: '10px', backgroundColor: 'var(--bg-item)', border: '1px solid #fbbf24', borderRadius: '8px', fontSize: '13px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#d97706' }}>
                        <AlertCircle size={16} />
                        <span style={{ fontWeight: 'bold' }}>¿Quisiste decir alguno de estos?</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {similarities.map(s => (
                          <button key={s.id} onClick={() => startEdit(s)} style={{ padding: '6px 10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '4px', transition: '0.2s' }}>
                            <Search size={12} /> {s.name} <span style={{ opacity: 0.6, fontSize: '10px' }}>({s.category})</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {formData.is_recipe && (
                    <div style={{ marginTop: '15px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}><BookOpen size={14} /> Instrucciones</span>
                      <textarea value={formData.instructions} onChange={(e) => setFormData({ ...formData, instructions: e.target.value })} style={{ width: '100%', height: '80px', padding: '10px', marginTop: '5px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '14px', resize: 'none' }} />
                      <RecipeIngredientEditor ingredients={formData.ingredients} allFoods={foods} onUpdate={(newIngs) => setFormData({ ...formData, ingredients: newIngs })} currentFoodId={editingId} />
                    </div>
                  )}
                </div>
              )}

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-card)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 8px' }}>Fav</th>
                    <th style={{ padding: '12px 8px' }}>Nombre</th>
                    <th style={{ padding: '12px 8px' }}>Factor</th>
                    <th style={{ padding: '12px 8px', textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFoods.map(food => (
                    <tr key={food.id} style={{ borderBottom: '1px solid var(--border-card)', fontSize: '14px' }}>
                      <td style={{ padding: '12px 8px' }}>
                        <Star size={18} onClick={() => toggleQuickFav(food)} fill={food.favorite ? '#fbbf24' : 'none'} color={food.favorite ? '#fbbf24' : 'var(--text-muted)'} style={{ cursor: 'pointer' }} />
                      </td>
                      <td style={{ padding: '12px 8px', color: 'var(--text-main)', fontWeight: 'bold' }}>
                        {food.name}
                        <div style={{ fontSize: '10px', fontWeight: 'normal', color: 'var(--text-muted)' }}>{food.category}</div>
                      </td>
                      <td style={{ padding: '12px 8px', color: 'var(--text-muted)', fontSize: '13px' }}>
                        x{food.conversion_factor || 1.0}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                          <button onClick={() => startEdit(food)} style={{ color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer' }}><Edit2 size={18}/></button>
                          <button onClick={() => handleDelete(food.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
