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
  console.log('App mounting...');
  const [dbOptions, setDbOptions] = useState([]);
  const [schedules, setSchedules] = useState(() => {
    const s = getSchedule(INITIAL_STATE);
    console.log('Schedule loaded:', s);
    return s;
  });
  const [darkMode, setDarkMode] = useState(() => {
    const theme = localStorage.getItem('theme') === 'dark';
    console.log('Initial theme:', theme ? 'dark' : 'light');
    return theme;
  });

  useEffect(() => {
    console.log('App effect: loading foods');
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
      const ingredientNames = (food.ingredients || [])
        .map(id => dbOptions.find(f => f.id === id)?.name)
        .filter(Boolean);
      
      newItem = {
        id: Date.now(), // eslint-disable-line react-hooks/purity
        type: 'recipe',
        name: food.name,
        ingredients: ingredientNames,
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
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', transition: '0.3s' }}>
      <header style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Utensils /> MealPlan Pro
        </h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            style={{ padding: '10px', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button style={{ padding: '10px 20px', backgroundColor: '#ff6b35', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingCart size={20} /> Ver Lista de Compras
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
        {/* FER'S COLUMN */}
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#6366f1', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User /> Fer
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
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ec4899', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User /> Meli
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

      <FoodManager onDatabaseChange={setDbOptions} />
    </div>
  );
}
