import React, { useState, useEffect } from 'react';
import { Utensils, ShoppingCart, User, Sun, Moon } from 'lucide-react';
import DayRow from './DayRow';
import { getFoods, getSchedule, saveSchedule } from './mockDb';
import FoodManager from './FoodManager';

const DAYS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];

const createEmptySchedule = () => {
  const s = {};
  DAYS.forEach(day => {
    s[day] = { almuerzo: [], cena: [] };
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
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
          <Utensils size={28} /> MealPlan Pro
        </h1>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', width: '100%' }}>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            style={{ padding: '10px', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <FoodManager onDatabaseChange={setDbOptions} />

          <button style={{ flex: 1, minWidth: '140px', padding: '10px 15px', backgroundColor: '#ff6b35', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
            <ShoppingCart size={18} /> <span style={{ whiteSpace: 'nowrap' }}>Lista de Compras</span>
          </button>
        </div>
      </header>

      <div className="main-grid" style={{ display: 'flex', gap: '20px', width: '100%', flexWrap: 'wrap' }}>
        {/* FER'S COLUMN */}
        <div style={{ flex: '1 1 350px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#6366f1', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-card)', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-card)' }}>
            <User size={20} /> Fer
          </h2>
          {DAYS.map(day => (
            <DayRow 
              key={day} 
              day={day} 
              data={schedules.fer[day]} 
              options={dbOptions}
              onAddItem={(time, foodId, amount, unit) => handleAddItem('fer', day, time, foodId, amount, unit)}
              onRemoveItem={(time, itemId) => handleRemoveItem('fer', day, time, itemId)}
            />
          ))}
        </div>

        {/* MELI'S COLUMN */}
        <div style={{ flex: '1 1 350px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ec4899', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-card)', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-card)' }}>
            <User size={20} /> Meli
          </h2>
          {DAYS.map(day => (
            <DayRow 
              key={day} 
              day={day} 
              data={schedules.meli[day]} 
              options={dbOptions}
              onAddItem={(time, foodId, amount, unit) => handleAddItem('meli', day, time, foodId, amount, unit)}
              onRemoveItem={(time, itemId) => handleRemoveItem('meli', day, time, itemId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
