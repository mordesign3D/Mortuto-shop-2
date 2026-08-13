import React from 'react';
import { Order } from '../types';
import { X, Package, Clock, Truck, CheckCircle2 } from 'lucide-react';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export const OrdersModal: React.FC<OrdersModalProps> = ({
  isOpen,
  onClose,
  orders
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 relative max-h-[85vh] flex flex-col">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-orange-600" />
            <h2 className="text-base font-bold text-slate-900">Mes Commandes mortuto-shop</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {orders.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Package className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">Aucune commande effectuée pour le moment.</h3>
              <p className="text-xs text-slate-500">
                Vos futurs achats sur la boutique mortuto-shop apparaîtront ici.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-xs border-b border-slate-200 pb-2">
                  <div>
                    <span className="font-extrabold text-slate-900">{order.id}</span>
                    <span className="text-slate-400 ml-2">• {order.date}</span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center space-x-1 ${
                    order.status === 'Livré'
                      ? 'bg-emerald-100 text-emerald-800'
                      : order.status === 'Expédié'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    <Clock className="w-3 h-3" />
                    <span>{order.status}</span>
                  </span>
                </div>

                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3 text-xs">
                      <img src={item.product.image} alt={item.product.name} className="w-10 h-10 object-cover rounded-lg bg-white border border-slate-200" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 truncate">{item.product.name}</p>
                        <p className="text-[10px] text-slate-500">
                          Quantité : {item.quantity} {item.selectedSize ? `• Taille ${item.selectedSize}` : ''}
                        </p>
                      </div>
                      <span className="font-bold text-slate-800">{(item.product.price * item.quantity).toFixed(2)} €</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-600">Total payé</span>
                  <span className="text-orange-600 text-sm">{order.totalAmount.toFixed(2)} €</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
