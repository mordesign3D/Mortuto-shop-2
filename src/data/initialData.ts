import { Product, AdminUser } from '../types';

export const DEFAULT_ADMINS: AdminUser[] = [
  {
    id: 'admin-1',
    username: 'mortuto4',
    passwordHash: 'Mortuto2',
    role: 'Super Admin',
    createdAt: '2026-08-13'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Veste en Laine Mérinos L’Élégante',
    category: 'Vêtements',
    price: 149.99,
    originalPrice: 189.99,
    discountPercent: 21,
    isPromo: true,
    rating: 4.8,
    reviewsCount: 42,
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800',
    description: 'Conçue avec 100% de laine mérinos ultra-douce. Coupe intemporelle pour un confort exceptionnel en toutes saisons.',
    inStock: true,
    isNew: true,
    isFeatured: true,
    tags: ['Mérinos', 'Chic', 'Hiver'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Beige Sable', hex: '#D2B48C' },
      { name: 'Noir Ébène', hex: '#111827' },
      { name: 'Bleu Marine', hex: '#1E3A8A' }
    ]
  },
  {
    id: 'p2',
    name: 'Sac à Main Cuir Pleine Fleur Artisan',
    category: 'Accessoires',
    price: 159.20,
    originalPrice: 199.00,
    discountPercent: 20,
    isPromo: true,
    rating: 4.9,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
    description: 'Fabriqué à la main avec du cuir tanné végétalement. Comporte des compartiments intérieurs zippés et une sangle ajustable.',
    inStock: true,
    isFeatured: true,
    tags: ['Cuir', 'Artisanal', 'Luxe'],
    colors: [
      { name: 'Marron Cognac', hex: '#9A3412' },
      { name: 'Noir Intense', hex: '#000000' }
    ]
  },
  {
    id: 'p3',
    name: 'Sneakers Minimalistes Urbaines',
    category: 'Chaussures',
    price: 119.50,
    originalPrice: 139.50,
    discountPercent: 14,
    isPromo: true,
    rating: 4.7,
    reviewsCount: 65,
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=800',
    description: 'Baskets en cuir italien haut de gamme. Semelle ergonomique amortissante pour une marche sans effort au quotidien.',
    inStock: true,
    isNew: false,
    isFeatured: true,
    tags: ['Cuir', 'Confort', 'Streetwear'],
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    colors: [
      { name: 'Blanc Pur', hex: '#FFFFFF' },
      { name: 'Gris Beige', hex: '#E5E7EB' }
    ]
  },
  {
    id: 'p4',
    name: 'Écouteurs Sans Fil Hi-Fi Studio',
    category: 'Électronique',
    price: 179.00,
    originalPrice: 219.00,
    discountPercent: 18,
    isPromo: true,
    rating: 4.8,
    reviewsCount: 120,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    description: 'Réduction de bruit active de pointe et autonomie de 35 heures. Son cristallin certifié Hi-Res Audio.',
    inStock: true,
    isNew: true,
    isFeatured: true,
    tags: ['Audio', 'Bluetooth', 'Noise-Cancelling'],
    colors: [
      { name: 'Noir Mat', hex: '#1F2937' },
      { name: 'Argent Satiné', hex: '#D1D5DB' }
    ]
  },
  {
    id: 'p5',
    name: 'Montre Chronographe Classique',
    category: 'Accessoires',
    price: 249.00,
    isPromo: false,
    rating: 4.9,
    reviewsCount: 54,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    description: 'Mouvement à quartz de haute précision, verre saphir anti-rayures et bracelet en cuir véritable.',
    inStock: true,
    isFeatured: false,
    tags: ['Horlogerie', 'Luxe', 'Inox'],
    colors: [
      { name: 'Cadran Noir / Cuir Marron', hex: '#78350F' },
      { name: 'Cadran Blanc / Cuir Noir', hex: '#111827' }
    ]
  },
  {
    id: 'p6',
    name: 'Lampe Design Céramique & Laiton',
    category: 'Maison',
    price: 71.92,
    originalPrice: 89.90,
    discountPercent: 20,
    isPromo: true,
    rating: 4.6,
    reviewsCount: 31,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800',
    description: 'Éclairage d’ambiance chaleureux à LED variable. Pied en céramique artisanale et finitions en laiton brossé.',
    inStock: true,
    isNew: true,
    isFeatured: false,
    tags: ['Déco', 'Design', 'Lumière']
  }
];
