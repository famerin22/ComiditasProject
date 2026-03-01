import React, { useState, useEffect } from 'react';
import { Utensils, ShoppingCart, User, Sun, Moon, X, CheckCircle2 } from 'lucide-react';
import DayRow from './DayRow';
import { getFoods, getSchedule, saveSchedule } from './mockDb';
import FoodManager from './FoodManager';

const DAYS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];

function ShoppingListModal({ schedule, dbOptions, onClose }) {
  const [boughtItems, setBoughtItems] = useState({});

  const aggregateIngredients = () => {
    const totals = {}; // { "Nombre (Unidad)": { amount: 0, unit: '' } }

    Object.values(schedule).forEach(dayData => {
      Object.values(dayData).forEach(mealItems => {
        mealItems.forEach(item => {
          if (item.type === 'recipe') {
            // Find recipe in DB to get original ingredients with IDs
            const recipeDef = dbOptions.find(f => f.name === item.name && f.is_recipe);
            if (recipeDef && recipeDef.ingredients) {
              recipeDef.ingredients.forEach(ing => {
                const food = dbOptions.find(f => f.id === ing.id);
                if (food) {
                  const key = `${food.name}|${ing.unit}`;
                  if (!totals[key]) totals[key] = { name: food.name, amount: 0, unit: ing.unit };
                  // Multiply ingredient amount by number of recipe units
                  totals[key].amount += Number(ing.amount) * Number(item.amount);
                }
              });
            }
          } else {
            const key = `${item.name}|${item.unit}`;
            if (!totals[key]) totals[key] = { name: item.name, amount: 0, unit: item.unit };
            totals[key].amount += Number(item.amount);
          }
        });
      });
    });

    return Object.values(totals).sort((a, b) => a.name.localeCompare(b.name));
  };

  const ingredients = aggregateIngredients();

  const toggleBought = (key) => {
    setBoughtItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '15px' }}>
      <div style={{ backgroundColor: 'var(--bg-card)', width: '100%', maxWidth: '500px', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: 'var(--text-title)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingCart /> Lista de Compras
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>
        
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {ingredients.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
              No hay alimentos agregados al menú.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {ingredients.map((ing, idx) => {
                const key = `${ing.name}-${ing.unit}`;
                const isBought = boughtItems[key];
                return (
                  <div 
                    key={idx} 
                    onClick={() => toggleBought(key)}
                    style={{ 
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                      padding: '12px 15px', borderRadius: '10px', backgroundColor: isBought ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-item)', 
                      border: `1px solid ${isBought ? '#10b981' : 'var(--border-color)'}`,
                      cursor: 'pointer', transition: '0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {isBought ? <CheckCircle2 size={20} color="#10b981" /> : <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid var(--border-color)' }} />}
                      <span style={{ color: isBought ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: isBought ? 'line-through' : 'none', fontWeight: isBought ? 'normal' : '500' }}>
                        {ing.name}
                      </span>
                    </div>
                    <span style={{ fontWeight: 'bold', color: isBought ? 'var(--text-muted)' : '#6366f1', fontSize: '14px' }}>
                      {ing.amount} {ing.unit}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <div style={{ padding: '15px', borderTop: '1px solid var(--border-card)' }}>
          <button onClick={onClose} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [dbOptions, setDbOptions] = useState([]);
  const [schedules, setSchedules] = useState(() => getSchedule(INITIAL_STATE));
  const [activeUser, setActiveUser] = useState('fer');
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    setDbOptions(getFoods());
  }, []);

  useEffect(() => {
    saveSchedule(schedules);
  }, [schedules]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleAddItem = (person, day, time, foodId, amount, unit) => {
    const food = dbOptions.find(f => f.id === Number(foodId));
    if (!food) return;

    let newItem;
    if (food.is_recipe) {
      const ingredientDetails = (food.ingredients || [])
        .map(ing => {
          const detail = dbOptions.find(f => f.id === ing.id);
          return detail ? `${detail.name} (${ing.amount}${ing.unit})` : null;
        })
        .filter(Boolean);
      
      newItem = {
        id: Date.now(), // eslint-disable-line react-hooks/purity
        type: 'recipe',
        name: food.name,
        ingredients: ingredientDetails,
        amount,
        unit
      };
    } else {
      newItem = {
        id: Date.now(), // eslint-disable-line react-hooks/purity
        type: 'ingredient',
        name: food.name,
        amount,
        unit
      };
    }

    setSchedules(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        [day]: {
          ...prev[person][day],
          [time]: [...prev[person][day][time], newItem]
        }
      }
    }));
  };

  const handleRemoveItem = (person, day, time, itemId) => {
    setSchedules(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        [day]: {
          ...prev[person][day],
          [time]: prev[person][day][time].filter(i => i.id !== itemId)
        }
      }
    }));
  };

  return (
    <div style={{ padding: '10px 15px', minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', transition: '0.3s' }}>
      <header style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <Utensils size={28} /> MealPlan Pro
          </h1>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            style={{ padding: '10px', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', width: '100%' }}>
          <FoodManager onDatabaseChange={setDbOptions} />
          <button 
            onClick={() => setShowShoppingList(true)}
            style={{ flex: 1, minWidth: '140px', padding: '10px 15px', backgroundColor: '#ff6b35', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}
          >
            <ShoppingCart size={18} /> <span style={{ whiteSpace: 'nowrap' }}>Lista de Compras</span>
          </button>
        </div>
      </header>

      {showShoppingList && (
        <ShoppingListModal 
          schedule={schedules[activeUser]} 
          dbOptions={dbOptions}
          onClose={() => setShowShoppingList(false)} 
        />
      )}

      {/* USER TABS */}
      <div style={{ display: 'flex', backgroundColor: 'var(--bg-card)', padding: '5px', borderRadius: '12px', marginBottom: '20px', border: '1px solid var(--border-color)' }}>
        <button 
          onClick={() => setActiveUser('fer')}
          style={{ 
            flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px',
            backgroundColor: activeUser === 'fer' ? '#6366f1' : 'transparent',
            color: activeUser === 'fer' ? 'white' : 'var(--text-muted)',
            transition: '0.2s'
          }}
        >
          <User size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Fer
        </button>
        <button 
          onClick={() => setActiveUser('meli')}
          style={{ 
            flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px',
            backgroundColor: activeUser === 'meli' ? '#ec4899' : 'transparent',
            color: activeUser === 'meli' ? 'white' : 'var(--text-muted)',
            transition: '0.2s'
          }}
        >
          <User size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Meli
        </button>
      </div>

      <div className="main-grid">
        <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          {DAYS.map(day => (
            <DayRow 
              key={day} 
              day={day} 
              data={schedules[activeUser][day]} 
              options={dbOptions}
              onAddItem={(time, foodId, amount, unit) => handleAddItem(activeUser, day, time, foodId, amount, unit)}
              onRemoveItem={(time, itemId) => handleRemoveItem(activeUser, day, time, itemId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
