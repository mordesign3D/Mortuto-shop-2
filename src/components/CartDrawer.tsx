import React from 'react';
import { CartItem } from '../types';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, MessageCircle } from 'lucide-react';
import { openWhatsAppCart } from '../utils/whatsapp';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const cartTotalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 80;
  const missingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const shippingCost = cartSubtotal >= freeShippingThreshold || cartItems.length === 0 ? 0 : 4.90;
  const cartTotal = cartSubtotal + shippingCost;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-orange-600" />
            <h2 className="text-base font-bold text-slate-900">Mon Panier ({cartTotalItemsCount})</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free shipping progress */}
        <div className="bg-orange-50/70 p-3.5 border-b border-orange-100 text-xs">
          {missingForFreeShipping > 0 ? (
            <p className="text-orange-950 font-medium text-center">
              Plus que <span className="font-bold text-orange-700">{missingForFreeShipping.toFixed(2)} €</span> pour la <span className="font-bold">livraison gratuite</span> !
            </p>
          ) : (
            <p className="text-emerald-700 font-bold text-center flex items-center justify-center space-x-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Livraison OFFERTE par mortuto-shop !</span>
            </p>
          )}
          <div className="w-full bg-orange-200/80 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-orange-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (cartSubtotal / freeShippingThreshold) * 100)}%` }}
            />
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-slate-100">
          {cartItems.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Votre panier mortuto-shop est vide</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Découvrez nos articles d'exception et profitez des promotions en cours !
              </p>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div key={index} className="pt-4 first:pt-0 flex space-x-3 items-center">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 object-cover rounded-xl bg-slate-100 border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{item.product.name}</h4>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                    {item.selectedSize && <span>Taille: {item.selectedSize}</span>}
                    {item.selectedColor && <span>Couleur: {item.selectedColor}</span>}
                  </div>
                  <span className="text-xs font-extrabold text-slate-900 block mt-1">
                    {(item.product.price * item.quantity).toFixed(2)} €
                  </span>
                </div>

                <div className="flex items-center space-x-2 bg-slate-100 rounded-xl p-1 shrink-0">
                  <button
                    onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                    className="p-1 hover:bg-white rounded-lg text-slate-600 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold text-slate-800 px-1">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                    className="p-1 hover:bg-white rounded-lg text-slate-600 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <button
                  onClick={() => onRemoveItem(index)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span className="font-semibold text-slate-900">{cartSubtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>Frais de livraison</span>
                <span className="font-semibold text-slate-900">
                  {shippingCost === 0 ? 'Gratuit' : `${shippingCost.toFixed(2)} €`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total TTC</span>
                <span className="text-orange-600">{cartTotal.toFixed(2)} €</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                id="checkout-proceed-btn"
                onClick={onProceedToCheckout}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-md transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Commander via WhatsApp Business</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => openWhatsAppCart(cartItems, cartTotal)}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors border border-slate-200"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Envoyer le panier brut sur WhatsApp</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
