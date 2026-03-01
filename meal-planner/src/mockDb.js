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
    { id: 3, name: 'Pechuga de Pollo', is_recipe: false, default_unit: 'g', category: 'Carne', conversion_factor: 0.75 },
    { id: 4, name: 'Papas', is_recipe: false, default_unit: 'g', category: 'Verdura', conversion_factor: 1.0 },
    { id: 5, name: 'Fideos', is_recipe: false, default_unit: 'g', category: 'Pasta', conversion_factor: 2.25 },
    { id: 6, name: 'Salsa de Tomate', is_recipe: false, default_unit: 'ml', category: 'Salsa', conversion_factor: 1.0 },
    { id: 7, name: 'Carne Picada', is_recipe: false, default_unit: 'g', category: 'Carne', conversion_factor: 0.70 },
    { id: 8, name: 'Leche', is_recipe: false, default_unit: 'ml', category: 'Lácteo', conversion_factor: 1.0 },
    { id: 9, name: 'Manteca', is_recipe: false, default_unit: 'g', category: 'Lácteo', conversion_factor: 1.0 },
    { id: 10, name: 'Huevo', is_recipe: false, default_unit: 'unidades', category: 'Proteína', conversion_factor: 0.90 },
    { id: 11, name: 'Pan Rallado', is_recipe: false, default_unit: 'g', category: 'Otros', conversion_factor: 1.0 },
    { id: 12, name: 'Cebolla', is_recipe: false, default_unit: 'unidades', category: 'Verdura', conversion_factor: 0.50 }
  ];
};

export const CATEGORIES = [
  { name: 'Proteína', icon: '🍗' },
  { name: 'Carne', icon: '🥩' },
  { name: 'Pasta', icon: '🍝' },
  { name: 'Verdura', icon: '🥦' },
  { name: 'Legumbres', icon: '🫘' },
  { name: 'Lácteo', icon: '🥛' },
  { name: 'Salsa', icon: '🥫' },
  { name: 'Otros', icon: '✨' }
];

// Derived from mealdata.csv
const COMMON_FACTORS = [
  { regex: /pollo|chicken|ave/i, factor: 0.75 },
  { regex: /vaca|carne|beef|steak|picada/i, factor: 0.70 },
  { regex: /cerdo|pork/i, factor: 0.75 },
  { regex: /pescado|salmon|merluza|fish/i, factor: 0.80 },
  { regex: /arroz|rice|quinoa/i, factor: 3.00 },
  { regex: /fideo|pasta|spaghetti|penne/i, factor: 2.25 },
  { regex: /lenteja|poroto|legumbre|bean|lentil/i, factor: 2.20 },
  { regex: /espinaca|kale|acelga/i, factor: 0.20 },
  { regex: /hongo|champi/i, factor: 0.50 },
  { regex: /papa|patata/i, factor: 1.00 },
  { regex: /huevo|egg/i, factor: 0.90 },
  { regex: /pan|galleta/i, factor: 1.00 }
];

export const getSuggestedFactor = (name) => {
  const match = COMMON_FACTORS.find(f => f.regex.test(name));
  return match ? match.factor : 1.0;
};

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
    instructions: food.instructions || '',
    default_unit: food.default_unit || (food.is_recipe ? 'unidades' : 'g'),
    category: food.category || 'Otros',
    favorite: food.favorite || false,
    conversion_factor: food.conversion_factor || 1.0
  };
  MOCK_DB.push(newFood);
  saveToLocal();
  return newFood;
};

export const updateFood = (id, updatedFood) => {
  MOCK_DB = MOCK_DB.map(f => f.id === id ? { ...f, ...updatedFood, id, instructions: updatedFood.instructions || '', favorite: updatedFood.favorite || false, conversion_factor: updatedFood.conversion_factor || 1.0 } : f);
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
      // Safeguard: Ensure all users, days, and meals from default exist
      Object.keys(defaultSchedule).forEach(person => {
        if (!parsed[person]) parsed[person] = defaultSchedule[person];
        
        Object.keys(defaultSchedule[person]).forEach(day => {
          if (!parsed[person][day]) {
            parsed[person][day] = defaultSchedule[person][day];
          } else {
            const meals = ['desayuno', 'almuerzo', 'merienda', 'cena'];
            meals.forEach(meal => {
              if (!parsed[person][day][meal]) {
                parsed[person][day][meal] = [];
              }
            });
          }
        });
      });
      return parsed;
    } catch {
      return defaultSchedule;
    }
  }
  return defaultSchedule;
};

export const saveSchedule = (schedule) => {
  localStorage.setItem('meal_planner_schedule', JSON.stringify(schedule));
};

export default MOCK_DB;
