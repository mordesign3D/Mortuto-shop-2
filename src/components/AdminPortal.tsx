import React, { useState } from 'react';
import { AdminUser, Product, Order } from '../types';
import { MortutoLogo } from './MortutoLogo';
import { AdminDashboard } from './AdminDashboard';
import {
  ShieldCheck,
  Lock,
  User,
  ArrowLeft,
  AlertCircle,
  Eye,
  EyeOff,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { navigateTo } from '../utils/navigation';

interface AdminPortalProps {
  currentAdmin: AdminUser | null;
  onLogin: (admin: AdminUser) => void;
  onLogout: () => void;
  admins: AdminUser[];
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onAddAdmin: (newAdmin: AdminUser) => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentAdmin,
  onLogin,
  onLogout,
  admins,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddAdmin,
  orders,
  onUpdateOrderStatus
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const found = admins.find(
      a =>
        a.username.trim().toLowerCase() === username.trim().toLowerCase() &&
        a.passwordHash === password
    );

    if (found) {
      onLogin(found);
      setUsername('');
      setPassword('');
      setErrorMsg('');
    } else {
      setErrorMsg('Identifiant ou mot de passe invalide. Veuillez réessayer.');
    }
    setIsSubmitting(false);
  };

  // If already authenticated, show the Admin Dashboard full-screen
  if (currentAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-slate-950 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              onClick={() => navigateTo('store')}
              className="cursor-pointer"
              title="Retour à la boutique"
            >
              <MortutoLogo size="sm" showSubtitle={false} />
            </div>
            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 border-l border-slate-800 pl-4">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              <span>Portail de Gestion & Administration</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              id="back-to-shop-btn"
              onClick={() => navigateTo('store')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-orange-400" />
              <span>Voir la boutique</span>
            </button>

            <button
              id="admin-logout-btn"
              onClick={onLogout}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/40 text-xs font-semibold transition-colors"
            >
              <span>Déconnexion</span>
            </button>
          </div>
        </header>

        {/* Dashboard Component */}
        <AdminDashboard
          isOpen={true}
          onClose={() => navigateTo('store')}
          currentAdmin={currentAdmin}
          onLogout={onLogout}
          products={products}
          onAddProduct={onAddProduct}
          onUpdateProduct={onUpdateProduct}
          onDeleteProduct={onDeleteProduct}
          admins={admins}
          onAddAdmin={onAddAdmin}
          orders={orders}
          onUpdateOrderStatus={onUpdateOrderStatus}
        />
      </div>
    );
  }

  // If not authenticated, display the dedicated login screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-100">
      {/* Back to shop floating link */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center">
        <button
          id="nav-back-to-store"
          onClick={() => navigateTo('store')}
          className="inline-flex items-center space-x-2 text-xs text-slate-400 hover:text-orange-400 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à la boutique</span>
        </button>

        <span className="text-[11px] text-slate-500 font-mono">mortuto-shop v2.6</span>
      </div>

      {/* Admin Login Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl space-y-6 relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand and Title */}
        <div className="text-center space-y-3">
          <MortutoLogo size="md" className="justify-center mx-auto" />
          <div>
            <h1 className="text-lg sm:text-xl font-black text-white flex items-center justify-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-orange-500" />
              <span>Accès Administrateur</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Espace confidentiel de gestion des stocks, commandes et promotions.
            </p>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 bg-rose-950/80 border border-rose-800/80 text-rose-300 rounded-2xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Nom d'utilisateur
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                id="admin-login-username"
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Identifiant administrateur"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                id="admin-login-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 transition-colors"
                title={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            id="admin-login-submit"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 active:scale-[0.99] text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-orange-950/50 flex items-center justify-center space-x-2 mt-2 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Connexion sécurisée</span>
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            Accès strictement réservé aux gestionnaires de <span className="text-slate-400 font-semibold">mortuto-shop</span>.
          </p>
        </div>
      </div>
    </div>
  );
};
