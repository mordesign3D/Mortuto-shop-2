import React, { useState } from 'react';
import { CartItem, Order } from '../types';
import { MortutoLogo } from './MortutoLogo';
import { X, Truck, CheckCircle2, MessageCircle, ExternalLink, Loader2 } from 'lucide-react';
import { openWhatsAppOrder } from '../utils/whatsapp';
import { formatCFA } from '../utils/formatters';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onCompleteOrder: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onCompleteOrder
}) => {
  if (!isOpen) return null;

  const [checkoutForm, setCheckoutForm] = useState({
    fullName: 'Mame Niang',
    phone: '77 178 86 56',
    email: 'mame.niang@gmail.com',
    address: '15 Avenue Principale',
    city: 'Dakar',
    postalCode: '10000'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 50000;
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 2500;
  const total = subtotal + shippingCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder: Order = {
        id: `CMD-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
        items: [...cartItems],
        totalAmount: total,
        status: 'En préparation',
        shippingAddress: { ...checkoutForm }
      };

      onCompleteOrder(newOrder);
      setCompletedOrder(newOrder);
      setIsSubmitting(false);

      // Trigger redirection to WhatsApp Business account
      openWhatsAppOrder(newOrder);
    }, 750);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 relative max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">Commande via WhatsApp Business</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {completedOrder ? (
          <div className="p-8 text-center space-y-4 my-auto animate-fade-in">
            <MortutoLogo size="md" className="justify-center mx-auto" />
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Commande Transmise sur WhatsApp !</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Merci <span className="font-bold text-slate-900">{completedOrder.shippingAddress.fullName}</span> ! Votre récapitulatif de commande a été préparé et transmis sur WhatsApp Business.
            </p>

            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-left text-xs max-w-md mx-auto space-y-1 text-emerald-950">
              <p><span className="font-bold">N° de commande :</span> {completedOrder.id}</p>
              <p><span className="font-bold">Montant Total :</span> {formatCFA(completedOrder.totalAmount)}</p>
              <p><span className="font-bold">WhatsApp Vendeur :</span> mortuto-shop (77 178 86 56)</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => openWhatsAppOrder(completedOrder)}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Ouvrir WhatsApp à nouveau</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
            {/* Banner explaining WhatsApp integration */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-start space-x-3 text-xs text-emerald-900">
              <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Transmission directe sur WhatsApp (77 178 86 56) !</p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  En validant votre commande, le récapitulatif complet et vos coordonnées sont transmis en direct sur le compte WhatsApp vendeur officiel de <span className="font-bold">mortuto-shop (+221 77 178 86 56)</span>.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                <Truck className="w-4 h-4 text-orange-600" />
                <span>Informations de Livraison</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Nom complet</label>
                  <input
                    type="text"
                    required
                    value={checkoutForm.fullName}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Téléphone de contact</label>
                  <input
                    type="tel"
                    required
                    value={checkoutForm.phone}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                    placeholder="Ex: 77 178 86 56"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 font-semibold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">E-mail</label>
                  <input
                    type="email"
                    required
                    value={checkoutForm.email}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Adresse de livraison</label>
                  <input
                    type="text"
                    required
                    value={checkoutForm.address}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Code Postal</label>
                  <input
                    type="text"
                    required
                    value={checkoutForm.postalCode}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, postalCode: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Ville</label>
                  <input
                    type="text"
                    required
                    value={checkoutForm.city}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Order summary box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between font-medium text-slate-600">
                <span>Sous-total ({cartItems.length} article(s))</span>
                <span>{formatCFA(subtotal)}</span>
              </div>
              <div className="flex justify-between font-medium text-slate-600">
                <span>Livraison Express</span>
                <span>{shippingCost === 0 ? 'Gratuit' : formatCFA(shippingCost)}</span>
              </div>
              <div className="flex justify-between font-black text-slate-900 text-sm pt-2 border-t border-slate-200">
                <span>Total à régler</span>
                <span className="text-orange-600">{formatCFA(total)}</span>
              </div>
            </div>

            <button
              id="checkout-whatsapp-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-md transition-colors cursor-pointer disabled:opacity-80"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Envoi vers WhatsApp 77 178 86 56...</span>
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Envoyer la commande au 77 178 86 56 ({formatCFA(total)})</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
