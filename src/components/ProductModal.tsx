import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { X, Heart, Star, ShoppingBag, Check, ShieldCheck, Tag } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onAddToCart: (p: Product, size?: string, color?: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart
}) => {
  if (!product) return null;

  const [modalSize, setModalSize] = useState<string | undefined>(
    product.sizes ? product.sizes[0] : undefined
  );
  const [modalColor, setModalColor] = useState<string | undefined>(
    product.colors ? product.colors[0].name : undefined
  );
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    setModalSize(product.sizes ? product.sizes[0] : undefined);
    setModalColor(product.colors ? product.colors[0].name : undefined);
  }, [product]);

  const handleAdd = () => {
    onAddToCart(product, modalSize, modalColor);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 relative flex flex-col md:flex-row max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="md:w-1/2 bg-slate-100 relative min-h-[280px]">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />

          {product.isPromo && (
            <div className="absolute top-4 left-4 bg-orange-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-md flex items-center space-x-1">
              <Tag className="w-3.5 h-3.5" />
              <span>{product.discountPercent ? `-${product.discountPercent}% PROMO` : 'OFFRE SPÉCIALE'}</span>
            </div>
          )}

          <button
            onClick={() => onToggleWishlist(product.id)}
            className={`absolute bottom-4 left-4 p-2.5 rounded-full backdrop-blur-md transition-all shadow-xs ${
              isWishlisted ? 'bg-rose-50 text-rose-600' : 'bg-white/80 text-slate-700 hover:bg-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Details & Selectors */}
        <div className="md:w-1/2 p-6 overflow-y-auto space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                {product.category}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">{product.name}</h2>

              <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-800">{product.rating}</span>
                <span className="text-xs text-slate-400">({product.reviewsCount} avis)</span>
              </div>
            </div>

            <div className="flex items-baseline space-x-3">
              <span className="text-2xl font-black text-slate-900">{product.price.toFixed(2)} €</span>
              {product.originalPrice && (
                <span className="text-sm text-slate-400 line-through font-medium">
                  {product.originalPrice.toFixed(2)} €
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed border-t border-b border-slate-100 py-3">
              {product.description}
            </p>

            {/* Size choice */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 block">Taille :</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setModalSize(size)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        modalSize === size
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color choice */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 block">Couleur : {modalColor}</label>
                <div className="flex items-center space-x-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setModalColor(color.name)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        modalColor === color.name ? 'border-orange-600 scale-110 shadow-xs' : 'border-slate-200'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Add button */}
          <div className="pt-4 border-t border-slate-100">
            <button
              id="modal-add-to-cart-btn"
              onClick={handleAdd}
              className={`w-full py-3.5 px-6 rounded-2xl text-xs font-bold text-white flex items-center justify-center space-x-2 shadow-md transition-all ${
                addedNotice ? 'bg-emerald-600' : 'bg-orange-600 hover:bg-orange-700'
              }`}
            >
              {addedNotice ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Ajouté au panier mortuto-shop !</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Ajouter au Panier • {product.price.toFixed(2)} €</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
