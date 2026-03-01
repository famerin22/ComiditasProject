import React, { useState, useEffect } from 'react';
import { Utensils, ShoppingCart, User, Sun, Moon, X, CheckCircle2, Home, Share2 } from 'lucide-react';
import DayRow from './DayRow';
import { getFoods, getSchedule, saveSchedule } from './mockDb';
import FoodManager from './FoodManager';

const DAYS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

function ShoppingListModal({ schedules, dbOptions, viewMode, setViewUser, onClose }) {
  const [boughtItems, setBoughtItems] = useState(() => {
    const saved = localStorage.getItem('meal_planner_bought');
    return saved ? JSON.parse(saved) : {};
  });

  const [extraItems, setExtraItems] = useState(() => {
    const saved = localStorage.getItem('meal_planner_extras');
    return saved ? JSON.parse(saved) : [];
  });

  const [newExtra, setNewExtra] = useState('');

  useEffect(() => { localStorage.setItem('meal_planner_bought', JSON.stringify(boughtItems)); }, [boughtItems]);
  useEffect(() => { localStorage.setItem('meal_planner_extras', JSON.stringify(extraItems)); }, [extraItems]);

  const addExtra = () => {
    if (!newExtra.trim()) return;
    setExtraItems([...extraItems, { id: Date.now(), name: newExtra.trim(), bought: false }]);
    setNewExtra('');
  };

  const toggleExtra = (id) => {
    setExtraItems(extraItems.map(item => item.id === id ? { ...item, bought: !item.bought } : item));
  };

  const removeExtra = (id) => {
    setExtraItems(extraItems.filter(item => item.id !== id));
  };

  const aggregateIngredients = () => {
    const totals = {};
    const usersToInclude = viewMode === 'combined' ? ['fer', 'meli'] : [viewMode];

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
                    if (!totals[key]) totals[key] = { name: food.name, amount: 0, unit: ing.unit, category: food.category || 'Otros' };
                    
                    // Conversion factor for recipes is complex as it's a fixed dish, 
                    // but the ingredients themselves might have factors. 
                    // For now, we multiply recipe units by ingredient amount.
                    totals[key].amount += Number(ing.amount) * Number(item.amount);
                  }
                });
              }
            } else {
              const key = `${item.name}|${item.unit}`;
              if (!totals[key]) totals[key] = { name: item.name, amount: 0, unit: item.unit, category: item.category || 'Otros' };
              
              // Apply conversion factor: raw = cooked / factor
              const factor = item.conversion_factor || 1.0;
              const rawAmount = Number(item.amount) / factor;
              totals[key].amount += rawAmount;
            }
          });
        });
      });
    });

    const grouped = {};
    Object.values(totals).forEach(ing => {
      if (!grouped[ing.category]) grouped[ing.category] = [];
      // Round to 1 decimal place
      ing.amount = Math.round(ing.amount * 10) / 10;
      grouped[ing.category].push(ing);
    });

    return Object.keys(grouped).sort().map(cat => ({
      category: cat,
      items: grouped[cat].sort((a, b) => a.name.localeCompare(b.name))
    }));
  };

  const groupedIngredients = aggregateIngredients();

  const toggleBought = (key) => {
    setBoughtItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const clearBought = () => {
    if (confirm('¿Vaciar los elementos marcados?')) {
      setBoughtItems({});
      setExtraItems(extraItems.filter(i => !i.bought));
    }
  };

  const markAllBought = () => {
    const newBought = { ...boughtItems };
    groupedIngredients.forEach(group => {
      group.items.forEach(ing => { newBought[`${ing.name}-${ing.unit}`] = true; });
    });
    setExtraItems(extraItems.map(i => ({ ...i, bought: true })));
    setBoughtItems(newBought);
  };

  const formatListForSharing = () => {
    let text = `🛒 *LISTA DE COMPRAS (${viewMode === 'combined' ? 'AMBOS' : viewMode.toUpperCase()})*\n\n`;
    groupedIngredients.forEach(group => {
      const pendingInGroup = group.items.filter(ing => !boughtItems[`${ing.name}-${ing.unit}`]);
      if (pendingInGroup.length > 0) {
        text += `*--- ${group.category.toUpperCase()} ---*\n`;
        pendingInGroup.forEach(ing => { text += `• ${ing.name}: ${ing.amount}${ing.unit}\n`; });
        text += `\n`;
      }
    });
    const pendingExtras = extraItems.filter(i => !i.bought);
    if (pendingExtras.length > 0) {
      text += `*--- EXTRAS ---*\n`;
      pendingExtras.forEach(item => { text += `• ${item.name}\n`; });
    }
    return text || "¡Lista de compras vacía!";
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(formatListForSharing());
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '10px' }}>
      <div style={{ backgroundColor: 'var(--bg-card)', width: '100%', maxWidth: '500px', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        <div style={{ padding: '15px 20px', borderBottom: '1px solid var(--border-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: 'var(--text-title)', display: 'flex', alignItems: 'center', gap: '10px' }}><ShoppingCart size={20} /> Compra</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
        </div>

        <div style={{ display: 'flex', gap: '5px', padding: '10px 20px', backgroundColor: 'var(--bg-item)', borderBottom: '1px solid var(--border-card)' }}>
          {['combined', 'fer', 'meli'].map(m => (
            <button key={m} onClick={() => setViewUser(m)} style={{ flex: 1, padding: '8px', fontSize: '12px', borderRadius: '6px', border: 'none', backgroundColor: viewMode === m ? (m === 'meli' ? '#ec4899' : '#6366f1') : 'transparent', color: viewMode === m ? 'white' : 'var(--text-muted)', fontWeight: 'bold', cursor: 'pointer' }}>
              {m === 'combined' ? 'Ambos' : m.toUpperCase()}
            </button>
          ))}
        </div>
        
        <div style={{ padding: '10px 20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={markAllBought} style={{ fontSize: '11px', background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}>Marcar todo como comprado</button>
        </div>

        <div style={{ padding: '0 20px 15px 20px', overflowY: 'auto', flex: 1 }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input type="text" placeholder="Añadir extra..." value={newExtra} onChange={(e) => setNewExtra(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addExtra()} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '14px' }} />
              <button onClick={addExtra} style={{ padding: '10px 15px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {extraItems.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '8px', backgroundColor: item.bought ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-item)', border: `1px solid ${item.bought ? '#10b981' : 'var(--border-color)'}` }}>
                  <div onClick={() => toggleExtra(item.id)} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    {item.bought ? <CheckCircle2 size={18} color="#10b981" /> : <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid var(--border-color)' }} />}
                    <span style={{ fontSize: '14px', color: item.bought ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: item.bought ? 'line-through' : 'none' }}>{item.name}</span>
                  </div>
                  <X size={16} onClick={() => removeExtra(item.id)} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} />
                </div>
              ))}
            </div>
          </div>

          {groupedIngredients.map((group, gIdx) => (
            <div key={gIdx} style={{ marginBottom: '15px' }}>
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ height: '1px', flex: 1, backgroundColor: 'var(--border-color)' }} /> {group.category} <div style={{ height: '1px', flex: 1, backgroundColor: 'var(--border-color)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {group.items.map((ing, idx) => {
                  const key = `${ing.name}-${ing.unit}`;
                  const isBought = boughtItems[key];
                  return (
                    <div key={idx} onClick={() => toggleBought(key)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '8px', backgroundColor: isBought ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-input)', border: `1px solid ${isBought ? '#10b981' : 'var(--border-color)'}`, cursor: 'pointer' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {isBought ? <CheckCircle2 size={18} color="#10b981" /> : <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid var(--border-color)' }} />}
                        <span style={{ fontSize: '14px', color: isBought ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: isBought ? 'line-through' : 'none' }}>{ing.name}</span>
                      </div>
                      <span style={{ fontWeight: 'bold', color: isBought ? 'var(--text-muted)' : '#6366f1', fontSize: '13px' }}>{ing.amount}{ing.unit}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ padding: '15px 20px', borderTop: '1px solid var(--border-card)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={shareWhatsApp} style={{ padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#25D366', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Share2 size={18} /> WhatsApp</button>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={clearBought} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ef4444', backgroundColor: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '13px' }}>Limpiar</button>
            <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function WeeklyStats({ schedule }) {
  const stats = {};
  Object.values(schedule).forEach(day => {
    Object.values(day).forEach(meal => {
      meal.forEach(item => {
        const cat = item.category || 'Otros';
        stats[cat] = (stats[cat] || 0) + 1;
      });
    });
  });

  const CATEGORY_COLORS = {
    'Proteína': '#f87171', 'Carne': '#ef4444', 'Pasta': '#fbbf24',
    'Verdura': '#34d399', 'Legumbres': '#60a5fa', 'Lácteo': '#a78bfa',
    'Salsa': '#f472b6', 'Otros': '#94a3b8'
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-card)', padding: '15px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
      <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-title)', display: 'flex', alignItems: 'center', gap: '8px' }}>📊 Equilibrio Semanal</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {Object.entries(stats).map(([cat, count]) => (
          <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--bg-item)', padding: '5px 10px', borderRadius: '20px', border: `1px solid ${CATEGORY_COLORS[cat] || '#ccc'}` }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: CATEGORY_COLORS[cat] }} />
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{cat}: {count}</span>
          </div>
        ))}
        {Object.keys(stats).length === 0 && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Planifica algunas comidas para ver las estadísticas.</span>}
      </div>
    </div>
  );
}

const INITIAL_STATE = {
  fer: Object.fromEntries(DAYS.map(d => [d, { desayuno: [], almuerzo: [], merienda: [], cena: [] }])),
  meli: Object.fromEntries(DAYS.map(d => [d, { desayuno: [], almuerzo: [], merienda: [], cena: [] }]))
};

export default function App() {
  const [dbOptions, setDbOptions] = useState([]);
  const [schedules, setSchedules] = useState(() => getSchedule(INITIAL_STATE));
  const [activeUser, setActiveUser] = useState('fer');
  const [viewMode, setViewMode] = useState('combined');
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [templates, setTemplates] = useState(() => JSON.parse(localStorage.getItem('meal_planner_templates') || '[]'));
  const [recentFoods, setRecentFoods] = useState(() => JSON.parse(localStorage.getItem('meal_planner_recent') || '[]'));
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => { setDbOptions(getFoods()); }, []);
  useEffect(() => { saveSchedule(schedules); }, [schedules]);
  useEffect(() => { localStorage.setItem('meal_planner_templates', JSON.stringify(templates)); }, [templates]);
  useEffect(() => { localStorage.setItem('meal_planner_recent', JSON.stringify(recentFoods)); }, [recentFoods]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handlePrint = () => window.print();
  const exportData = () => {
    const data = { db: localStorage.getItem('meal_planner_db'), schedule: localStorage.getItem('meal_planner_schedule'), extras: localStorage.getItem('meal_planner_extras') };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `mealplan_backup.json`; a.click();
  };
  const importData = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = JSON.parse(event.target.result);
      if (data.db) localStorage.setItem('meal_planner_db', data.db);
      if (data.schedule) localStorage.setItem('meal_planner_schedule', data.schedule);
      if (data.extras) localStorage.setItem('meal_planner_extras', data.extras);
      window.location.reload();
    };
    reader.readAsText(file);
  };

  const handleAddItem = (person, day, time, foodId, amount, unit) => {
    const food = dbOptions.find(f => f.id === Number(foodId)); if (!food) return;
    setRecentFoods(prev => [food.id, ...prev.filter(id => id !== food.id)].slice(0, 8));
    const newItem = {
      id: Date.now(), // eslint-disable-line react-hooks/purity
      type: food.is_recipe ? 'recipe' : 'ingredient',
      name: food.name,
      category: food.category || 'Otros',
      amount,
      unit,
      conversion_factor: food.conversion_factor || 1.0,
      ingredients: food.is_recipe ? (food.ingredients || []).map(ing => {
        const detail = dbOptions.find(f => f.id === ing.id);
        return detail ? `${detail.name} (${ing.amount}${ing.unit})` : null;
      }).filter(Boolean) : []
    };
    setSchedules(prev => ({...prev, [person]: { ...prev[person], [day]: { ...prev[person][day], [time]: [...prev[person][day][time], newItem] }}}));
  };

  const handleUpdateItem = (person, day, time, itemId, amount, unit) => {
    setSchedules(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        [day]: {
          ...prev[person][day],
          [time]: prev[person][day][time].map(item => {
            if (item.id === itemId) {
              // Lookup original factor from db just in case
              const foodDef = dbOptions.find(f => f.name === item.name);
              return { ...item, amount, unit, conversion_factor: foodDef?.conversion_factor || item.conversion_factor || 1.0 };
            }
            return item;
          })
        }
      }
    }));
  };

  const handleRemoveItem = (person, day, time, itemId) => {
    setSchedules(prev => ({...prev, [person]: { ...prev[person], [day]: { ...prev[person][day], [time]: prev[person][day][time].filter(i => i.id !== itemId) }}}));
  };

  const handleCopyMeal = (day, time) => {
    const otherUser = activeUser === 'fer' ? 'meli' : 'fer';
    const itemsToCopy = schedules[activeUser][day][time].map(item => ({ ...item, id: Date.now() + Math.random() }));
    if (itemsToCopy.length === 0) return;
    setSchedules(prev => ({...prev, [otherUser]: { ...prev[otherUser], [day]: { ...prev[otherUser][day], [time]: [...prev[otherUser][day][time], ...itemsToCopy] }}}));
    alert(`Copiado a ${otherUser.toUpperCase()}`);
  };

  const handleCopyToTomorrow = (currentDay, time) => {
    const currentIndex = DAYS.indexOf(currentDay);
    if (currentIndex === -1 || currentIndex === DAYS.length - 1) return alert("No hay mañana.");
    const tomorrow = DAYS[currentIndex + 1];
    const itemsToCopy = schedules[activeUser][currentDay][time].map(item => ({ ...item, id: Date.now() + Math.random() }));
    if (itemsToCopy.length === 0) return;
    setSchedules(prev => ({...prev, [activeUser]: { ...prev[activeUser], [tomorrow]: { ...prev[activeUser][tomorrow], [time]: [...prev[activeUser][tomorrow][time], ...itemsToCopy] }}}));
    alert(`Copiado al ${tomorrow}`);
  };

  const handleClearDay = (day) => {
    if (confirm(`¿Vaciar ${day}?`)) setSchedules(prev => ({...prev, [activeUser]: { ...prev[activeUser], [day]: { desayuno: [], almuerzo: [], merienda: [], cena: [] }}}));
  };

  const shareWeeklyMenu = () => {
    const schedule = schedules[activeUser];
    let text = `📅 *MENÚ SEMANAL (${activeUser.toUpperCase()})*\n\n`;
    DAYS.forEach(day => {
      const meals = schedule[day];
      if (meals.almuerzo.length || meals.cena.length) {
        text += `*${day.toUpperCase()}*\n`;
        if (meals.desayuno.length) text += `☕ ${meals.desayuno.map(i => i.name).join(', ')}\n`;
        if (meals.almuerzo.length) text += `🍴 ${meals.almuerzo.map(i => i.name).join(', ')}\n`;
        if (meals.merienda.length) text += `🍪 ${meals.merienda.map(i => i.name).join(', ')}\n`;
        if (meals.cena.length) text += `🌙 ${meals.cena.map(i => i.name).join(', ')}\n`;
        text += `\n`;
      }
    });
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const saveAsTemplate = () => {
    const name = prompt('Nombre de la plantilla:'); if (!name) return;
    setTemplates([...templates, { id: Date.now(), name, schedule: schedules[activeUser] }]);
  };

  const loadTemplate = (template) => {
    if (confirm(`¿Cargar "${template.name}"?`)) setSchedules(prev => ({ ...prev, [activeUser]: template.schedule }));
  };

  const deleteTemplate = (id) => { if (confirm('¿Borrar?')) setTemplates(templates.filter(t => t.id !== id)); };

  const getTodayName = () => ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'][new Date().getDay()];
  const todayName = getTodayName();

  return (
    <div style={{ padding: '10px 15px', minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', transition: '0.3s' }}>
      <header style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}><Utensils size={28} /> MealPlan Pro</h1>
          <button onClick={() => setDarkMode(!darkMode)} style={{ padding: '10px', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>{darkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <FoodManager onDatabaseChange={setDbOptions} />
          <button onClick={exportData} style={{ padding: '10px', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>📥</button>
          <label style={{ padding: '10px', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer' }}>📤<input type="file" onChange={importData} style={{ display: 'none' }} /></label>
          <button onClick={() => setShowShoppingList(true)} style={{ flex: 1, minWidth: '120px', padding: '10px 15px', backgroundColor: '#ff6b35', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}><ShoppingCart size={18} /> Lista</button>
        </div>
      </header>

      {showShoppingList && <ShoppingListModal schedules={schedules} dbOptions={dbOptions} viewMode={viewMode} setViewUser={setViewMode} onClose={() => setShowShoppingList(false)} />}

      <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--bg-card)', padding: '6px', borderRadius: '14px', marginBottom: '15px', border: '1px solid var(--border-color)' }}>
        {['fer', 'meli'].map(u => (
          <button key={u} onClick={() => setActiveUser(u)} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', backgroundColor: activeUser === u ? (u === 'fer' ? '#6366f1' : '#ec4899') : 'transparent', color: activeUser === u ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: '0.2s' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>{u[0].toUpperCase()}</div> {u === 'fer' ? 'Fer' : 'Meli'}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={shareWeeklyMenu} style={{ padding: '8px 15px', fontSize: '12px', borderRadius: '6px', border: '1px solid #25D366', color: '#25D366', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>Compartir</button>
          <button onClick={handlePrint} className="no-print" style={{ padding: '8px 15px', fontSize: '12px', borderRadius: '6px', border: '1px solid var(--text-muted)', color: 'var(--text-main)', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>🖨️ Imprimir</button>
          <button onClick={() => setShowStats(!showStats)} style={{ padding: '8px 15px', fontSize: '12px', borderRadius: '6px', border: '1px solid #6366f1', color: '#6366f1', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>{showStats ? '📊 Ocultar Stats' : '📊 Ver Stats'}</button>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={saveAsTemplate} style={{ padding: '8px 15px', fontSize: '12px', borderRadius: '6px', border: '1px solid #6366f1', color: '#6366f1', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>💾 Guardar</button>
          <button onClick={() => { if(confirm('¿Vaciar semana?')) setSchedules(prev => ({...prev, [activeUser]: Object.fromEntries(DAYS.map(d => [d, { desayuno: [], almuerzo: [], merienda: [], cena: [] }]))})) }} style={{ padding: '8px 15px', fontSize: '12px', borderRadius: '6px', border: '1px solid #ef4444', color: '#ef4444', backgroundColor: 'transparent', cursor: 'pointer' }}>Vaciar</button>
        </div>
      </div>

      {showStats && <WeeklyStats schedule={schedules[activeUser]} />}

      {templates.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Mis Plantillas</div>
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', whiteSpace: 'nowrap' }}>
            {templates.map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: 'var(--bg-card)', padding: '5px 10px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                <span onClick={() => loadTemplate(t)} style={{ cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>{t.name}</span>
                <X size={14} onClick={() => deleteTemplate(t.id)} style={{ cursor: 'pointer', color: '#ef4444' }} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
        {DAYS.map(day => <DayRow key={day} day={day} isToday={day === todayName} data={schedules[activeUser][day]} options={dbOptions} onAddItem={(time, foodId, amount, unit) => handleAddItem(activeUser, day, time, foodId, amount, unit)} onRemoveItem={(time, itemId) => handleRemoveItem(activeUser, day, time, itemId)} onUpdateItem={(time, id, amount, unit) => handleUpdateItem(activeUser, day, time, id, amount, unit)} onCopyMeal={handleCopyMeal} onCopyToTomorrow={handleCopyToTomorrow} onClearDay={handleClearDay} recentFoods={recentFoods} />)}
      </div>
    </div>
  );
}
