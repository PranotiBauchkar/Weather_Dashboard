import { createContext, useContext, useEffect, useState } from 'react';

const UnitContext = createContext();
const UNIT_KEY = 'weather-dashboard-unit';

export function UnitProvider({ children }) {
  const [unit, setUnit] = useState(() => localStorage.getItem(UNIT_KEY) || 'celsius');

  useEffect(() => {
    localStorage.setItem(UNIT_KEY, unit);
  }, [unit]);

  const toggleUnit = () => setUnit((prev) => (prev === 'celsius' ? 'fahrenheit' : 'celsius'));
  const isCelsius = unit === 'celsius';

  return (
    <UnitContext.Provider value={{ unit, toggleUnit, isCelsius }}>
      {children}
    </UnitContext.Provider>
  );
}

export function useUnit() {
  const context = useContext(UnitContext);
  if (!context) throw new Error('useUnit must be used within UnitProvider');
  return context;
}
