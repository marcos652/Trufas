import { useState, useEffect, useCallback } from 'react';
import {
  db,
  ORDERS_COLLECTION,
  collection,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
} from '../services/firebase';
import type { Order, OrderStatus } from '../types';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Order[];
        setOrders(data);
        setLoading(false);
      },
      (err) => {
        console.error('Firestore error (orders):', err);
        setError('Erro ao carregar pedidos.');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const createOrder = useCallback(async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    await addDoc(collection(db, ORDERS_COLLECTION), {
      ...orderData,
      createdAt: now,
      updatedAt: now,
    });
  }, []);

  const updateOrderStatus = useCallback(async (id: string, status: OrderStatus) => {
    const ref = doc(db, ORDERS_COLLECTION, id);
    await updateDoc(ref, { status, updatedAt: new Date().toISOString() });
  }, []);

  return {
    orders,
    loading,
    error,
    createOrder,
    updateOrderStatus,
  };
}
