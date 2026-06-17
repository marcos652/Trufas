import { useState, useEffect, useCallback } from 'react';
import {
  db,
  TRUFFLES_COLLECTION,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from '../services/firebase';
import type { Truffle, TruffleFormData } from '../types';

export function useTruffles() {
  const [truffles, setTruffles] = useState<Truffle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, TRUFFLES_COLLECTION),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Truffle[];
        setTruffles(data);
        setLoading(false);
      },
      (err) => {
        console.error('Firestore error:', err);
        setError('Erro ao carregar dados. Verifique as configurações do Firebase.');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const addTruffle = useCallback(async (data: TruffleFormData) => {
    const now = new Date().toISOString();
    await addDoc(collection(db, TRUFFLES_COLLECTION), {
      ...data,
      createdAt: now,
      updatedAt: now,
    });
  }, []);

  const updateTruffle = useCallback(async (id: string, data: Partial<TruffleFormData>) => {
    const ref = doc(db, TRUFFLES_COLLECTION, id);
    await updateDoc(ref, { ...data, updatedAt: new Date().toISOString() });
  }, []);

  const deleteTruffle = useCallback(async (id: string) => {
    await deleteDoc(doc(db, TRUFFLES_COLLECTION, id));
  }, []);

  const toggleAvailability = useCallback(async (id: string, available: boolean) => {
    const ref = doc(db, TRUFFLES_COLLECTION, id);
    await updateDoc(ref, { available, updatedAt: new Date().toISOString() });
  }, []);

  return {
    truffles,
    loading,
    error,
    addTruffle,
    updateTruffle,
    deleteTruffle,
    toggleAvailability,
  };
}
