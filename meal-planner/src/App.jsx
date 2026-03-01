import React, { useState, useEffect, useCallback } from 'react';
import { Utensils, ShoppingCart, User, Sun, Moon, X, CheckCircle2, Home, Share2, RefreshCcw, Cat } from 'lucide-react';
import DayRow from './DayRow';
import * as db from './db';
import FoodManager from './FoodManager';
import { supabase } from './supabase';

const DAYS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];

function ShoppingListModal({ schedules, dbOptions, viewMode, setViewUser, onClose }) {
  const [boughtItems, setBoughtItems] = useState({});
  const [extraItems, setExtraItems] = useState([]);
  const [newExtra, setNewExtra] = useState('');

  useEffect(() => {
    db.getExtras().then(setExtraItems);
    db.getShoppingState().then(setBoughtItems);
  }, []);

  const addExtra = async () => {
    if (!newExtra.trim()) return;
    const item = await db.addExtra(newExtra.trim());
    setExtraItems([...extraItems, item]);
    setNewExtra('');
  };

  const toggleExtra = async (id, currentBought) => {
    await db.updateExtra(id, !currentBought);
    setExtraItems(extraItems.map(item => item.id === id ? { ...item, bought: !currentBought } : item));
  };

  const removeExtra = async (id) => {
    await db.deleteExtra(id);
    setExtraItems(extraItems.filter(item => item.id !== id));
  };

  const aggregateIngredients = () => {
    const totals = {};
    const usersToInclude = viewMode === 'combined' ? ['fer', 'meli'] : [viewMode];

    const processItem = (itemName, itemAmount, isRecipe) => {
      if (isRecipe) {
        const recipeDef = dbOptions.find(f => f.name === itemName && f.is_recipe);
        if (recipeDef && recipeDef.ingredients) {
          recipeDef.ingredients.forEach(ing => {
            const food = dbOptions.find(f => f.id === ing.id);
            if (food) {
              const neededAmount = Number(ing.amount) * Number(itemAmount);
              processItem(food.name, neededAmount, food.is_recipe);
            }
          });
        }
      } else {
        const foodDef = dbOptions.find(f => f.name === itemName);
        const factor = foodDef?.conversion_factor || 1.0;
        const unit = foodDef?.default_unit || 'g';
        const rawAmount = Number(itemAmount) / factor;
        const key = `${itemName}|${unit}`;
        if (!totals[key]) totals[key] = { name: itemName, amount: 0, unit: unit, category: foodDef?.category || 'Otros' };
        totals[key].amount += rawAmount;
      }
    };

    usersToInclude.forEach(u => {
      const userSchedule = schedules[u];
      if (userSchedule) {
        Object.values(userSchedule).forEach(dayData => {
          Object.values(dayData).forEach(mealItems => {
            if (Array.isArray(mealItems)) {
              mealItems.forEach(item => processItem(item.name, item.amount, item.type === 'recipe'));
            }
          });
        });
      }
    });

    const grouped = {};
    Object.values(totals).forEach(ing => {
      if (!grouped[ing.category]) grouped[ing.category] = [];
      ing.amount = Math.round(ing.amount * 10) / 10;
      grouped[ing.category].push(ing);
    });

    return Object.keys(grouped).sort().map(cat => ({
      category: cat,
      items: grouped[cat].sort((a, b) => a.name.localeCompare(b.name))
    }));
  };

  const groupedIngredients = aggregateIngredients();

  const toggleBought = async (key) => {
    const newVal = !boughtItems[key];
    await db.updateShoppingState(key, newVal);
    setBoughtItems(prev => ({ ...prev, [key]: newVal }));
  };

  const clearBought = async () => {
    if (confirm('¿Vaciar los elementos marcados?')) {
      await db.clearShoppingState();
      await db.deleteBoughtExtras();
      setBoughtItems({});
      setExtraItems(extraItems.filter(i => !i.bought));
    }
  };

  const markAllBought = async () => {
    const newBought = { ...boughtItems };
    const promises = [];
    groupedIngredients.forEach(group => {
      group.items.forEach(ing => { 
        const key = `${ing.name}-${ing.unit}`;
        newBought[key] = true;
        promises.push(db.updateShoppingState(key, true));
      });
    });
    extraItems.forEach(i => promises.push(db.updateExtra(i.id, true)));
    await Promise.all(promises);
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
                  <div onClick={() => toggleExtra(item.id, item.bought)} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
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
  if (schedule) {
    Object.values(schedule).forEach(day => {
      Object.values(day).forEach(meal => {
        if (Array.isArray(meal)) {
          meal.forEach(item => {
            const cat = item.category || 'Otros';
            stats[cat] = (stats[cat] || 0) + 1;
          });
        }
      });
    });
  }

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

const INITIAL_SCHEDULE = {
  fer: Object.fromEntries(DAYS.map(d => [d, { desayuno: [], almuerzo: [], merienda: [], cena: [] }])),
  meli: Object.fromEntries(DAYS.map(d => [d, { desayuno: [], almuerzo: [], merienda: [], cena: [] }]))
};

export default function App() {
  const [dbOptions, setDbOptions] = useState([]);
  const [schedules, setSchedules] = useState(INITIAL_SCHEDULE);
  const [activeUser, setActiveUser] = useState('fer');
  const [viewMode, setViewMode] = useState('combined');
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [recentFoods, setRecentFoods] = useState(() => JSON.parse(localStorage.getItem('meal_planner_recent') || '[]'));
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const foods = await db.getFoods();
      setDbOptions(foods);
      
      const remoteSchedules = await db.getSchedules();
      if (remoteSchedules) {
        setSchedules(prev => ({ ...INITIAL_SCHEDULE, ...remoteSchedules }));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // REALTIME UPDATES
    const foodChannel = supabase.channel('foods_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'foods' }, () => {
        db.getFoods().then(setDbOptions);
      }).subscribe();

    const scheduleChannel = supabase.channel('schedules_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'schedules' }, () => {
        db.getSchedules().then(res => res && setSchedules(prev => ({ ...INITIAL_SCHEDULE, ...res })));
      }).subscribe();

    return () => {
      supabase.removeChannel(foodChannel);
      supabase.removeChannel(scheduleChannel);
    };
  }, [loadData]);

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'tortie');
    if (theme !== 'light') document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const modes = ['light', 'dark', 'tortie'];
    const next = modes[(modes.indexOf(theme) + 1) % modes.length];
    setTheme(next);
  };

  const handleAddItem = async (person, day, time, foodId, amount, unit) => {
    const food = dbOptions.find(f => f.id === Number(foodId) || f.id === foodId);
    if (!food) return;
    
    const newRecent = [food.id, ...recentFoods.filter(id => id !== food.id)].slice(0, 8);
    setRecentFoods(newRecent);
    localStorage.setItem('meal_planner_recent', JSON.stringify(newRecent));

    const newItem = {
      id: Date.now(),
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

    const currentItems = (schedules[person] && schedules[person][day] && schedules[person][day][time]) || [];
    const updatedItems = [...currentItems, newItem];
    
    await db.saveMealItems(person, day, time, updatedItems);
    setSchedules(prev => ({...prev, [person]: { ...prev[person], [day]: { ...prev[person][day], [time]: updatedItems }}}));
  };

  const handleUpdateItem = async (person, day, time, itemId, amount, unit) => {
    const updatedItems = schedules[person][day][time].map(item => {
      if (item.id === itemId) {
        const foodDef = dbOptions.find(f => f.name === item.name);
        return { ...item, amount, unit, conversion_factor: foodDef?.conversion_factor || item.conversion_factor || 1.0 };
      }
      return item;
    });

    await db.saveMealItems(person, day, time, updatedItems);
    setSchedules(prev => ({...prev, [person]: { ...prev[person], [day]: { ...prev[person][day], [time]: updatedItems }}}));
  };

  const handleRemoveItem = async (person, day, time, itemId) => {
    const updatedItems = schedules[person][day][time].filter(i => i.id !== itemId);
    await db.saveMealItems(person, day, time, updatedItems);
    setSchedules(prev => ({...prev, [person]: { ...prev[person], [day]: { ...prev[person][day], [time]: updatedItems }}}));
  };

  const handleCopyMeal = async (day, time) => {
    const otherUser = activeUser === 'fer' ? 'meli' : 'fer';
    const scale = activeUser === 'fer' ? 0.65 : 1.54;
    const itemsToCopy = (schedules[activeUser] && schedules[activeUser][day] && schedules[activeUser][day][time] || []).map(item => ({ 
      ...item, 
      id: Date.now() + Math.random(),
      amount: Math.round((parseFloat(item.amount) || 0) * scale * 10) / 10
    }));
    
    if (itemsToCopy.length === 0) return;
    
    const existingItems = (schedules[otherUser] && schedules[otherUser][day] && schedules[otherUser][day][time]) || [];
    const updatedItems = [...existingItems, ...itemsToCopy];
    
    await db.saveMealItems(otherUser, day, time, updatedItems);
    setSchedules(prev => ({...prev, [otherUser]: { ...prev[otherUser], [day]: { ...prev[otherUser][day], [time]: updatedItems }}}));
    alert(`Copiado a ${otherUser.toUpperCase()} (Escalado x${scale})`);
  };

  const handleCopyToTomorrow = async (currentDay, time) => {
    const currentIndex = DAYS.indexOf(currentDay);
    if (currentIndex === -1 || currentIndex === DAYS.length - 1) return alert("No hay mañana.");
    const tomorrow = DAYS[currentIndex + 1];
    const itemsToCopy = (schedules[activeUser] && schedules[activeUser][currentDay] && schedules[activeUser][currentDay][time] || []).map(item => ({ ...item, id: Date.now() + Math.random() }));
    
    if (itemsToCopy.length === 0) return;
    
    const existingItems = (schedules[activeUser] && schedules[activeUser][tomorrow] && schedules[activeUser][tomorrow][time]) || [];
    const updatedItems = [...existingItems, ...itemsToCopy];
    
    await db.saveMealItems(activeUser, tomorrow, time, updatedItems);
    setSchedules(prev => ({...prev, [activeUser]: { ...prev[activeUser], [tomorrow]: { ...prev[activeUser][tomorrow], [time]: updatedItems }}}));
    alert(`Copiado al ${tomorrow}`);
  };

  const handleClearDay = async (day) => {
    if (confirm(`¿Vaciar ${day}?`)) {
      await db.clearDaySchedule(activeUser, day);
      setSchedules(prev => ({...prev, [activeUser]: { ...prev[activeUser], [day]: { desayuno: [], almuerzo: [], merienda: [], cena: [] }}}));
    }
  };

  const shareWeeklyMenu = () => {
    const schedule = schedules[activeUser];
    if (!schedule) return;
    let text = `📅 *MENÚ SEMANAL (${activeUser.toUpperCase()})*\n\n`;
    DAYS.forEach(day => {
      const meals = schedule[day] || {};
      if ((meals.almuerzo?.length) || (meals.cena?.length)) {
        text += `*${day.toUpperCase()}*\n`;
        if (meals.desayuno?.length) text += `☕ ${meals.desayuno.map(i => i.name).join(', ')}\n`;
        if (meals.almuerzo?.length) text += `🍴 ${meals.almuerzo.map(i => i.name).join(', ')}\n`;
        if (meals.merienda?.length) text += `🍪 ${meals.merienda.map(i => i.name).join(', ')}\n`;
        if (meals.cena?.length) text += `🌙 ${meals.cena.map(i => i.name).join(', ')}\n`;
        text += `\n`;
      }
    });
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const getTodayName = () => ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'][new Date().getDay()];
  const todayName = getTodayName();
  const isPrepDay = todayName === 'Sabado' || todayName === 'Domingo';

  return (
    <div style={{ padding: '10px 15px', minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', transition: '0.3s' }}>
      {isLoading && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <RefreshCcw className="animate-spin" size={32} />
            <span>Cargando...</span>
          </div>
        </div>
      )}
      
      {isPrepDay && (
        <div style={{ 
          backgroundColor: '#6366f1', color: 'white', padding: '12px', borderRadius: '12px', 
          marginBottom: '20px', textAlign: 'center', fontWeight: 'bold', fontSize: '18px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.4)'
        }}>
          <ShoppingCart size={24} /> 🥗 ¡Hoy es Prep Day! Día de compra y cocina.
        </div>
      )}
      <header style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}><Utensils size={28} /> MealPlan Pro</h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={toggleTheme} style={{ padding: '10px', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {theme === 'light' && <Sun size={20} />}
              {theme === 'dark' && <Moon size={20} />}
              {theme === 'tortie' && <Cat size={20} color="#f59e0b" />}
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <FoodManager onDatabaseChange={setDbOptions} />
          <button onClick={() => setShowShoppingList(true)} style={{ flex: 1, minWidth: '120px', padding: '10px 15px', backgroundColor: '#ff6b35', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', cursor: 'pointer' }}><ShoppingCart size={18} /> Lista</button>
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
          <button onClick={() => setShowStats(!showStats)} style={{ padding: '8px 15px', fontSize: '12px', borderRadius: '6px', border: '1px solid #6366f1', color: '#6366f1', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>{showStats ? '📊 Ocultar Stats' : '📊 Ver Stats'}</button>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={async () => { if(confirm('¿Vaciar semana?')) {
            for (const day of DAYS) { await db.clearDaySchedule(activeUser, day); }
            setSchedules(prev => ({...prev, [activeUser]: Object.fromEntries(DAYS.map(d => [d, { desayuno: [], almuerzo: [], merienda: [], cena: [] }]))}));
          }}} style={{ padding: '8px 15px', fontSize: '12px', borderRadius: '6px', border: '1px solid #ef4444', color: '#ef4444', backgroundColor: 'transparent', cursor: 'pointer' }}>Vaciar</button>
        </div>
      </div>

      {showStats && <WeeklyStats schedule={schedules[activeUser]} />}

      <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
        {DAYS.map(day => (
          <DayRow 
            key={day} 
            day={day} 
            isToday={day === todayName} 
            data={schedules[activeUser]?.[day] || { desayuno: [], almuerzo: [], merienda: [], cena: [] }} 
            options={dbOptions} 
            onAddItem={(time, foodId, amount, unit) => handleAddItem(activeUser, day, time, foodId, amount, unit)} 
            onRemoveItem={(time, itemId) => handleRemoveItem(activeUser, day, time, itemId)} 
            onUpdateItem={(time, id, amount, unit) => handleUpdateItem(activeUser, day, time, id, amount, unit)} 
            onCopyMeal={handleCopyMeal} 
            onCopyToTomorrow={handleCopyToTomorrow} 
            onClearDay={handleClearDay} 
            recentFoods={recentFoods} 
          />
        ))}
      </div>
    </div>
  );
}
