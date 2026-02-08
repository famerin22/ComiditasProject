import React, { useState } from 'react';
import { Utensils, ShoppingCart, User } from 'lucide-react';

const DAYS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];

export default function App() {
  // 1. The "State": What we are eating this week
const [schedules, setSchedules] = useState({
  fer: {
    Lunes: { almuerzo: "Pechuga con Arroz", cena: "Sanguches de Miga" },
    Martes: { almuerzo: "Fideos", cena: "Carne" },
    // ... rest of the week
  },
  meli: {
    Lunes: { almuerzo: "Pechuga con Arroz", cena: "Ensalada" },
    Martes: { almuerzo: "Tarta", cena: "Sopa" },
    // ... rest of the week
  }
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
 return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-3xl font-black text-slate-800 flex items-center gap-2">
          <Utensils className="text-orange-500" /> MealPlan Pro
        </h1>
        <button className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 transition">
          <ShoppingCart size={20} /> Ver Lista de Compras
        </button>
      </header>

      {/* Main Dashboard Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* FER'S COLUMN */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-blue-600">
            <User /> Agenda de Fer
          </h2>
          {DAYS.map(day => (
            <DayRow 
              key={day} 
              day={day} 
              data={schedules.fer[day] || {}} 
              onChange={(time, val) => updateMeal('fer', day, time, val)} 
            />
          ))}
        </div>

        {/* MELI'S COLUMN */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-pink-600">
            <User /> Agenda de Meli
          </h2>
          {DAYS.map(day => (
            <DayRow 
              key={day} 
              day={day} 
              data={schedules.meli[day] || {}} 
              onChange={(time, val) => updateMeal('meli', day, time, val)} 
            />
          ))}
        </div>

      </div>
    </div>
  );
}

