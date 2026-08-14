import React, { useState } from 'react';
import { Product } from '../types';
import { Heart, Eye, Star, ShoppingBag, Tag, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { formatCFA } from '../utils/formatters';

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
  const imagesList = product.images && product.images.length > 0 ? product.images : [product.image];
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageLoaded(false);
    setActiveImageIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageLoaded(false);
    setActiveImageIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    onAddToCart(product);
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col relative animate-fade-in"
    >
      {/* Image container */}
      <div
        className="relative aspect-4/3 sm:aspect-square bg-slate-100 overflow-hidden cursor-pointer select-none"
        onClick={() => onSelectProduct(product)}
      >
        {/* Loading shimmer placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-orange-400 animate-spin opacity-50" />
          </div>
        )}

        <img
          src={imagesList[activeImageIndex] || product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isPromo && (
            <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-orange-600 text-white rounded-md shadow-xs flex items-center space-x-1 animate-fade-in">
              <Tag className="w-3 h-3" />
              <span>
                {product.discountPercent ? `-${product.discountPercent}%` : 'PROMO'}
              </span>
            </span>
          )}
          {product.isNew && (
            <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-slate-900 text-white rounded-md shadow-xs animate-fade-in">
              Nouveau
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 cursor-pointer ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow-xs'
              : 'bg-white/80 text-slate-600 hover:bg-white hover:text-rose-500'
          }`}
          title="Ajouter aux favoris"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Multiple Photos Navigation Arrows (if > 1 image) */}
        {imagesList.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
              title="Photo précédente"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
              title="Photo suivante"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Indicator Dots at bottom of image */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center items-center gap-1 z-10">
              {imagesList.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageLoaded(false);
                    setActiveImageIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'w-4 bg-orange-600 shadow-xs'
                      : 'w-1.5 bg-white/70 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Quick View Hover overlay */}
        <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/90 backdrop-blur-xs text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center space-x-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-orange-600" />
            <span>Voir détails</span>
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
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-black text-slate-900">
              {formatCFA(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[11px] text-slate-400 line-through font-medium">
                {formatCFA(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer ${
              isAdding
                ? 'bg-emerald-600 text-white scale-95'
                : 'bg-slate-900 hover:bg-orange-600 text-white hover:scale-105 active:scale-95'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isAdding ? 'Ajouté !' : 'Ajouter'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
