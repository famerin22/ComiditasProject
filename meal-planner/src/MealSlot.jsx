import React, { useState } from 'react';
import { Plus, X, Check, Search } from 'lucide-react';

function FoodSelectorModal({ options, onSelect, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter(o => 
    o.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '10px' }}>
      <div style={{ backgroundColor: 'var(--bg-card)', width: '100%', maxWidth: '500px', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: 'var(--text-title)' }}>Seleccionar Alimento</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '5px' }}>
            <X size={24} />
          </button>
        </div>
        
        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Buscar alimento o receta..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '12px 12px 12px 35px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '16px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ overflowY: 'auto', flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-card)', textAlign: 'left' }}>
                  <th style={{ padding: '10px 8px', color: 'var(--text-muted)' }}>Nombre</th>
                  <th style={{ padding: '10px 8px', textAlign: 'right', color: 'var(--text-muted)' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredOptions.length > 0 ? (
                  filteredOptions.map(food => (
                    <tr key={food.id} style={{ borderBottom: '1px solid var(--border-card)' }}>
                      <td style={{ padding: '12px 8px', color: 'var(--text-main)', fontWeight: 500 }}>
                        {food.name}
                        <div style={{ fontSize: '10px', marginTop: '2px' }}>
                          <span style={{ padding: '1px 4px', borderRadius: '3px', backgroundColor: food.is_recipe ? 'var(--bg-tag)' : 'rgba(0,0,0,0.05)', color: food.is_recipe ? 'var(--text-tag)' : 'var(--text-muted)' }}>
                            {food.is_recipe ? 'Receta' : 'Ingrediente'}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                        <button 
                          onClick={() => onSelect(food)}
                          style={{ padding: '8px 12px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
                        >
                          Elegir
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No se encontraron resultados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuantityModal({ food, onConfirm, onCancel }) {
  const [amount, setAmount] = useState('1');
  const [unit, setUnit] = useState(food.default_unit || (food.is_recipe ? 'unidades' : 'g'));

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '15px' }}>
      <div style={{ backgroundColor: 'var(--bg-card)', width: '100%', maxWidth: '400px', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: 'var(--text-title)' }}>Definir Cantidad</h3>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '5px' }}>
            <X size={24} />
          </button>
        </div>
        
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#6366f1', textAlign: 'center' }}>
            {food.name}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Cantidad</label>
              <input 
                type="number" 
                autoFocus
                inputMode="decimal"
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', boxSizing: 'border-box', fontSize: '16px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Unidad</label>
              {food.is_recipe ? (
                <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-item)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', fontSize: '16px' }}>
                  unidades
                </div>
              ) : (
                <input 
                  type="text" 
                  value={unit} 
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="g, ml, fetas..."
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', boxSizing: 'border-box', fontSize: '16px' }}
                />
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <button 
              onClick={onCancel}
              style={{ flex: 1, padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
            >
              Cancelar
            </button>
            <button 
              onClick={() => onConfirm(amount, food.is_recipe ? 'unidades' : unit)}
              style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', backgroundColor: '#10b981', color: 'white', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '16px' }}
            >
              <Check size={20} /> Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MealSlot({ label, items = [], options = [], onAddItem, onRemoveItem }) {
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [selectedFoodForQty, setSelectedFoodForQty] = useState(null);

  const handleSelectFood = (food) => {
    setSelectedFoodForQty(food);
    setShowFoodModal(false);
  };

  const handleConfirmQty = (amount, unit) => {
    if (selectedFoodForQty) {
      onAddItem(selectedFoodForQty.id, amount, unit);
      setSelectedFoodForQty(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginLeft: 4 }}>
          {label}
        </label>
        <button 
          onClick={() => setShowFoodModal(true)}
          style={{ padding: '2px', background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <Plus size={16} />
        </button>
      </div>

      {showFoodModal && (
        <FoodSelectorModal 
          options={options} 
          onSelect={handleSelectFood} 
          onClose={() => setShowFoodModal(false)} 
        />
      )}

      {selectedFoodForQty && (
        <QuantityModal 
          food={selectedFoodForQty}
          onConfirm={handleConfirmQty}
          onCancel={() => setSelectedFoodForQty(null)}
        />
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
