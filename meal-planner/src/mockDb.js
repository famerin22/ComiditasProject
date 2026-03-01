const getInitialData = () => {
  const saved = localStorage.getItem('meal_planner_db');
  const defaults = [
    // PROTEÍNAS Y CARNES (ARGENTINA CONTEXT)
    { id: 3, name: 'Pechuga de Pollo', is_recipe: false, default_unit: 'g', category: 'Carne', conversion_factor: 0.75 },
    { id: 7, name: 'Carne Picada Vacuna', is_recipe: false, default_unit: 'g', category: 'Carne', conversion_factor: 0.70 },
    { id: 13, name: 'Asado de Tira', is_recipe: false, default_unit: 'g', category: 'Carne', conversion_factor: 0.60 },
    { id: 14, name: 'Vacío', is_recipe: false, default_unit: 'g', category: 'Carne', conversion_factor: 0.65 },
    { id: 15, name: 'Matambre vacuno', is_recipe: false, default_unit: 'g', category: 'Carne', conversion_factor: 0.70 },
    { id: 16, name: 'Nalga (para milanesas)', is_recipe: false, default_unit: 'g', category: 'Carne', conversion_factor: 0.75 },
    { id: 17, name: 'Peceto', is_recipe: false, default_unit: 'g', category: 'Carne', conversion_factor: 0.75 },
    { id: 18, name: 'Cuadril', is_recipe: false, default_unit: 'g', category: 'Carne', conversion_factor: 0.75 },
    { id: 19, name: 'Bola de lomo', is_recipe: false, default_unit: 'g', category: 'Carne', conversion_factor: 0.75 },
    { id: 20, name: 'Chorizo de cerdo', is_recipe: false, default_unit: 'unidades', category: 'Carne', conversion_factor: 0.75 },
    { id: 21, name: 'Morcilla', is_recipe: false, default_unit: 'unidades', category: 'Carne', conversion_factor: 0.85 },
    { id: 22, name: 'Bondiola de cerdo', is_recipe: false, default_unit: 'g', category: 'Carne', conversion_factor: 0.70 },
    { id: 23, name: 'Carré de cerdo', is_recipe: false, default_unit: 'g', category: 'Carne', conversion_factor: 0.75 },
    { id: 24, name: 'Merluza (filete)', is_recipe: false, default_unit: 'g', category: 'Carne', conversion_factor: 0.80 },
    { id: 25, name: 'Salmón rosado', is_recipe: false, default_unit: 'g', category: 'Carne', conversion_factor: 0.85 },
    { id: 10, name: 'Huevo', is_recipe: false, default_unit: 'unidades', category: 'Proteína', conversion_factor: 0.90 },
    
    // VERDURAS
    { id: 4, name: 'Papa', is_recipe: false, default_unit: 'g', category: 'Verdura', conversion_factor: 1.0 },
    { id: 26, name: 'Batata', is_recipe: false, default_unit: 'g', category: 'Verdura', conversion_factor: 0.85 },
    { id: 27, name: 'Zapallo Anco (Calabaza)', is_recipe: false, default_unit: 'g', category: 'Verdura', conversion_factor: 0.80 },
    { id: 28, name: 'Zapallito verde', is_recipe: false, default_unit: 'g', category: 'Verdura', conversion_factor: 0.60 },
    { id: 29, name: 'Berenjena', is_recipe: false, default_unit: 'g', category: 'Verdura', conversion_factor: 0.50 },
    { id: 30, name: 'Choclo', is_recipe: false, default_unit: 'unidades', category: 'Verdura', conversion_factor: 1.0 },
    { id: 31, name: 'Morrón rojo', is_recipe: false, default_unit: 'g', category: 'Verdura', conversion_factor: 0.70 },
    { id: 32, name: 'Morrón verde', is_recipe: false, default_unit: 'g', category: 'Verdura', conversion_factor: 0.70 },
    { id: 12, name: 'Cebolla', is_recipe: false, default_unit: 'unidades', category: 'Verdura', conversion_factor: 0.50 },
    { id: 33, name: 'Zanahoria', is_recipe: false, default_unit: 'g', category: 'Verdura', conversion_factor: 0.80 },
    { id: 34, name: 'Acelga (cocida)', is_recipe: false, default_unit: 'g', category: 'Verdura', conversion_factor: 0.20 },
    { id: 35, name: 'Espinaca (cocida)', is_recipe: false, default_unit: 'g', category: 'Verdura', conversion_factor: 0.15 },
    { id: 36, name: 'Tomate', is_recipe: false, default_unit: 'g', category: 'Verdura', conversion_factor: 0.95 },
    { id: 37, name: 'Brócoli', is_recipe: false, default_unit: 'g', category: 'Verdura', conversion_factor: 0.90 },
    
    // PASTAS Y GRANOS
    { id: 5, name: 'Fideos de trigo', is_recipe: false, default_unit: 'g', category: 'Pasta', conversion_factor: 2.25 },
    { id: 38, name: 'Arroz blanco', is_recipe: false, default_unit: 'g', category: 'Pasta', conversion_factor: 2.50 },
    { id: 39, name: 'Arroz integral', is_recipe: false, default_unit: 'g', category: 'Pasta', conversion_factor: 2.30 },
    { id: 40, name: 'Ñoquis de papa', is_recipe: false, default_unit: 'g', category: 'Pasta', conversion_factor: 1.50 },
    { id: 41, name: 'Ravioles de verdura', is_recipe: false, default_unit: 'plancha', category: 'Pasta', conversion_factor: 1.50 },
    { id: 42, name: 'Polenta', is_recipe: false, default_unit: 'g', category: 'Pasta', conversion_factor: 4.00 },
    { id: 43, name: 'Lentejas secas', is_recipe: false, default_unit: 'g', category: 'Legumbres', conversion_factor: 2.20 },
    { id: 44, name: 'Garbanzos secos', is_recipe: false, default_unit: 'g', category: 'Legumbres', conversion_factor: 2.20 },
    { id: 45, name: 'Porotos negros', is_recipe: false, default_unit: 'g', category: 'Legumbres', conversion_factor: 2.30 },
    
    // RECETAS CLÁSICAS
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
      default_unit: 'unidades',
      category: 'Otros'
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
      default_unit: 'unidades',
      category: 'Pasta'
    },
    {
      id: 46,
      name: 'Ensalada Mixta',
      is_recipe: true,
      ingredients: [
        { id: 36, amount: '2', unit: 'unidades' }, // Tomate
        { id: 12, amount: '0.5', unit: 'unidades' }, // Cebolla
        { id: 47, name: 'Lechuga', amount: '100', unit: 'g' }
      ],
      default_unit: 'unidades',
      category: 'Verdura'
    },
    {
      id: 48,
      name: 'Tarta de Acelga',
      is_recipe: true,
      ingredients: [
        { id: 34, amount: '500', unit: 'g' }, // Acelga
        { id: 10, amount: '3', unit: 'unidades' }, // Huevo
        { id: 49, name: 'Masa de Tarta', amount: '1', unit: 'unidades' },
        { id: 50, name: 'Queso Cremoso', amount: '200', unit: 'g' }
      ],
      default_unit: 'porción',
      category: 'Verdura'
    }
  ];

  // Extend with more items to reach 100+
  const extraItems = [
    { name: 'Lechuga', category: 'Verdura', factor: 1.0, unit: 'g' },
    { name: 'Masa de Tarta', category: 'Otros', factor: 1.0, unit: 'unidades' },
    { name: 'Queso Cremoso', category: 'Lácteo', factor: 1.0, unit: 'g' },
    { name: 'Queso Reggianito', category: 'Lácteo', factor: 1.0, unit: 'g' },
    { name: 'Yogur Natural', category: 'Lácteo', factor: 1.0, unit: 'g' },
    { name: 'Ricotta', category: 'Lácteo', factor: 1.0, unit: 'g' },
    { name: 'Crema de Leche', category: 'Lácteo', factor: 1.0, unit: 'ml' },
    { name: 'Dulce de Leche', category: 'Otros', factor: 1.0, unit: 'g' },
    { name: 'Tapa de Asado', category: 'Carne', factor: 0.65, unit: 'g' },
    { name: 'Chinchulines', category: 'Carne', factor: 0.50, unit: 'g' },
    { name: 'Mollejas', category: 'Carne', factor: 0.60, unit: 'g' },
    { name: 'Riñoncitos', category: 'Carne', factor: 0.60, unit: 'g' },
    { name: 'Lengua vacuna', category: 'Carne', factor: 0.70, unit: 'g' },
    { name: 'Entraña', category: 'Carne', factor: 0.65, unit: 'g' },
    { name: 'Bife de Chorizo', category: 'Carne', factor: 0.75, unit: 'g' },
    { name: 'Ojo de Bife', category: 'Carne', factor: 0.75, unit: 'g' },
    { name: 'Colita de Cuadril', category: 'Carne', factor: 0.75, unit: 'g' },
    { name: 'Puchero (osobuco)', category: 'Carne', factor: 0.55, unit: 'g' },
    { name: 'Paleta', category: 'Carne', factor: 0.70, unit: 'g' },
    { name: 'Roast Beef', category: 'Carne', factor: 0.70, unit: 'g' },
    { name: 'Suprema de Pollo', category: 'Carne', factor: 0.75, unit: 'g' },
    { name: 'Pata y Muslo', category: 'Carne', factor: 0.65, unit: 'g' },
    { name: 'Alitas de Pollo', category: 'Carne', factor: 0.50, unit: 'g' },
    { name: 'Calamar (rabas)', category: 'Carne', factor: 0.60, unit: 'g' },
    { name: 'Camarones', category: 'Carne', factor: 0.70, unit: 'g' },
    { name: 'Mejillones', category: 'Carne', factor: 0.40, unit: 'g' },
    { name: 'Trucha', category: 'Carne', factor: 0.80, unit: 'g' },
    { name: 'Pejerrey', category: 'Carne', factor: 0.75, unit: 'g' },
    { name: 'Zapallo Cabutiá', category: 'Verdura', factor: 0.80, unit: 'g' },
    { name: 'Pepino', category: 'Verdura', factor: 0.95, unit: 'g' },
    { name: 'Rabanito', category: 'Verdura', factor: 0.95, unit: 'g' },
    { name: 'Repollo blanco', category: 'Verdura', factor: 0.50, unit: 'g' },
    { name: 'Repollo colorado', category: 'Verdura', factor: 0.50, unit: 'g' },
    { name: 'Coliflor', category: 'Verdura', factor: 0.80, unit: 'g' },
    { name: 'Repollitos de Bruselas', category: 'Verdura', factor: 0.85, unit: 'g' },
    { name: 'Espárragos', category: 'Verdura', factor: 0.85, unit: 'g' },
    { name: 'Chauchas', category: 'Verdura', factor: 0.90, unit: 'g' },
    { name: 'Arvejas frescas', category: 'Verdura', factor: 1.0, unit: 'g' },
    { name: 'Habas', category: 'Verdura', factor: 1.0, unit: 'g' },
    { name: 'Ajo', category: 'Verdura', factor: 1.0, unit: 'diente' },
    { name: 'Puerro', category: 'Verdura', factor: 0.60, unit: 'g' },
    { name: 'Verdeo', category: 'Verdura', factor: 0.70, unit: 'g' },
    { name: 'Ciboulette', category: 'Verdura', factor: 1.0, unit: 'g' },
    { name: 'Perejil', category: 'Verdura', factor: 1.0, unit: 'g' },
    { name: 'Albahaca', category: 'Verdura', factor: 1.0, unit: 'g' },
    { name: 'Rúcula', category: 'Verdura', factor: 1.0, unit: 'g' },
    { name: 'Radicheta', category: 'Verdura', factor: 1.0, unit: 'g' },
    { name: 'Hinojo', category: 'Verdura', factor: 0.60, unit: 'g' },
    { name: 'Remolacha', category: 'Verdura', factor: 0.80, unit: 'g' },
    { name: 'Palta', category: 'Verdura', factor: 1.0, unit: 'unidades' },
    { name: 'Aceitunas', category: 'Otros', factor: 1.0, unit: 'g' },
    { name: 'Champignones', category: 'Verdura', factor: 0.60, unit: 'g' },
    { name: 'Portobellos', category: 'Verdura', factor: 0.60, unit: 'g' },
    { name: 'Gírgolas', category: 'Verdura', factor: 0.50, unit: 'g' },
    { name: 'Fideos de Arroz', category: 'Pasta', factor: 2.50, unit: 'g' },
    { name: 'Cuscús', category: 'Pasta', factor: 2.50, unit: 'g' },
    { name: 'Quinoa', category: 'Pasta', factor: 3.00, unit: 'g' },
    { name: 'Trigo Burgol', category: 'Pasta', factor: 2.50, unit: 'g' },
    { name: 'Avena arrollada', category: 'Otros', factor: 2.50, unit: 'g' },
    { name: 'Pan rallado', category: 'Otros', factor: 1.0, unit: 'g' },
    { name: 'Rebozador', category: 'Otros', factor: 1.0, unit: 'g' },
    { name: 'Harina de Trigo 000', category: 'Otros', factor: 1.0, unit: 'g' },
    { name: 'Harina de Trigo 0000', category: 'Otros', factor: 1.0, unit: 'g' },
    { name: 'Harina Leudante', category: 'Otros', factor: 1.0, unit: 'g' },
    { name: 'Harina de Maíz', category: 'Otros', factor: 1.0, unit: 'g' },
    { name: 'Almidón de Maíz', category: 'Otros', factor: 1.0, unit: 'g' },
    { name: 'Levadura fresca', category: 'Otros', factor: 1.0, unit: 'g' },
    { name: 'Levadura seca', category: 'Otros', factor: 1.0, unit: 'g' },
    { name: 'Nueces', category: 'Otros', factor: 1.0, unit: 'g' },
    { name: 'Almendras', category: 'Otros', factor: 1.0, unit: 'g' },
    { name: 'Castañas de Cajú', category: 'Otros', factor: 1.0, unit: 'g' },
    { name: 'Maní', category: 'Otros', factor: 1.0, unit: 'g' },
    { name: 'Semillas de Girasol', category: 'Otros', factor: 1.0, unit: 'g' },
    { name: 'Semillas de Zapallo', category: 'Otros', factor: 1.0, unit: 'g' },
    { name: 'Semillas de Sésamo', category: 'Otros', factor: 1.0, unit: 'g' },
    { name: 'Semillas de Chía', category: 'Otros', factor: 6.0, unit: 'g' },
    { name: 'Semillas de Lino', category: 'Otros', factor: 1.0, unit: 'g' },
    { name: 'Aceite de Girasol', category: 'Otros', factor: 1.0, unit: 'ml' },
    { name: 'Aceite de Oliva', category: 'Otros', factor: 1.0, unit: 'ml' },
    { name: 'Vinagre de Alcohol', category: 'Otros', factor: 1.0, unit: 'ml' },
    { name: 'Vinagre de Manzana', category: 'Otros', factor: 1.0, unit: 'ml' },
    { name: 'Aceto Balsámico', category: 'Otros', factor: 1.0, unit: 'ml' },
    { name: 'Mayonesa', category: 'Salsa', factor: 1.0, unit: 'g' },
    { name: 'Mostaza', category: 'Salsa', factor: 1.0, unit: 'g' },
    { name: 'Ketchup', category: 'Salsa', factor: 1.0, unit: 'g' },
    { name: 'Salsa de Soja', category: 'Salsa', factor: 1.0, unit: 'ml' },
    { name: 'Miel', category: 'Otros', factor: 1.0, unit: 'g' },
    { name: 'Azúcar blanca', category: 'Otros', factor: 1.0, unit: 'g' },
    { name: 'Azúcar mascabo', category: 'Otros', factor: 1.0, unit: 'g' },
    { name: 'Edulcorante líquido', category: 'Otros', factor: 1.0, unit: 'chorro' },
    { name: 'Sal fina', category: 'Otros', factor: 1.0, unit: 'g' },
    { name: 'Sal gruesa', category: 'Otros', factor: 1.0, unit: 'g' },
    { name: 'Pimienta negra', category: 'Otros', factor: 1.0, unit: 'g' },
    { name: 'Ají molido', category: 'Otros', factor: 1.0, unit: 'g' },
    { name: 'Pimentón dulce', category: 'Otros', factor: 1.0, unit: 'g' },
    { name: 'Orégano seco', category: 'Otros', factor: 1.0, unit: 'g' },
    { name: 'Comino', category: 'Otros', factor: 1.0, unit: 'g' },
    { name: 'Cúrcuma', category: 'Otros', factor: 1.0, unit: 'g' }
  ];

  extraItems.forEach((item, index) => {
    defaults.push({
      id: 100 + index,
      name: item.name,
      is_recipe: false,
      default_unit: item.unit,
      category: item.category,
      conversion_factor: item.factor
    });
  });

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      
      // Merge logic: keep user changes, but add new defaults
      const existingNames = new Set(parsed.map(f => f.name.toLowerCase()));
      const newFromDefaults = defaults.filter(d => !existingNames.has(d.name.toLowerCase()));
      
      const merged = [...parsed, ...newFromDefaults.map(d => ({ ...d, id: Date.now() + Math.random() }))];

      return merged.map(food => {
        const def = defaults.find(d => d.name.toLowerCase() === food.name.toLowerCase());
        if (def && (!food.conversion_factor || food.conversion_factor === 1)) {
          return { ...food, conversion_factor: def.conversion_factor };
        }
        if (!food.conversion_factor || food.conversion_factor === 1) {
          return { ...food, conversion_factor: getSuggestedFactor(food.name) };
        }
        return food;
      });
    } catch (e) {
      console.error("Error parsing local database", e);
    }
  }
  return defaults;
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
  { regex: /pollo|chicken|ave|suprema/i, factor: 0.75 },
  { regex: /vaca|carne|beef|steak|picada|asado|vacio|matambre|peceto|nalga/i, factor: 0.70 },
  { regex: /cerdo|pork|bondiola/i, factor: 0.75 },
  { regex: /pescado|salmon|merluza|fish|trucha|pejerrey/i, factor: 0.80 },
  { regex: /arroz|rice|quinoa/i, factor: 2.50 },
  { regex: /fideo|pasta|spaghetti|penne|tallarin|moñito/i, factor: 2.25 },
  { regex: /lenteja|poroto|legumbre|bean|lentil|garbanzo/i, factor: 2.20 },
  { regex: /espinaca|kale|acelga/i, factor: 0.20 },
  { regex: /hongo|champi/i, factor: 0.50 },
  { regex: /papa|patata|batata/i, factor: 1.00 },
  { regex: /huevo|egg/i, factor: 0.90 },
  { regex: /pan|galleta|rebozador/i, factor: 1.00 },
  { regex: /zapallo|calabaza|anco/i, factor: 0.80 }
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
