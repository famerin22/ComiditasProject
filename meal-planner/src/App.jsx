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

  // 2. Mock Database (This would come from Supabase later)
  const recipes = {
    "Fideos con Pollo": [
      { name: "fideos", amount: 100, is_buyable: true },
      { name: "pechuga", amount: 150, is_buyable: true }
    ],
    "Sanguches de Miga": [
      { name: "pan", amount: 2, is_buyable: false } // Miga isn't on the list!
    ]
  }

  // 3. The "Shopping List" Logic (Your PhD Brain in JS)
  const generateShoppingList = () => {
    const totals = {}

    Object.values(schedule).forEach(day => {
      Object.values(day).forEach(mealName => {
        const components = recipes[mealName] || [{ name: mealName, amount: 200, is_buyable: true }]
        
        components.forEach(item => {
          if (!item.is_buyable) return // THE "MIGA" SKIP LOGIC
          totals[item.name] = (totals[item.name] || 0) + item.amount
        })
      })
    })
    return totals
  }

  const shoppingList = generateShoppingList()

  return (
    <div className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">Planificador de Comidas</h1>
      
      {/* 4. The Schedule View */}
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(schedule).map(([day, meals]) => (
          <div key={day} className="border p-4 rounded shadow">
            <h3 className="font-bold border-b mb-2">{day}</h3>
            <p>Lunch: {meals.almuerzo}</p>
            <p>Dinner: {meals.cena}</p>
          </div>
        ))}
      </div>

      {/* 5. The Live Shopping List */}
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-bold mb-2">Lista de Compras</h2>
        {Object.entries(shoppingList).map(([item, amount]) => (
          <div key={item} className="flex justify-between border-b py-1">
            <span>{item}</span>
            <span>{amount}g</span>
          </div>
        ))}
      </div>
    </div>
  )
}