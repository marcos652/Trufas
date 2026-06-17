import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import type { OrderItem, Truffle } from '../types';

interface CartContextValue {
  items: OrderItem[];
  addToCart: (truffle: Truffle) => void;
  removeFromCart: (truffleId: string) => void;
  updateQuantity: (truffleId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = (truffle: Truffle) => {
    setItems((current) => {
      const existing = current.find((i) => i.truffleId === truffle.id);
      if (existing) {
        return current.map((i) =>
          i.truffleId === truffle.id
            ? { ...i, quantity: Math.min(i.quantity + 1, truffle.quantity) }
            : i
        );
      }
      return [
        ...current,
        {
          id: crypto.randomUUID(),
          truffleId: truffle.id,
          name: truffle.name,
          price: truffle.price,
          quantity: 1,
          imageBase64: truffle.imageBase64,
        },
      ];
    });
    setIsOpen(true); // Abre o carrinho automaticamente ao adicionar
  };

  const removeFromCart = (truffleId: string) => {
    setItems((current) => current.filter((i) => i.truffleId !== truffleId));
  };

  const updateQuantity = (truffleId: string, quantity: number) => {
    setItems((current) =>
      current.map((i) => (i.truffleId === truffleId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = useMemo(() => items.reduce((acc, i) => acc + i.quantity, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((acc, i) => acc + i.price * i.quantity, 0), [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
