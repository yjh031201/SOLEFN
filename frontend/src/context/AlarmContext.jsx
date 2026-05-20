import { createContext, useContext, useState, useCallback } from "react";

const AlarmContext = createContext(null);

export function AlarmProvider({ children }) {
  const [alarms, setAlarms] = useState([]);

  const addAlarm = useCallback((message, product) => {
    const newAlarm = {
      id: Date.now(),
      message,
      productTitle: product?.title ?? null,
      productImage: product?.image ?? null,
      productId: product?.id ?? null,
      productState: product ?? null,
      createdAt: new Date(),
    };
    setAlarms((prev) => [newAlarm, ...prev]);
  }, []);

  const removeAlarm = useCallback((id) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const clearAlarms = useCallback(() => {
    setAlarms([]);
  }, []);

  return (
    <AlarmContext.Provider value={{ alarms, addAlarm, removeAlarm, clearAlarms }}>
      {children}
    </AlarmContext.Provider>
  );
}

export function useAlarm() {
  return useContext(AlarmContext);
}
