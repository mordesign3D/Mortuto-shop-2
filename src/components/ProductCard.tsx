import React from 'react';
import { Product } from '../types';
import { Heart, Eye, Star, ShoppingBag, Tag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onSelectProduct,
  onAddToCart
}) => {
  return (
    <div
      id={`product-card-${product.id}`}
      className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col relative"
    >
      {/* Image container */}
      <div
        className="relative aspect-4/3 sm:aspect-square bg-slate-100 overflow-hidden cursor-pointer"
        onClick={() => onSelectProduct(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isPromo && (
            <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-orange-600 text-white rounded-md shadow-xs flex items-center space-x-1">
              <Tag className="w-3 h-3" />
              <span>
                {product.discountPercent ? `-${product.discountPercent}%` : 'PROMO'}
              </span>
            </span>
          )}
          {product.isNew && (
            <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-slate-900 text-white rounded-md shadow-xs">
              Nouveau
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow-xs'
              : 'bg-white/80 text-slate-600 hover:bg-white hover:text-rose-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Quick View Hover overlay */}
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white text-slate-900 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md flex items-center space-x-1.5">
            <Eye className="w-3.5 h-3.5 text-orange-600" />
            <span>Aperçu rapide</span>
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="font-bold text-orange-600 uppercase tracking-wide">{product.category}</span>
            <div className="flex items-center space-x-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-bold text-slate-700">{product.rating}</span>
              <span>({product.reviewsCount})</span>
            </div>
          </div>

          <h3
            onClick={() => onSelectProduct(product)}
            className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-orange-600 transition-colors cursor-pointer"
          >
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Add Button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-base font-black text-slate-900">
              {product.price.toFixed(2)} €
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through font-medium">
                {product.originalPrice.toFixed(2)} €
              </span>
            )}
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-2xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Ajouter</span>
          </button>
        </div>
      </div>
    </div>
  );
};
