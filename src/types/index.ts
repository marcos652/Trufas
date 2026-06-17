export interface Truffle {
  id: string;
  name: string;
  flavor: string;
  description: string;
  price: number;
  quantity: number;
  available: boolean;
  comingSoon: boolean;
  launchDate?: string;
  imageBase64: string;
  category: TruffleCategory;
  createdAt: string;
  updatedAt: string;
}

export type TruffleCategory = 'Clássica' | 'Premium' | 'Especial' | 'Sazonal';

export interface TruffleFormData {
  name: string;
  flavor: string;
  description: string;
  price: number;
  quantity: number;
  available: boolean;
  comingSoon: boolean;
  launchDate?: string;
  imageBase64: string;
  category: TruffleCategory;
}

export interface AdminStats {
  total: number;
  available: number;
  unavailable: number;
  comingSoon: number;
  totalQuantity: number;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export type OrderStatus = 'Pendente' | 'Concluído' | 'Cancelado';

export interface OrderItem {
  id: string;
  truffleId: string;
  name: string;
  price: number;
  quantity: number;
  imageBase64?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrderFormData {
  customerName: string;
  customerPhone: string;
}
