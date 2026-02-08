import React from 'react';

// We destructure the props here for cleaner code
export default function DayRow({ day, data, onChange }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 grid grid-cols-3 items-center gap-4 hover:border-orange-200 transition-colors">
      
      {/* 1. The Label */}
      <span className="font-bold text-slate-500 text-sm uppercase tracking-wider">
        {day}
      </span>

      {/* 2. Almuerzo Input */}
      <input 
        className="border border-slate-200 p-2 rounded text-sm focus:ring-2 focus:ring-orange-200 outline-none transition-all"
        placeholder="Almuerzo"
        value={data.almuerzo || ""}
        onChange={(e) => onChange('almuerzo', e.target.value)}
      />

      {/* 3. Cena Input */}
      <input 
        className="border border-slate-200 p-2 rounded text-sm focus:ring-2 focus:ring-orange-200 outline-none transition-all"
        placeholder="Cena"
        value={data.cena || ""}
        onChange={(e) => onChange('cena', e.target.value)}
      />
      
    </div>
  );
}