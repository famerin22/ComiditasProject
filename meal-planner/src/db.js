import { supabase } from './supabase';

// FOODS
export const getFoods = async () => {
  const { data, error } = await supabase.from('foods').select('*').order('name');
  if (error) {
    console.error('Error fetching foods:', error);
    return [];
  }
  return data;
};

export const addFood = async (food) => {
  const { data, error } = await supabase
    .from('foods')
    .insert([{
      name: food.name,
      is_recipe: food.is_recipe,
      default_unit: food.default_unit,
      category: food.category,
      conversion_factor: food.conversion_factor,
      favorite: food.favorite,
      instructions: food.instructions,
      ingredients: food.ingredients
    }])
    .select();
  if (error) throw error;
  return data[0];
};

export const updateFood = async (id, food) => {
  const { data, error } = await supabase
    .from('foods')
    .update({
      name: food.name,
      is_recipe: food.is_recipe,
      default_unit: food.default_unit,
      category: food.category,
      conversion_factor: food.conversion_factor,
      favorite: food.favorite,
      instructions: food.instructions,
      ingredients: food.ingredients
    })
    .eq('id', id)
    .select();
  if (error) throw error;
  return data[0];
};

export const deleteFood = async (id) => {
  const { error } = await supabase.from('foods').delete().eq('id', id);
  if (error) throw error;
};

// SCHEDULES
export const getSchedules = async () => {
  const { data, error } = await supabase.from('schedules').select('*');
  if (error) {
    console.error('Error fetching schedules:', error);
    return null;
  }
  
  // Transform flat table into the nested structure used by the app
  const scheduleObj = { fer: {}, meli: {} };
  data.forEach(row => {
    if (!scheduleObj[row.user_name]) scheduleObj[row.user_name] = {};
    if (!scheduleObj[row.user_name][row.day_name]) scheduleObj[row.user_name][row.day_name] = {};
    scheduleObj[row.user_name][row.day_name][row.meal_time] = row.items;
  });
  return scheduleObj;
};

export const saveMealItems = async (userName, dayName, mealTime, items) => {
  const { error } = await supabase
    .from('schedules')
    .upsert({ 
      user_name: userName, 
      day_name: dayName, 
      meal_time: mealTime, 
      items,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_name,day_name,meal_time' });
  if (error) throw error;
};

export const clearDaySchedule = async (userName, dayName) => {
  const meals = ['desayuno', 'almuerzo', 'merienda', 'cena'];
  const promises = meals.map(meal => saveMealItems(userName, dayName, meal, []));
  await Promise.all(promises);
};

// SHOPPING LIST EXTRAS
export const getExtras = async () => {
  const { data, error } = await supabase.from('extras').select('*').order('created_at');
  if (error) return [];
  return data;
};

export const addExtra = async (name) => {
  const { data, error } = await supabase.from('extras').insert([{ name }]).select();
  if (error) throw error;
  return data[0];
};

export const updateExtra = async (id, bought) => {
  const { error } = await supabase.from('extras').update({ bought }).eq('id', id);
  if (error) throw error;
};

export const deleteExtra = async (id) => {
  const { error } = await supabase.from('extras').delete().eq('id', id);
  if (error) throw error;
};

export const deleteBoughtExtras = async () => {
  const { error } = await supabase.from('extras').delete().eq('bought', true);
  if (error) throw error;
};

// SHOPPING STATE (BOUGHT ITEMS)
export const getShoppingState = async () => {
  const { data, error } = await supabase.from('shopping_state').select('*');
  if (error) return {};
  const state = {};
  data.forEach(row => { state[row.item_key] = row.bought; });
  return state;
};

export const updateShoppingState = async (itemKey, bought) => {
  const { error } = await supabase
    .from('shopping_state')
    .upsert({ item_key: itemKey, bought, updated_at: new Date().toISOString() }, { onConflict: 'item_key' });
  if (error) throw error;
};

export const clearShoppingState = async () => {
  const { error } = await supabase.from('shopping_state').delete().neq('item_key', 'PROTECT_EMPTY_DELETE');
  if (error) throw error;
};
