import React, { useState } from 'react';
import { AdminUser } from '../types';
import { MortutoLogo } from './MortutoLogo';
import { X, Lock, User, ShieldCheck, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  admins: AdminUser[];
  onSuccessLogin: (admin: AdminUser) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  admins,
  onSuccessLogin
}) => {
  if (!isOpen) return null;

  const [username, setUsername] = useState('mortuto4');
  const [password, setPassword] = useState('Mortuto2');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const found = admins.find(
      a => a.username.trim().toLowerCase() === username.trim().toLowerCase() && a.passwordHash === password
    );

    if (found) {
      onSuccessLogin(found);
      onClose();
    } else {
      setErrorMsg('Identifiant ou mot de passe incorrect.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 relative p-6 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <MortutoLogo size="md" className="justify-center mx-auto" />
          <div className="pt-2">
            <h2 className="text-lg font-bold text-slate-900 flex items-center justify-center space-x-1.5">
              <ShieldCheck className="w-5 h-5 text-orange-600" />
              <span>Espace Administration</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Connectez-vous pour gérer vos produits, promos et administrateurs.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center space-x-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Nom d'utilisateur</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
              <input
                id="admin-username-input"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: mortuto4"
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Mot de passe</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
              <input
                id="admin-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-[11px] text-orange-950 leading-relaxed">
            <span className="font-bold block">Identifiants de démonstration :</span>
            <span>Nom d'utilisateur : <code className="bg-orange-100 px-1 py-0.5 rounded font-mono font-bold">mortuto4</code></span>
            <br />
            <span>Mot de passe : <code className="bg-orange-100 px-1 py-0.5 rounded font-mono font-bold">Mortuto2</code></span>
          </div>

          <button
            id="submit-admin-login"
            type="submit"
            className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md flex items-center justify-center space-x-2"
          >
            <Lock className="w-4 h-4" />
            <span>Se connecter à l'Admin</span>
          </button>
        </form>
      </div>
    </div>
  );
};
