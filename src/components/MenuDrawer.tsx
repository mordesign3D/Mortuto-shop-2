import React from 'react';
import {
  X,
  Phone,
  Mail,
  MessageCircle,
  AlertTriangle,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Package,
  Heart,
  ShoppingBag,
  Info
} from 'lucide-react';
import { MortutoLogo } from './MortutoLogo';
import { AdminUser } from '../types';
import { openWhatsAppReportIssue, WHATSAPP_PHONE_NUMBER } from '../utils/whatsapp';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  wishlistCount: number;
  ordersCount: number;
  cartCount: number;
  onOpenCart: () => void;
  onOpenOrders: () => void;
  onOpenAdminLogin: () => void;
  currentAdmin: AdminUser | null;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onSelectCategory,
  wishlistCount,
  ordersCount,
  cartCount,
  onOpenCart,
  onOpenOrders,
  onOpenAdminLogin,
  currentAdmin
}) => {
  if (!isOpen) return null;

  const handleCategoryClick = (cat: string) => {
    onSelectCategory(cat);
    onClose();
  };

  const handleOpenCartClick = () => {
    onClose();
    onOpenCart();
  };

  const handleOpenOrdersClick = () => {
    onClose();
    onOpenOrders();
  };

  const handleOpenAdminClick = () => {
    onClose();
    onOpenAdminLogin();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-sm sm:max-w-md bg-white shadow-2xl flex flex-col justify-between border-r border-slate-200">
          {/* Header */}
          <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
            <MortutoLogo size="sm" showSubtitle={true} />
            <button
              id="close-menu-drawer-btn"
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Fermer le menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Quick Actions Shortcuts */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleOpenCartClick}
                className="p-3 bg-orange-50 hover:bg-orange-100/80 border border-orange-200 rounded-2xl flex items-center space-x-2 text-left transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-900">Panier</div>
                  <div className="text-[10px] text-orange-700 font-semibold">{cartCount} article(s)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={handleOpenOrdersClick}
                className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl flex items-center space-x-2 text-left transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-900">Commandes</div>
                  <div className="text-[10px] text-slate-500 font-semibold">{ordersCount} suivie(s)</div>
                </div>
              </button>
            </div>

            {/* Catégories du catalogue */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                <Layers className="w-4 h-4 text-orange-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Catégories & Rayons
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryClick(cat)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        {cat === 'Promotions' && <span className="text-orange-400">🔥</span>}
                        {cat === 'Tous' && <span className="text-slate-400">✨</span>}
                        <span>{cat}</span>
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Coordonnées & Contacts Officiels */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                <Phone className="w-4 h-4 text-orange-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Mes Contacts & Service Client
                </h3>
              </div>

              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-2.5">
                {/* Numéro 1 : 77 178 86 56 (WhatsApp & Appel) */}
                <a
                  href="tel:+221771788656"
                  className="flex items-center justify-between p-2.5 bg-white hover:bg-emerald-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 transition-colors group"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <MessageCircle className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Principal / WhatsApp</div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">77 178 86 56</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-100/70 px-2 py-0.5 rounded-md">Appel / WA</span>
                </a>

                {/* Numéro 2 : 76 769 48 72 */}
                <a
                  href="tel:+221767694872"
                  className="flex items-center justify-between p-2.5 bg-white hover:bg-orange-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 transition-colors group"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Ligne Directe</div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-orange-700">76 769 48 72</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-orange-700 font-bold bg-orange-100/70 px-2 py-0.5 rounded-md">Appel</span>
                </a>

                {/* E-mail : Nianguemame@gmail.com */}
                <a
                  href="mailto:Nianguemame@gmail.com"
                  className="flex items-center justify-between p-2.5 bg-white hover:bg-blue-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 transition-colors group"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Adresse E-mail</div>
                      <div className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-700">Nianguemame@gmail.com</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-blue-700 font-bold bg-blue-100/70 px-2 py-0.5 rounded-md shrink-0 ml-1">E-mail</span>
                </a>
              </div>
            </div>

            {/* BOUTON SIGNALER UN PROBLÈME -> WHATSAPP */}
            <div className="space-y-2">
              <button
                id="report-issue-menu-btn"
                type="button"
                onClick={() => {
                  openWhatsAppReportIssue();
                  onClose();
                }}
                className="w-full py-3.5 px-4 bg-rose-50 hover:bg-rose-100 active:scale-[0.99] border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-black text-rose-900">Signaler un problème</div>
                    <div className="text-[10px] text-rose-700 font-medium">Assistance directe sur WhatsApp</div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 bg-rose-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-2xs group-hover:bg-rose-700 transition-colors">
                  <MessageCircle className="w-3 h-3 fill-white" />
                  <span>Ouvrir</span>
                </div>
              </button>
            </div>

            {/* Administration link */}
            <div className="pt-2 border-t border-slate-100">
              <button
                id="menu-admin-access-btn"
                type="button"
                onClick={handleOpenAdminClick}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-orange-600" />
                <span>{currentAdmin ? `Espace Admin (${currentAdmin.username})` : 'Connexion Administrateur'}</span>
              </button>
            </div>
          </div>

          {/* Footer note */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-[10px] text-slate-500 shrink-0">
            mortuto-shop • Dakar, Sénégal • 77 178 86 56 / 76 769 48 72
          </div>
        </div>
      </div>
    </div>
  );
};
