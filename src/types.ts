export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number; // e.g., 20 for -20%
  isPromo?: boolean;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  inStock: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  tags: string[];
  sizes?: string[];
  colors?: { name: string; hex: string }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  status: 'En préparation' | 'Expédié' | 'Livré';
  shippingAddress: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
  };
}

export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string; // In client context, stored plain or hash
  role: 'Super Admin' | 'Gestionnaire';
  createdAt: string;
}
