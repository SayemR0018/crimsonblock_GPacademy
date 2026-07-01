import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Discount = { code: string; percent: number };
export type PaymentMethod = "bkash" | "cod" | "card";

export type Order = {
  id: string;
  name: string;
  address: string;
  phone: string;
  method: PaymentMethod;
  code: string | null;
  percent: number;
  total: number;
  ts: number;
};

type Ctx = {
  discount: Discount | null;
  orders: Order[];
  applyDiscount: (d: Discount) => void;
  clearDiscount: () => void;
  addOrder: (o: Order) => void;
};

const CrimsonCtx = createContext<Ctx | null>(null);
const STORAGE_KEY = "crimson_orders";

export function CrimsonProvider({ children }: { children: ReactNode }) {
  const [discount, setDiscount] = useState<Discount | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setOrders(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const applyDiscount = useCallback((d: Discount) => setDiscount(d), []);
  const clearDiscount = useCallback(() => setDiscount(null), []);
  const addOrder = useCallback((o: Order) => {
    setOrders((prev) => {
      const next = [o, ...prev];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ discount, orders, applyDiscount, clearDiscount, addOrder }),
    [discount, orders, applyDiscount, clearDiscount, addOrder],
  );

  return <CrimsonCtx.Provider value={value}>{children}</CrimsonCtx.Provider>;
}

export function useCrimson() {
  const ctx = useContext(CrimsonCtx);
  if (!ctx) throw new Error("useCrimson must be used inside CrimsonProvider");
  return ctx;
}
