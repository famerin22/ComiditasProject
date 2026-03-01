import React, { useState, useEffect } from 'react';
import { Utensils, ShoppingCart, User, Sun, Moon } from 'lucide-react';
import DayRow from './DayRow';
import { getFoods, getSchedule, saveSchedule } from './mockDb';
import FoodManager from './FoodManager';

const DAYS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];

const createEmptySchedule = () => {
  const s = {};
  DAYS.forEach(day => {
    s[day] = { desayuno: [], almuerzo: [], merienda: [], cena: [] };
  });
  return s;
};

const INITIAL_STATE = {
  fer: createEmptySchedule(),
  meli: createEmptySchedule()
};

export default function App() {
  const [dbOptions, setDbOptions] = useState([]);
  const [schedules, setSchedules] = useState(() => getSchedule(INITIAL_STATE));
  const [activeUser, setActiveUser] = useState('fer');
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
          <button style={{ flex: 1, minWidth: '140px', padding: '10px 15px', backgroundColor: '#ff6b35', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
            <ShoppingCart size={18} /> <span style={{ whiteSpace: 'nowrap' }}>Lista de Compras</span>
          </button>
        </div>
      </header>

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
