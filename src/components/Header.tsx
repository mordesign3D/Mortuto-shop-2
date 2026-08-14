import React from 'react';
import { MortutoLogo } from './MortutoLogo';
import {
  Menu,
  Search,
  ShoppingBag,
  Heart,
  Package,
  ShieldCheck,
  Sparkles,
  SlidersHorizontal,
  Phone,
  AlertTriangle
} from 'lucide-react';
import { AdminUser } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  categories: string[];
  wishlistCount: number;
  ordersCount: number;
  cartCount: number;
  onOpenCart: () => void;
  onOpenOrders: () => void;
  onOpenAdminLogin: () => void;
  onOpenMenu?: () => void;
  currentAdmin: AdminUser | null;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  categories,
  wishlistCount,
  ordersCount,
  cartCount,
  onOpenCart,
  onOpenOrders,
  onOpenAdminLogin,
  onOpenMenu,
  currentAdmin
}) => {
  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner Announcement */}
      <div className="bg-slate-900 text-slate-100 text-[11px] py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center space-x-2">
        <Sparkles className="w-3.5 h-3.5 text-orange-400 shrink-0" />
        <span>Boutique Officielle mortuto-shop • Dakar, Sénégal • 77 178 86 56 / 76 769 48 72</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 sm:gap-4">
          {/* Left: Menu Hamburger & Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              id="header-menu-btn"
              type="button"
              onClick={onOpenMenu}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center justify-center cursor-pointer group shadow-2xs"
              title="Ouvrir le menu, catégories et contacts"
              aria-label="Menu principal"
            >
              <Menu className="w-5 h-5 group-hover:scale-105 transition-transform" />
            </button>

            {/* Mortuto Brand Logo */}
            <div
              className="cursor-pointer group py-1"
              onClick={() => {
                onSelectCategory('Tous');
                onSearchChange('');
              }}
            >
              <MortutoLogo size="md" />
            </div>
          </div>

          {/* Search Input Bar (Desktop) */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                id="search-input-header"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Rechercher un produit, vêtement, promo..."
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-100/90 border border-transparent rounded-full focus:bg-white focus:border-orange-500 focus:outline-hidden focus:ring-2 focus:ring-orange-100 transition-all"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1.5 sm:space-x-3">
            {/* Espace Administrateur Button (Visible ONLY when an admin is actively authenticated) */}
            {currentAdmin && (
              <button
                id="admin-space-btn"
                onClick={onOpenAdminLogin}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 cursor-pointer"
                title="Accéder au panneau d'administration"
              >
                <ShieldCheck className="w-4 h-4 text-orange-600" />
                <span className="hidden lg:inline">Admin: {currentAdmin.username}</span>
              </button>
            )}

            {/* Wishlist Indicator */}
            <div className="relative hidden xs:flex items-center px-2 py-1 text-slate-600 text-xs font-semibold">
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-600'} mr-1`} />
              <span className="hidden sm:inline">Favoris</span>
              {wishlistCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-rose-100 text-rose-700 rounded-full font-bold text-[10px]">
                  {wishlistCount}
                </span>
              )}
            </div>

            {/* Orders Modal Trigger */}
            <button
              id="orders-drawer-button"
              onClick={onOpenOrders}
              className="relative flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Package className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Commandes</span>
              {ordersCount > 0 && (
                <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded-full text-[10px] font-bold">
                  {ordersCount}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              id="cart-drawer-button"
              onClick={onOpenCart}
              className="relative flex items-center space-x-1.5 sm:space-x-2 px-3.5 sm:px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-full text-xs font-extrabold shadow-xs transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Panier</span>
              {cartCount > 0 && (
                <span className="ml-0.5 bg-white text-orange-700 px-2 py-0.5 rounded-full text-[11px] font-black shadow-2xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
            <input
              id="search-input-mobile"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher sur mortuto-shop..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-100 border border-transparent rounded-full focus:bg-white focus:border-orange-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center space-x-2 py-2.5 overflow-x-auto no-scrollbar border-t border-slate-100">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
