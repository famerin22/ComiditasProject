import React, { useState } from 'react';
import { Plus, X, Check, Search, Copy, ArrowRight, Star, Info, BookOpen } from 'lucide-react';
import { getFoods, CATEGORIES } from './mockDb';

function RecipeDetailModal({ item, options, onClose }) {
  const foodDef = options.find(o => o.name === item.name && o.is_recipe);
  if (!foodDef) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1300, padding: '15px' }}>
      <div style={{ backgroundColor: 'var(--bg-card)', width: '100%', maxWidth: '500px', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', maxHeight: '80vh' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: 'var(--text-title)' }}>{item.name}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
        </div>
        <div style={{ padding: '20px', overflowY: 'auto' }}>
          <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={16} /> Ingredientes
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            {item.ingredients.map((ing, idx) => (
              <span key={idx} style={{ background: 'var(--bg-tag)', color: 'var(--text-tag)', padding: '5px 12px', borderRadius: '20px', fontSize: '13px' }}>{ing}</span>
            ))}
          </div>
          {foodDef.instructions && (
            <>
              <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={16} /> Instrucciones
              </h4>
              <div style={{ backgroundColor: 'var(--bg-item)', padding: '15px', borderRadius: '10px', fontSize: '14px', color: 'var(--text-main)', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                {foodDef.instructions}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FoodSelectorModal({ options, onSelect, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('Todas');

  const favorites = options.filter(o => o.favorite);
  const filteredOptions = options.filter(o => {
    const matchesSearch = o.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCat === 'Todas' || o.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '10px' }}>
      <div style={{ backgroundColor: 'var(--bg-card)', width: '100%', maxWidth: '500px', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: 'var(--text-title)' }}>Seleccionar Alimento</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '5px' }}><X size={24} /></button>
        </div>
        
        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Buscar alimento o receta..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '12px 12px 12px 35px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '16px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '5px', whiteSpace: 'nowrap' }}>
            {['Todas', ...CATEGORIES].map(cat => (
              <button key={cat} onClick={() => setSelectedCat(cat)} style={{ padding: '5px 12px', borderRadius: '15px', fontSize: '12px', border: '1px solid var(--border-color)', backgroundColor: selectedCat === cat ? '#6366f1' : 'var(--bg-item)', color: selectedCat === cat ? 'white' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 'bold' }}>{cat}</button>
            ))}
          </div>

          <div style={{ overflowY: 'auto', flex: 1 }}>
            {searchTerm === '' && selectedCat === 'Todas' && favorites.length > 0 && (
              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#fbbf24', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}><Star size={12} fill="#fbbf24" /> Favoritos</div>
                {favorites.map(food => (
                  <div key={`fav-${food.id}`} onClick={() => onSelect(food)} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid var(--border-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(251, 191, 36, 0.05)', borderRadius: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{food.name}</span>
                    <button style={{ padding: '4px 8px', backgroundColor: '#fbbf24', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Elegir</button>
                  </div>
                ))}
              </div>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-card)', textAlign: 'left' }}>
                  <th style={{ padding: '10px 8px', color: 'var(--text-muted)' }}>Nombre</th>
                  <th style={{ padding: '10px 8px', textAlign: 'right', color: 'var(--text-muted)' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredOptions.map(food => (
                  <tr key={food.id} style={{ borderBottom: '1px solid var(--border-card)' }}>
                    <td style={{ padding: '12px 8px', color: 'var(--text-main)', fontWeight: 500 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {food.favorite && <Star size={12} fill="#fbbf24" color="#fbbf24" />}
                        {food.name}
                      </div>
                      <div style={{ fontSize: '10px', marginTop: '2px' }}>
                        <span style={{ padding: '1px 4px', borderRadius: '3px', backgroundColor: food.is_recipe ? 'var(--bg-tag)' : 'rgba(0,0,0,0.05)', color: food.is_recipe ? 'var(--text-tag)' : 'var(--text-muted)' }}>{food.is_recipe ? 'Receta' : 'Ingrediente'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                      <button onClick={() => onSelect(food)} style={{ padding: '8px 12px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>Elegir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuantityModal({ food, onConfirm, onCancel, initialAmount = '1', initialUnit = '' }) {
  const [amount, setAmount] = useState(initialAmount);
  const [unit, setUnit] = useState(initialUnit || food.default_unit || (food.is_recipe ? 'unidades' : 'g'));

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '15px' }}>
      <div style={{ backgroundColor: 'var(--bg-card)', width: '100%', maxWidth: '400px', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: 'var(--text-title)' }}>Definir Cantidad</h3>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '5px' }}><X size={24} /></button>
        </div>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#6366f1', textAlign: 'center' }}>{food.name}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Cantidad</label>
              <input type="number" autoFocus inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', boxSizing: 'border-box', fontSize: '16px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Unidad</label>
              {food.is_recipe ? (
                <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-item)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', fontSize: '16px' }}>unidades</div>
              ) : (
                <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="g, ml, fetas..." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', boxSizing: 'border-box', fontSize: '16px' }} />
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <button onClick={onCancel} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>Cancelar</button>
            <button onClick={() => onConfirm(amount, food.is_recipe ? 'unidades' : unit)} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', backgroundColor: '#10b981', color: 'white', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '16px' }}><Check size={20} /> Confirmar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const CATEGORY_COLORS = {
  'Proteína': '#f87171',
  'Carne': '#ef4444',
  'Pasta': '#fbbf24',
  'Verdura': '#34d399',
  'Legumbres': '#60a5fa',
  'Lácteo': '#a78bfa',
  'Salsa': '#f472b6',
  'Otros': '#94a3b8'
};

export default function MealSlot({ label, items = [], options = [], onAddItem, onRemoveItem, onUpdateItem, onCopyAll, onCopyToTomorrow }) {
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [selectedFoodForQty, setSelectedFoodForQty] = useState(null);
  const [viewRecipe, setViewRecipe] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const handleSelectFood = (food) => {
    setSelectedFoodForQty(food);
    setShowFoodModal(false);
  };

  const handleConfirmQty = (amount, unit) => {
    if (editingItem) {
      onUpdateItem(editingItem.id, amount, unit);
      setEditingItem(null);
    } else if (selectedFoodForQty) {
      onAddItem(selectedFoodForQty.id, amount, unit);
      setSelectedFoodForQty(null);
    }
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setSelectedFoodForQty({ ...item, is_recipe: item.type === 'recipe', default_unit: item.unit });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginLeft: 4, display: 'flex', alignItems: 'center', gap: '4px' }}>{label}</div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {items.length > 0 && (
            <>
              <button onClick={onCopyToTomorrow} title="Copiar a mañana" style={{ padding: '2px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><ArrowRight size={14} /></button>
              <button onClick={onCopyAll} title="Copiar al otro usuario" style={{ padding: '2px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Copy size={14} /></button>
            </>
          )}
          <button onClick={() => setShowFoodModal(true)} style={{ padding: '2px', background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Plus size={16} /></button>
        </div>
      </div>

      {showFoodModal && <FoodSelectorModal options={options} onSelect={handleSelectFood} onClose={() => setShowFoodModal(false)} />}
      
      {viewRecipe && <RecipeDetailModal item={viewRecipe} options={options} onClose={() => setViewRecipe(null)} />}

      {selectedFoodForQty && (
        <QuantityModal 
          food={selectedFoodForQty}
          initialAmount={editingItem ? editingItem.amount : '1'}
          initialUnit={editingItem ? editingItem.unit : (selectedFoodForQty.default_unit || 'g')}
          onConfirm={handleConfirmQty}
          onCancel={() => { setSelectedFoodForQty(null); setEditingItem(null); }}
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map(item => (
          <div key={item.id} style={{ position: 'relative', padding: '8px', border: '1px solid var(--border-card)', borderLeft: `4px solid ${CATEGORY_COLORS[item.category] || CATEGORY_COLORS['Otros']}`, borderRadius: '6px', backgroundColor: 'var(--bg-item)', cursor: 'pointer' }} onClick={() => startEdit(item)}>
            <div style={{ position: 'absolute', top: '4px', right: '4px', display: 'flex', gap: '5px' }}>
              {item.type === 'recipe' && (
                <button onClick={(e) => { e.stopPropagation(); setViewRecipe(item); }} style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', padding: 0 }}><Info size={14} /></button>
              )}
              <button onClick={(e) => { e.stopPropagation(); onRemoveItem(item.id); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}><X size={12} /> </button>
            </div>

            <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-title)', marginBottom: '2px', paddingRight: '35px', display: 'flex', justifyContent: 'space-between' }}>
              <span>{item.name}</span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 'normal', fontSize: '11px' }}>{item.amount}{item.unit}</span>
            </div>
            {item.type === 'recipe' && item.ingredients && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '4px' }}>
                {item.ingredients.slice(0, 3).map((ing, idx) => (
                  <span key={idx} style={{ fontSize: '9px', background: 'var(--bg-tag)', color: 'var(--text-tag)', padding: '1px 5px', borderRadius: '8px' }}>{ing}</span>
                ))}
                {item.ingredients.length > 3 && <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>...</span>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
