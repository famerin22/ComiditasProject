import React from 'react';

export default function MealPicker({ label, value, options, onChange }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
        {label}
      </label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm shadow-sm focus:ring-2 focus:ring-orange-200 outline-none appearance-none cursor-pointer hover:border-orange-300 transition-all"
      >
        <option value="">— Nada seleccionado —</option>
        
        {/* We group options to make it easier to find Recipes vs Ingredients */}
        <optgroup label="Recetas (Moléculas)">
          {options.filter(opt => opt.is_recipe).map(opt => (
            <option key={opt.id} value={opt.name}>{opt.name}</option>
          ))}
        </optgroup>

        <optgroup label="Ingredientes (Átomos)">
          {options.filter(opt => !opt.is_recipe).map(opt => (
            <option key={opt.id} value={opt.name}>{opt.name}</option>
          ))}
        </optgroup>
      </select>
    </div>
  );
}