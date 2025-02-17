export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'delivered';
  payment_method: 'cod' | 'upi' | 'card';
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  name?: string;
  phone_number?: string;
  address?: string;
}