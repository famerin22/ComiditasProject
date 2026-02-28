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
    { id: 1, name: 'Milanesas con Puré', is_recipe: true },
    { id: 2, name: 'Fideos con Tuco', is_recipe: true },
    { id: 3, name: 'Pechuga de Pollo', is_recipe: false },
    { id: 4, name: 'Papas', is_recipe: false },
    { id: 5, name: 'Fideos', is_recipe: false },
    { id: 6, name: 'Salsa de Tomate', is_recipe: false },
    { id: 7, name: 'Carne Picada', is_recipe: false },
    { id: 8, name: 'Leche', is_recipe: false },
    { id: 9, name: 'Manteca', is_recipe: false },
    { id: 10, name: 'Huevo', is_recipe: false },
    { id: 11, name: 'Pan Rallado', is_recipe: false },
    { id: 12, name: 'Cebolla', is_recipe: false }
  ];
};

let MOCK_DB = getInitialData();

const saveToLocal = () => {
  localStorage.setItem('meal_planner_db', JSON.stringify(MOCK_DB));
};

export const getFoods = () => [...MOCK_DB];

export const addFood = (food) => {
  const newFood = { ...food, id: Date.now() };
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

export default MOCK_DB;
