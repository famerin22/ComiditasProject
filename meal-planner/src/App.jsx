import React, { useState, useEffect } from 'react';
import { Utensils, ShoppingCart, User, Sun, Moon, X, CheckCircle2 } from 'lucide-react';
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

  useEffect(() => {
    localStorage.setItem('meal_planner_bought', JSON.stringify(boughtItems));
  }, [boughtItems]);

  useEffect(() => {
    localStorage.setItem('meal_planner_extras', JSON.stringify(extraItems));
  }, [extraItems]);

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
    if (confirm('¿Vaciar los elementos marcados?')) {
      setBoughtItems({});
      setExtraItems(extraItems.filter(i => !i.bought));
    }
  };

  const formatListForSharing = () => {
    const pending = ingredients.filter(ing => !boughtItems[`${ing.name}-${ing.unit}`]);
    const pendingExtras = extraItems.filter(i => !i.bought);
    
    if (pending.length === 0 && pendingExtras.length === 0) return "¡Lista de compras vacía!";
    
    let text = `🛒 *LISTA DE COMPRAS (${viewMode === 'combined' ? 'AMBOS' : viewMode.toUpperCase()})*\n\n`;
    
    if (pending.length > 0) {
      text += `*Ingredientes:*\n`;
      pending.forEach(ing => {
        text += `• ${ing.name}: ${ing.amount}${ing.unit}\n`;
      });
    }
    
    if (pendingExtras.length > 0) {
      text += `\n*Extras:*\n`;
      pendingExtras.forEach(item => {
        text += `• ${item.name}\n`;
      });
    }
    
    return text;
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(formatListForSharing());
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formatListForSharing());
    alert('¡Lista copiada al portapapeles!');
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

        <div style={{ display: 'flex', gap: '5px', padding: '10px 20px', backgroundColor: 'var(--bg-item)', borderBottom: '1px solid var(--border-card)' }}>
          <button onClick={() => setViewUser('combined')} style={{ flex: 1, padding: '8px', fontSize: '12px', borderRadius: '6px', border: 'none', backgroundColor: viewMode === 'combined' ? '#6366f1' : 'transparent', color: viewMode === 'combined' ? 'white' : 'var(--text-muted)', fontWeight: 'bold', cursor: 'pointer' }}>Ambos</button>
          <button onClick={() => setViewUser('fer')} style={{ flex: 1, padding: '8px', fontSize: '12px', borderRadius: '6px', border: 'none', backgroundColor: viewMode === 'fer' ? '#6366f1' : 'transparent', color: viewMode === 'fer' ? 'white' : 'var(--text-muted)', fontWeight: 'bold', cursor: 'pointer' }}>Fer</button>
          <button onClick={() => setViewUser('meli')} style={{ flex: 1, padding: '8px', fontSize: '12px', borderRadius: '6px', border: 'none', backgroundColor: viewMode === 'meli' ? '#ec4899' : 'transparent', color: viewMode === 'meli' ? 'white' : 'var(--text-muted)', fontWeight: 'bold', cursor: 'pointer' }}>Meli</button>
        </div>
        
        <div style={{ padding: '15px 20px', overflowY: 'auto', flex: 1 }}>
          {/* SECCIÓN DE EXTRAS */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input 
                type="text" 
                placeholder="Añadir algo extra (ej: Papel, Café)..." 
                value={newExtra}
                onChange={(e) => setNewExtra(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addExtra()}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '14px' }}
              />
              <button onClick={addExtra} style={{ padding: '10px 15px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                +
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {extraItems.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '8px', backgroundColor: item.bought ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-item)', border: `1px solid ${item.bought ? '#10b981' : 'var(--border-color)'}` }}>
                  <div onClick={() => toggleExtra(item.id)} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    {item.bought ? <CheckCircle2 size={18} color="#10b981" /> : <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid var(--border-color)' }} />}
                    <span style={{ fontSize: '14px', color: item.bought ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: item.bought ? 'line-through' : 'none' }}>{item.name}</span>
                  </div>
                  <X size={16} onClick={() => removeExtra(item.id)} style={{ cursor: 'pointer', color: 'var(--text-muted)', marginLeft: '10px' }} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', borderTop: '1px solid var(--border-card)', paddingTop: '15px' }}>
            Ingredientes del Menú
          </div>

          {ingredients.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0' }}>No hay ingredientes en el menú.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {ingredients.map((ing, idx) => {
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
          )}
        </div>
        
        <div style={{ padding: '15px 20px', borderTop: '1px solid var(--border-card)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={shareWhatsApp} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#25D366', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>WhatsApp</button>
            <button onClick={copyToClipboard} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>Copiar</button>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={clearBought} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ef4444', backgroundColor: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '13px' }}>Limpiar Marcados</button>
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
      <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-title)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        📊 Equilibrio Semanal
      </h4>
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

export default function App() {
  const [dbOptions, setDbOptions] = useState([]);
  const [schedules, setSchedules] = useState(() => getSchedule(INITIAL_STATE));
  const [activeUser, setActiveUser] = useState('fer');
  const [viewMode, setViewMode] = useState('combined');
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => { setDbOptions(getFoods()); }, []);
  useEffect(() => { saveSchedule(schedules); }, [schedules]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handlePrint = () => {
    window.print();
  };

  const exportData = () => {
    const data = {
      db: localStorage.getItem('meal_planner_db'),
      schedule: localStorage.getItem('meal_planner_schedule'),
      extras: localStorage.getItem('meal_planner_extras'),
      theme: localStorage.getItem('theme')
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mealplan_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.db) localStorage.setItem('meal_planner_db', data.db);
        if (data.schedule) localStorage.setItem('meal_planner_schedule', data.schedule);
        if (data.extras) localStorage.setItem('meal_planner_extras', data.extras);
        alert('Datos importados con éxito. La página se recargará.');
        window.location.reload();
      } catch (err) {
        alert('Error al importar el archivo.');
      }
    };
    reader.readAsText(file);
  };

  const handleAddItem = (person, day, time, foodId, amount, unit) => {
    const food = dbOptions.find(f => f.id === Number(foodId));
    if (!food) return;
    const newItem = {
      id: Date.now(),
      type: food.is_recipe ? 'recipe' : 'ingredient',
      name: food.name,
      category: food.category || 'Otros',
      amount,
      unit,
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
          [time]: prev[person][day][time].map(item => 
            item.id === itemId ? { ...item, amount, unit } : item
          )
        }
      }
    }));
  };

  const handleRemoveItem = (person, day, time, itemId) => {
    setSchedules(prev => ({...prev, [person]: { ...prev[person], [day]: { ...prev[person][day], [time]: prev[person][day][time].filter(i => i.id !== itemId) }}}));
  };

  const handleCopyMeal = (day, time) => {
    const otherUser = activeUser === 'fer' ? 'meli' : 'fer';
    const itemsToCopy = schedules[activeUser][day][time].map(item => ({
      ...item,
      id: Date.now() + Math.random()
    }));
    if (itemsToCopy.length === 0) return;
    setSchedules(prev => ({...prev, [otherUser]: { ...prev[otherUser], [day]: { ...prev[otherUser][day], [time]: [...prev[otherUser][day][time], ...itemsToCopy] }}}));
    alert(`Comida copiada a ${otherUser.toUpperCase()}`);
  };

  const handleCopyToTomorrow = (currentDay, time) => {
    const currentIndex = DAYS.indexOf(currentDay);
    if (currentIndex === -1 || currentIndex === DAYS.length - 1) {
      alert("No hay un 'mañana' en esta semana para copiar.");
      return;
    }
    const tomorrow = DAYS[currentIndex + 1];
    const itemsToCopy = schedules[activeUser][currentDay][time].map(item => ({
      ...item,
      id: Date.now() + Math.random()
    }));
    if (itemsToCopy.length === 0) return;
    setSchedules(prev => ({...prev, [activeUser]: { ...prev[activeUser], [tomorrow]: { ...prev[activeUser][tomorrow], [time]: [...prev[activeUser][tomorrow][time], ...itemsToCopy] }}}));
    alert(`Copiado al ${tomorrow}`);
  };

  const shareWeeklyMenu = () => {
    const schedule = schedules[activeUser];
    let text = `📅 *MENÚ SEMANAL (${activeUser.toUpperCase()})*\n\n`;
    DAYS.forEach(day => {
      text += `*${day.toUpperCase()}*\n`;
      const meals = schedule[day];
      if (meals.desayuno.length) text += `☕ Des: ${meals.desayuno.map(i => i.name).join(', ')}\n`;
      if (meals.almuerzo.length) text += `🍴 Alm: ${meals.almuerzo.map(i => i.name).join(', ')}\n`;
      if (meals.merienda.length) text += `🍪 Mer: ${meals.merienda.map(i => i.name).join(', ')}\n`;
      if (meals.cena.length) text += `🌙 Cena: ${meals.cena.map(i => i.name).join(', ')}\n`;
      text += `\n`;
    });
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const clearWeek = () => {
    if (confirm(`¿Vaciar todo el menú de ${activeUser.toUpperCase()}?`)) {
      setSchedules(prev => ({ ...prev, [activeUser]: createEmptySchedule() }));
    }
  };

  const getTodayName = () => {
    const daysMap = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    return daysMap[new Date().getDay()];
  };
  const todayName = getTodayName();

  return (
    <div style={{ padding: '10px 15px', minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', transition: '0.3s' }}>
      <header style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}><Utensils size={28} /> MealPlan Pro</h1>
          <button onClick={() => setDarkMode(!darkMode)} style={{ padding: '10px', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <FoodManager onDatabaseChange={setDbOptions} />
          <button onClick={exportData} style={{ padding: '10px', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }} title="Exportar Copia Seguridad">📥</button>
          <label style={{ padding: '10px', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }} title="Importar Copia Seguridad">
            📤<input type="file" onChange={importData} style={{ display: 'none' }} />
          </label>
          <button onClick={() => setShowShoppingList(true)} style={{ flex: 1, minWidth: '120px', padding: '10px 15px', backgroundColor: '#ff6b35', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
            <ShoppingCart size={18} /> Lista
          </button>
        </div>
      </header>

      {showShoppingList && <ShoppingListModal schedules={schedules} dbOptions={dbOptions} viewMode={viewMode} setViewUser={setViewMode} onClose={() => setShowShoppingList(false)} />}

      <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--bg-card)', padding: '6px', borderRadius: '14px', marginBottom: '15px', border: '1px solid var(--border-color)' }}>
        <button 
          onClick={() => setActiveUser('fer')}
          style={{ 
            flex: 1, padding: '10px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px',
            backgroundColor: activeUser === 'fer' ? '#6366f1' : 'transparent',
            color: activeUser === 'fer' ? 'white' : 'var(--text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: '0.2s'
          }}
        >
          <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: activeUser === 'fer' ? 'rgba(255,255,255,0.2)' : '#6366f1', color: activeUser === 'fer' ? 'white' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>F</div>
          Fer
        </button>
        <button 
          onClick={() => setActiveUser('meli')}
          style={{ 
            flex: 1, padding: '10px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px',
            backgroundColor: activeUser === 'meli' ? '#ec4899' : 'transparent',
            color: activeUser === 'meli' ? 'white' : 'var(--text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: '0.2s'
          }}
        >
          <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: activeUser === 'meli' ? 'rgba(255,255,255,0.2)' : '#ec4899', color: activeUser === 'meli' ? 'white' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>M</div>
          Meli
        </button>
      </div>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
  <div style={{ display: 'flex', gap: '8px' }}>
    <button onClick={shareWeeklyMenu} style={{ padding: '8px 15px', fontSize: '12px', borderRadius: '6px', border: '1px solid #25D366', color: '#25D366', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>Compartir</button>
    <button onClick={handlePrint} className="no-print" style={{ padding: '8px 15px', fontSize: '12px', borderRadius: '6px', border: '1px solid var(--text-muted)', color: 'var(--text-main)', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>🖨️ Imprimir</button>
  </div>
  <button onClick={clearWeek} style={{ padding: '8px 15px', fontSize: '12px', borderRadius: '6px', border: '1px solid #ef4444', color: '#ef4444', backgroundColor: 'transparent', cursor: 'pointer' }}>Vaciar mi semana</button>
</div>

<WeeklyStats schedule={schedules[activeUser]} />

<div className="main-grid">

      <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
        {DAYS.map(day => <DayRow key={day} day={day} isToday={day === todayName} data={schedules[activeUser][day]} options={dbOptions} onAddItem={(time, foodId, amount, unit) => handleAddItem(activeUser, day, time, foodId, amount, unit)} onRemoveItem={(time, itemId) => handleRemoveItem(activeUser, day, time, itemId)} onUpdateItem={(time, id, amount, unit) => handleUpdateItem(activeUser, day, time, id, amount, unit)} onCopyMeal={handleCopyMeal} onCopyToTomorrow={handleCopyToTomorrow} />)}
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
