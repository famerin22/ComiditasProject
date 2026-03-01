import React, { useState, useEffect } from 'react';
import { Utensils, ShoppingCart, User, Sun, Moon, X, CheckCircle2 } from 'lucide-react';
import DayRow from './DayRow';
import { getFoods, getSchedule, saveSchedule } from './mockDb';
import FoodManager from './FoodManager';

const DAYS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

function ShoppingListModal({ schedules, dbOptions, activeUser, onClose }) {
  const [viewMode, setViewUser] = useState('combined'); // 'fer', 'meli', or 'combined'
  const [boughtItems, setBoughtItems] = useState(() => {
    const saved = localStorage.getItem('meal_planner_bought');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('meal_planner_bought', JSON.stringify(boughtItems));
  }, [boughtItems]);

  const aggregateIngredients = () => {
    const totals = {};
    const usersToInclude = viewMode === 'combined' ? ['fer', 'meli'] : [viewMode === 'active' ? activeUser : viewMode];

    usersToInclude.forEach(u => {
      const userSchedule = schedules[u];
      Object.values(userSchedule).forEach(dayData => {
        Object.values(dayData).forEach(mealItems => {
          mealItems.forEach(item => {
            if (item.type === 'recipe') {
              const recipeDef = dbOptions.find(f => f.name === item.name && f.is_recipe);
              if (recipeDef && recipeDef.ingredients) {
                recipeDef.ingredients.forEach(ing => {
                  const food = dbOptions.find(f => f.id === ing.id);
                  if (food) {
                    const key = `${food.name}|${ing.unit}`;
                    if (!totals[key]) totals[key] = { name: food.name, amount: 0, unit: ing.unit };
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
    });

    return Object.values(totals).sort((a, b) => a.name.localeCompare(b.name));
  };

  const ingredients = aggregateIngredients();

  const toggleBought = (key) => {
    setBoughtItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const clearBought = () => {
    if (confirm('¿Vaciar los elementos marcados?')) setBoughtItems({});
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '10px' }}>
      <div style={{ backgroundColor: 'var(--bg-card)', width: '100%', maxWidth: '500px', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        <div style={{ padding: '15px 20px', borderBottom: '1px solid var(--border-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: 'var(--text-title)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingCart size={20} /> Lista de Compras
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* SELECTOR DE VISTA */}
        <div style={{ display: 'flex', gap: '5px', padding: '10px 20px', backgroundColor: 'var(--bg-item)', borderBottom: '1px solid var(--border-card)' }}>
          <button 
            onClick={() => setViewUser('combined')}
            style={{ flex: 1, padding: '8px', fontSize: '12px', borderRadius: '6px', border: 'none', backgroundColor: viewMode === 'combined' ? '#6366f1' : 'transparent', color: viewMode === 'combined' ? 'white' : 'var(--text-muted)', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Ambos
          </button>
          <button 
            onClick={() => setViewUser('fer')}
            style={{ flex: 1, padding: '8px', fontSize: '12px', borderRadius: '6px', border: 'none', backgroundColor: viewMode === 'fer' ? '#6366f1' : 'transparent', color: viewMode === 'fer' ? 'white' : 'var(--text-muted)', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Solo Fer
          </button>
          <button 
            onClick={() => setViewUser('meli')}
            style={{ flex: 1, padding: '8px', fontSize: '12px', borderRadius: '6px', border: 'none', backgroundColor: viewMode === 'meli' ? '#ec4899' : 'transparent', color: viewMode === 'meli' ? 'white' : 'var(--text-muted)', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Solo Meli
          </button>
        </div>
        
        <div style={{ padding: '15px 20px', overflowY: 'auto', flex: 1 }}>
          {ingredients.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
              No hay alimentos en el menú de {viewMode === 'combined' ? 'nadie' : viewMode}.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {ingredients.map((ing, idx) => {
                const key = `${ing.name}-${ing.unit}`;
                const isBought = boughtItems[key];
                return (
                  <div 
                    key={idx} 
                    onClick={() => toggleBought(key)}
                    style={{ 
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                      padding: '10px 12px', borderRadius: '8px', backgroundColor: isBought ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-input)', 
                      border: `1px solid ${isBought ? '#10b981' : 'var(--border-color)'}`,
                      cursor: 'pointer', transition: '0.1s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {isBought ? <CheckCircle2 size={18} color="#10b981" /> : <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid var(--border-color)' }} />}
                      <span style={{ fontSize: '14px', color: isBought ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: isBought ? 'line-through' : 'none' }}>
                        {ing.name}
                      </span>
                    </div>
                    <span style={{ fontWeight: 'bold', color: isBought ? 'var(--text-muted)' : '#6366f1', fontSize: '13px' }}>
                      {ing.amount}{ing.unit}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <div style={{ padding: '15px 20px', borderTop: '1px solid var(--border-card)', display: 'flex', gap: '10px' }}>
          <button onClick={clearBought} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ef4444', backgroundColor: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '13px' }}>
            Limpiar Marcados
          </button>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
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
          schedules={schedules} 
          dbOptions={dbOptions}
          activeUser={activeUser}
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
