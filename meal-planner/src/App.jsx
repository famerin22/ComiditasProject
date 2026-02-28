import React, { useState, useEffect } from 'react';
import { Utensils, ShoppingCart, User } from 'lucide-react';
import DayRow from './DayRow';
import MOCK_DB, { getFoods } from './mockDb';
import FoodModal from './FoodModal';
import FoodManager from './FoodManager';

const DAYS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];

export default function App() {
// 1. The "State": What we are eating this week
 const [dbOptions, setDbOptions] = useState([]);
 const [modalOpen, setModalOpen] = useState(false);
 const [modalContext, setModalContext] = useState(null); // { person, day, time, option }
 const [schedules, setSchedules] = useState({
    fer: { Lunes: { almuerzo: "Pechuga", cena: "Sanguches de Miga" } },
    meli: { Lunes: { almuerzo: "Pechuga", cena: "Ensalada" } }
  });
const updateMeal = (person, day, time, value) => {
    setSchedules(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        [day]: {
          ...prev[person][day],
          [time]: value
        }
      }
    }));
  };

 useEffect(() => {
   // load initial foods
   setDbOptions(getFoods());
 }, []);

 const openFoodModal = (person, day, time, option) => {
   setModalContext({ person, day, time, option });
   setModalOpen(true);
 };

 const handleAddFoods = (selectedItems) => {
   if (!modalContext) return;
   const { person, day, time, option } = modalContext;
   const names = selectedItems.map(i => i.name);
   
   let newVal;
   if (option && option.is_recipe) {
     newVal = names.length > 0 
       ? `${option.name} (${names.join(', ')})` 
       : option.name;
   } else {
     newVal = names.join(', ');
   }

   updateMeal(person, day, time, newVal);
   setModalOpen(false);
   setModalContext(null);
 };
 return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <header style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>
          <Utensils /> MealPlan Pro
        </h1>
        <button style={{ padding: '10px 20px', backgroundColor: '#ff6b35', color: 'white', border: 'none', cursor: 'pointer' }}>
          <ShoppingCart size={20} /> Ver Lista de Compras
        </button>
      </header>

      {/* Main Container - Flex Row */}
      <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
        
        {/* FER'S COLUMN */}
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb', marginBottom: '10px' }}>
            <User /> Fer
          </h2>
          {DAYS.map(day => (
            <DayRow 
              key={day} 
              day={day} 
              data={schedules.fer[day] || {}} 
              options={dbOptions}
              onChange={(time, val) => updateMeal('fer', day, time, val)}
              onRequestAddFoods={(time, option) => openFoodModal('fer', day, time, option)}
            />
          ))}
        </div>

        {/* MELI'S COLUMN */}
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ec4899', marginBottom: '10px' }}>
            <User /> Meli
          </h2>
          {DAYS.map(day => (
            <DayRow 
              key={day} 
              day={day} 
              data={schedules.meli[day] || {}} 
              options={dbOptions}
              onChange={(time, val) => updateMeal('meli', day, time, val)}
              onRequestAddFoods={(time, option) => openFoodModal('meli', day, time, option)}
            />
          ))}
        </div>

      </div>

      <FoodManager onDatabaseChange={setDbOptions} />
      
      <FoodModal open={modalOpen} onClose={() => setModalOpen(false)} items={dbOptions.filter(i => !i.is_recipe)} onAdd={handleAddFoods} />
    </div>
  );
}

