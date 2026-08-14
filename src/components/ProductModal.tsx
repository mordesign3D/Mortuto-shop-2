import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { X, Heart, Star, ShoppingBag, Check, Tag, ChevronLeft, ChevronRight, Images, Loader2 } from 'lucide-react';
import { formatCFA } from '../utils/formatters';

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

  const imagesList = product.images && product.images.length > 0 ? product.images : [product.image];
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const [modalSize, setModalSize] = useState<string | undefined>(
    product.sizes ? product.sizes[0] : undefined
  );
  const [modalColor, setModalColor] = useState<string | undefined>(
    product.colors ? product.colors[0].name : undefined
  );
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    setActiveImageIndex(0);
    setIsImageLoading(true);
    setModalSize(product.sizes ? product.sizes[0] : undefined);
    setModalColor(product.colors ? product.colors[0].name : undefined);
  }, [product]);

  const handlePrevImage = () => {
    setIsImageLoading(true);
    setActiveImageIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setIsImageLoading(true);
    setActiveImageIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
  };

  const handleSelectThumbnail = (idx: number) => {
    if (idx !== activeImageIndex) {
      setIsImageLoading(true);
      setActiveImageIndex(idx);
    }
  };

  const handleAdd = () => {
    onAddToCart(product, modalSize, modalColor);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  // Dynamic label based on product category
  const getVariantLabel = (category: string) => {
    switch (category) {
      case 'Électronique':
        return 'Capacité / Modèle :';
      case 'Chaussures':
        return 'Pointure :';
      case 'Vêtements':
        return 'Taille disponible :';
      case 'Maison':
        return 'Format / Dimension :';
      default:
        return 'Option disponible :';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 relative flex flex-col md:flex-row max-h-[92vh]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-slate-100/90 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          title="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery / Images Section (Left side on desktop) */}
        <div className="md:w-1/2 bg-slate-100 flex flex-col justify-between p-4 relative min-h-[300px] sm:min-h-[380px]">
          {/* Main Selected Image Container */}
          <div className="relative w-full flex-1 rounded-2xl overflow-hidden bg-slate-200/50 shadow-inner flex items-center justify-center">
            {/* Shimmer / Skeleton loader while image is loading */}
            {isImageLoading && (
              <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center z-5">
                <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
              </div>
            )}

            <img
              src={imagesList[activeImageIndex] || product.image}
              alt={`${product.name} - Photo ${activeImageIndex + 1}`}
              referrerPolicy="no-referrer"
              onLoad={() => setIsImageLoading(false)}
              className={`w-full h-full object-cover max-h-[380px] transition-all duration-300 ${
                isImageLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            />

            {/* Badges Overlay */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              {product.isPromo && (
                <div className="bg-orange-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-md flex items-center space-x-1">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{product.discountPercent ? `-${product.discountPercent}% PROMO` : 'OFFRE SPÉCIALE'}</span>
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={() => onToggleWishlist(product.id)}
              className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all shadow-xs z-10 cursor-pointer ${
                isWishlisted ? 'bg-rose-50 text-rose-600' : 'bg-white/80 text-slate-700 hover:bg-white'
              }`}
              title="Favoris"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            {/* Multi-Photo Navigation Arrows */}
            {imagesList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors z-10 cursor-pointer shadow-md"
                  title="Photo précédente"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors z-10 cursor-pointer shadow-md"
                  title="Photo suivante"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Photo index count badge */}
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center space-x-1">
                  <Images className="w-3.5 h-3.5 text-orange-400" />
                  <span>
                    {activeImageIndex + 1} / {imagesList.length} photos
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Horizontal Scrollable Thumbnails Bar */}
          {imagesList.length > 1 && (
            <div className="mt-3 pt-1">
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 px-0.5 no-scrollbar scroll-smooth">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectThumbnail(idx)}
                    className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer shadow-xs ${
                      activeImageIndex === idx
                        ? 'border-orange-600 scale-105 ring-2 ring-orange-500/20'
                        : 'border-white hover:border-slate-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Miniature ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 text-center mt-1">
                👉 Faites défiler horizontalement pour voir toutes les photos
              </p>
            </div>
          )}
        </div>

        {/* Details & Selectors (Right side on desktop) */}
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
                <span className="text-xs text-slate-400">({product.reviewsCount} avis clients)</span>
              </div>
            </div>

            {/* Price Display in FCFA */}
            <div className="flex items-baseline space-x-3">
              <span className="text-2xl font-black text-slate-900">
                {formatCFA(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-slate-400 line-through font-medium">
                  {formatCFA(product.originalPrice)}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed border-t border-b border-slate-100 py-3">
              {product.description}
            </p>

            {/* Dynamic Variant choice (Sizes / Capacities / Shoe sizes) */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 block">
                  {getVariantLabel(product.category)}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setModalSize(size)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        modalSize === size
                          ? 'bg-slate-900 text-white shadow-xs scale-105'
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
                      type="button"
                      onClick={() => setModalColor(color.name)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
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
              type="button"
              onClick={handleAdd}
              className={`w-full py-3.5 px-6 rounded-2xl text-xs font-bold text-white flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer ${
                addedNotice ? 'bg-emerald-600' : 'bg-orange-600 hover:bg-orange-700 active:scale-[0.99]'
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
                  <span>Ajouter au Panier • {formatCFA(product.price)}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
