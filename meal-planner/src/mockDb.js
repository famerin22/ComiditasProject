const getInitialData = () => {
  const saved = localStorage.getItem('meal_planner_db');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Error parsing local database", e);
    }
  }
  return [
    { 
      id: 1, 
      name: 'Milanesas con Puré', 
      is_recipe: true, 
      ingredients: [
        { id: 4, amount: '500', unit: 'g' }, // Papas
        { id: 9, amount: '50', unit: 'g' },  // Manteca
        { id: 10, amount: '2', unit: 'unidades' }, // Huevo
        { id: 11, amount: '200', unit: 'g' }  // Pan Rallado
      ],
      default_unit: 'unidades'
    },
    { 
      id: 2, 
      name: 'Fideos con Tuco', 
      is_recipe: true, 
      ingredients: [
        { id: 5, amount: '250', unit: 'g' }, // Fideos
        { id: 6, amount: '200', unit: 'ml' }, // Salsa
        { id: 7, amount: '200', unit: 'g' }, // Carne Picada
        { id: 12, amount: '1', unit: 'unidades' } // Cebolla
      ],
      default_unit: 'unidades'
    },
    { id: 3, name: 'Pechuga de Pollo', is_recipe: false, default_unit: 'g', category: 'Carne' },
    { id: 4, name: 'Papas', is_recipe: false, default_unit: 'g', category: 'Verdura' },
    { id: 5, name: 'Fideos', is_recipe: false, default_unit: 'g', category: 'Pasta' },
    { id: 6, name: 'Salsa de Tomate', is_recipe: false, default_unit: 'ml', category: 'Salsa' },
    { id: 7, name: 'Carne Picada', is_recipe: false, default_unit: 'g', category: 'Carne' },
    { id: 8, name: 'Leche', is_recipe: false, default_unit: 'ml', category: 'Lácteo' },
    { id: 9, name: 'Manteca', is_recipe: false, default_unit: 'g', category: 'Lácteo' },
    { id: 10, name: 'Huevo', is_recipe: false, default_unit: 'unidades', category: 'Proteína' },
    { id: 11, name: 'Pan Rallado', is_recipe: false, default_unit: 'g', category: 'Otros' },
    { id: 12, name: 'Cebolla', is_recipe: false, default_unit: 'unidades', category: 'Verdura' }
  ];
};

export const CATEGORIES = ['Proteína', 'Carne', 'Pasta', 'Verdura', 'Legumbres', 'Lácteo', 'Salsa', 'Otros'];

let MOCK_DB = getInitialData();

const saveToLocal = () => {
  localStorage.setItem('meal_planner_db', JSON.stringify(MOCK_DB));
};

export const getFoods = () => [...MOCK_DB];

export const addFood = (food) => {
  const newFood = { 
    ...food, 
    id: Date.now(), 
    ingredients: food.ingredients || [],
    default_unit: food.default_unit || (food.is_recipe ? 'unidades' : 'g'),
    category: food.category || 'Otros'
  };
  MOCK_DB.push(newFood);
  saveToLocal();
  return newFood;
};

export const updateFood = (id, updatedFood) => {
  MOCK_DB = MOCK_DB.map(f => f.id === id ? { ...f, ...updatedFood, id } : f);
  saveToLocal();
  return MOCK_DB.find(f => f.id === id);
};

export const deleteFood = (id) => {
  MOCK_DB = MOCK_DB.filter(f => f.id !== id);
  saveToLocal();
};

// PERSISTENCE FOR SCHEDULES
export const getSchedule = (defaultSchedule) => {
  const saved = localStorage.getItem('meal_planner_schedule');
  const lastReset = localStorage.getItem('meal_planner_last_reset');
  
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0: Sun, 1: Mon, ..., 6: Sat
  const todayStr = today.toISOString().split('T')[0];

  // If it's Monday (1) and we haven't reset today yet
  if (dayOfWeek === 1 && lastReset !== todayStr) {
    localStorage.setItem('meal_planner_last_reset', todayStr);
    localStorage.setItem('meal_planner_schedule', JSON.stringify(defaultSchedule));
    return defaultSchedule;
  }

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Safeguard: Ensure all users and days have all 4 meal slots
      ['fer', 'meli'].forEach(person => {
        if (parsed[person]) {
          Object.keys(parsed[person]).forEach(day => {
            const meals = ['desayuno', 'almuerzo', 'merienda', 'cena'];
            meals.forEach(meal => {
              if (!parsed[person][day][meal]) {
                parsed[person][day][meal] = [];
              }
            });
          });
        }
      });
      return parsed;
    } catch (e) {
      return defaultSchedule;
    }
  }
  return defaultSchedule;
};

export const saveSchedule = (schedule) => {
  localStorage.setItem('meal_planner_schedule', JSON.stringify(schedule));
};

export default MOCK_DB;
