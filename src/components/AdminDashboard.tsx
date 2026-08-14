import React, { useState } from 'react';
import { Product, AdminUser, Order } from '../types';
import { MortutoLogo } from './MortutoLogo';
import {
  X,
  Plus,
  Edit,
  Trash2,
  Package,
  UserPlus,
  Users,
  Tag,
  Coins,
  Percent,
  Image as ImageIcon,
  Check,
  LogOut,
  ShoppingBag,
  Shield,
  Layers,
  Images,
  Upload
} from 'lucide-react';
import { formatCFA } from '../utils/formatters';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  currentAdmin: AdminUser;
  onLogout: () => void;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  admins: AdminUser[];
  onAddAdmin: (newAdmin: AdminUser) => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
}

const PRESET_PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800'
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  currentAdmin,
  onLogout,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  admins,
  onAddAdmin,
  orders,
  onUpdateOrderStatus
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'products' | 'admins' | 'orders'>('products');

  // Product Form State (Stored as Strings for zero typing lags and smooth input)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('Vêtements');
  const [customCategory, setCustomCategory] = useState('');
  const [productPrice, setProductPrice] = useState('25000');
  const [isPromo, setIsPromo] = useState(false);
  const [discountPercent, setDiscountPercent] = useState('20');
  const [originalPrice, setOriginalPrice] = useState('30000');
  
  // 3 to 5 images support
  const [productImages, setProductImages] = useState<string[]>([
    PRESET_PRODUCT_IMAGES[0],
    PRESET_PRODUCT_IMAGES[6],
    PRESET_PRODUCT_IMAGES[2]
  ]);

  const [productDescription, setProductDescription] = useState('Produit de haute qualité sélectionné par mortuto-shop.');
  const [productSizes, setProductSizes] = useState('S, M, L, XL');
  const [productColors, setProductColors] = useState('Noir, Blanc, Beige');
  const [successNotice, setSuccessNotice] = useState('');

  // Admin Creation Form State
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'Super Admin' | 'Gestionnaire'>('Gestionnaire');
  const [adminNotice, setAdminNotice] = useState('');

  const resetProductForm = () => {
    setEditingProduct(null);
    setProductName('');
    setProductCategory('Vêtements');
    setCustomCategory('');
    setProductPrice('25000');
    setIsPromo(false);
    setDiscountPercent('20');
    setOriginalPrice('30000');
    setProductImages([
      PRESET_PRODUCT_IMAGES[0],
      PRESET_PRODUCT_IMAGES[6],
      PRESET_PRODUCT_IMAGES[2]
    ]);
    setProductDescription('Produit de haute qualité sélectionné par mortuto-shop.');
    setProductSizes('S, M, L, XL');
    setProductColors('Noir, Blanc, Beige');
  };

  const handleEditClick = (p: Product) => {
    setEditingProduct(p);
    setProductName(p.name);
    setProductCategory(p.category);
    setCustomCategory('');
    setProductPrice(p.price !== undefined ? p.price.toString() : '25000');
    setIsPromo(!!p.isPromo);
    setDiscountPercent(p.discountPercent !== undefined ? p.discountPercent.toString() : '20');
    setOriginalPrice(
      p.originalPrice !== undefined
        ? p.originalPrice.toString()
        : p.price
        ? Math.round(p.price * 1.25).toString()
        : '30000'
    );
    
    // Set images list (from images array or single image)
    const existingImages = p.images && p.images.length > 0 ? [...p.images] : [p.image];
    setProductImages(existingImages);
    
    setProductDescription(p.description || '');
    setProductSizes(p.sizes && p.sizes.length > 0 ? p.sizes.join(', ') : 'S, M, L');
    setProductColors(p.colors && p.colors.length > 0 ? p.colors.map(c => c.name).join(', ') : 'Noir, Blanc');
    setActiveTab('products');
  };

  // Image manipulation handlers
  const handleUpdateImageSlot = (index: number, url: string) => {
    setProductImages(prev => {
      const copy = [...prev];
      copy[index] = url;
      return copy;
    });
  };

  const handleAddImageSlot = () => {
    if (productImages.length >= 5) return;
    const nextPreset = PRESET_PRODUCT_IMAGES[productImages.length % PRESET_PRODUCT_IMAGES.length];
    setProductImages(prev => [...prev, nextPreset]);
  };

  const handleRemoveImageSlot = (index: number) => {
    if (productImages.length <= 1) return;
    setProductImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileUploadForSlot = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          handleUpdateImageSlot(index, reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) return;

    const parsedPrice = parseFloat(productPrice.replace(/\s/g, '').replace(',', '.')) || 0;
    const finalCategory = productCategory === 'Autre' && customCategory.trim() ? customCategory.trim() : productCategory;
    const parsedDiscount = isPromo ? (parseFloat(discountPercent.replace(',', '.')) || undefined) : undefined;
    const parsedOriginalPrice = isPromo
      ? (parseFloat(originalPrice.replace(/\s/g, '').replace(',', '.')) || (parsedPrice > 0 ? Math.round(parsedPrice * 1.25) : undefined))
      : undefined;

    const sizesArr = productSizes.split(',').map(s => s.trim()).filter(Boolean);
    const colorsArr = productColors.split(',').map(c => ({ name: c.trim(), hex: '#1F2937' })).filter(c => c.name);

    const validImages = productImages.filter(img => img.trim().length > 0);
    const finalImages = validImages.length > 0 ? validImages : [PRESET_PRODUCT_IMAGES[0]];
    const primaryImage = finalImages[0];

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        name: productName.trim(),
        category: finalCategory,
        price: parsedPrice,
        isPromo,
        discountPercent: parsedDiscount,
        originalPrice: parsedOriginalPrice,
        image: primaryImage,
        images: finalImages,
        description: productDescription.trim(),
        sizes: sizesArr.length > 0 ? sizesArr : undefined,
        colors: colorsArr.length > 0 ? colorsArr : undefined
      };
      onUpdateProduct(updated);
      setSuccessNotice('Produit mis à jour avec succès !');
    } else {
      const newProd: Product = {
        id: `p-${Date.now()}`,
        name: productName.trim(),
        category: finalCategory,
        price: parsedPrice,
        isPromo,
        discountPercent: parsedDiscount,
        originalPrice: parsedOriginalPrice,
        rating: 5.0,
        reviewsCount: 1,
        image: primaryImage,
        images: finalImages,
        description: productDescription.trim(),
        inStock: true,
        isNew: true,
        tags: ['Nouveau', 'mortuto-shop'],
        sizes: sizesArr.length > 0 ? sizesArr : undefined,
        colors: colorsArr.length > 0 ? colorsArr : undefined
      };
      onAddProduct(newProd);
      setSuccessNotice('Nouveau produit avec photos ajouté à la boutique !');
    }

    setTimeout(() => setSuccessNotice(''), 3500);
    resetProductForm();
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminUsername.trim() || !newAdminPassword.trim()) return;

    const newAdmin: AdminUser = {
      id: `admin-${Date.now()}`,
      username: newAdminUsername.trim(),
      passwordHash: newAdminPassword.trim(),
      role: newAdminRole,
      createdAt: new Date().toLocaleDateString('fr-FR')
    };

    onAddAdmin(newAdmin);
    setAdminNotice(`Compte administrateur "${newAdmin.username}" créé avec succès !`);
    setNewAdminUsername('');
    setNewAdminPassword('');
    setTimeout(() => setAdminNotice(''), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl max-w-5xl w-full h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <MortutoLogo size="sm" showSubtitle={false} />
            <div className="border-l border-slate-700 pl-3">
              <h2 className="text-sm font-bold text-white flex items-center space-x-1.5">
                <Shield className="w-4 h-4 text-orange-500" />
                <span>Panneau Administrateur</span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Connecté en tant que <span className="font-bold text-orange-400">{currentAdmin.username}</span> ({currentAdmin.role})
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
              title="Retourner au catalogue de la boutique"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden sm:inline">Boutique</span>
            </button>
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800/40 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-100 p-2 flex items-center space-x-2 border-b border-slate-200 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'products'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Gestion des Produits ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('admins')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'admins'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Gestion des Admins ({admins.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Commandes Clients ({orders.length})</span>
          </button>
        </div>

        {/* Tab Contents Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Product Form Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    {editingProduct ? <Edit className="w-4 h-4 text-orange-600" /> : <Plus className="w-4 h-4 text-orange-600" />}
                    <span>{editingProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}</span>
                  </h3>
                  {editingProduct && (
                    <button
                      type="button"
                      onClick={resetProductForm}
                      className="text-xs text-slate-500 hover:text-slate-800 underline font-medium cursor-pointer"
                    >
                      Annuler l'édition
                    </button>
                  )}
                </div>

                {successNotice && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-2 animate-fade-in">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{successNotice}</span>
                  </div>
                )}

                <form onSubmit={handleSaveProduct} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Nom du produit */}
                    <div className="md:col-span-6">
                      <label className="text-xs font-bold text-slate-700 block mb-1">Nom du produit *</label>
                      <input
                        id="product-name-input"
                        type="text"
                        required
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="Ex: Veste Cuir Mortuto Premium"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                      />
                    </div>

                    {/* Prix en FCFA */}
                    <div className="md:col-span-3">
                      <label className="text-xs font-bold text-slate-700 block mb-1">Prix (en FCFA) *</label>
                      <div className="relative">
                        <Coins className="w-4 h-4 absolute left-3 top-2.5 text-orange-500" />
                        <input
                          id="product-price-input"
                          type="text"
                          required
                          value={productPrice}
                          onChange={(e) => setProductPrice(e.target.value)}
                          placeholder="25000"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden font-bold"
                        />
                      </div>
                    </div>

                    {/* Classement Catégorie */}
                    <div className="md:col-span-3">
                      <label className="text-xs font-bold text-slate-700 block mb-1">Classement Catégorie *</label>
                      <select
                        id="product-category-select"
                        value={productCategory}
                        onChange={(e) => setProductCategory(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden font-semibold"
                      >
                        <option value="Vêtements">Vêtements</option>
                        <option value="Chaussures">Chaussures</option>
                        <option value="Accessoires">Accessoires</option>
                        <option value="Électronique">Électronique</option>
                        <option value="Maison">Maison</option>
                        <option value="Autre">Autre (Saisir ci-dessous)</option>
                      </select>
                    </div>

                    {productCategory === 'Autre' && (
                      <div className="md:col-span-12">
                        <label className="text-xs font-bold text-slate-700 block mb-1">Catégorie personnalisée</label>
                        <input
                          id="product-custom-category-input"
                          type="text"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          placeholder="Nom de la nouvelle catégorie"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                        />
                      </div>
                    )}
                  </div>

                  {/* Section Baisse de Prix / Promotion */}
                  <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-2xl space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        id="promo-checkbox"
                        type="checkbox"
                        checked={isPromo}
                        onChange={(e) => setIsPromo(e.target.checked)}
                        className="w-4 h-4 text-orange-600 focus:ring-orange-500 rounded border-slate-300 cursor-pointer"
                      />
                      <label htmlFor="promo-checkbox" className="text-xs font-bold text-orange-950 flex items-center space-x-1 cursor-pointer">
                        <Tag className="w-4 h-4 text-orange-600" />
                        <span>Activer une Baisse de Prix / Promo (%) sur ce produit</span>
                      </label>
                    </div>

                    {isPromo && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Réduction (%)
                          </label>
                          <div className="relative">
                            <Percent className="w-4 h-4 absolute left-3 top-2.5 text-orange-500" />
                            <input
                              id="product-discount-input"
                              type="text"
                              value={discountPercent}
                              onChange={(e) => setDiscountPercent(e.target.value)}
                              placeholder="20"
                              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-orange-300 rounded-xl font-bold text-orange-700 focus:outline-hidden"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Prix d'origine / barré avant remise (FCFA)
                          </label>
                          <input
                            id="product-original-price-input"
                            type="text"
                            value={originalPrice}
                            onChange={(e) => setOriginalPrice(e.target.value)}
                            placeholder="30000"
                            className="w-full px-3 py-2 text-xs bg-white border border-orange-300 rounded-xl font-semibold text-slate-500 focus:outline-hidden"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* MULTI-PHOTOS DU PRODUIT (3 À 5 PHOTOS) */}
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center space-x-2">
                        <Images className="w-4 h-4 text-orange-600" />
                        <label className="text-xs font-bold text-slate-900">
                          Photos du produit ({productImages.length}/5) - Recommandé 3 à 5 photos
                        </label>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        La 1ère photo sera l'image principale de présentation
                      </span>
                    </div>

                    {/* Image slots */}
                    <div className="space-y-3">
                      {productImages.map((imgUrl, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200"
                        >
                          <div className="flex items-center space-x-2 shrink-0">
                            <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-[11px] flex items-center justify-center">
                              {index + 1}
                            </span>
                            {/* Preview thumbnail */}
                            <div className="w-14 h-14 rounded-xl bg-white border border-slate-300 overflow-hidden shrink-0 shadow-xs">
                              <img src={imgUrl} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                          </div>

                          <div className="flex-1 w-full space-y-1.5">
                            <input
                              type="text"
                              value={imgUrl}
                              onChange={(e) => handleUpdateImageSlot(index, e.target.value)}
                              placeholder={`URL Photo ${index + 1} (https://...)`}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                            />
                            <div className="flex items-center space-x-2">
                              <label className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 rounded-lg text-[10px] font-bold text-slate-700 cursor-pointer flex items-center space-x-1 transition-colors">
                                <Upload className="w-3 h-3" />
                                <span>Charger une photo</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleFileUploadForSlot(index, e)}
                                />
                              </label>
                            </div>
                          </div>

                          {/* Remove button */}
                          {productImages.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveImageSlot(index)}
                              className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer shrink-0"
                              title="Supprimer cette photo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Add Image Slot Button */}
                    {productImages.length < 5 && (
                      <button
                        type="button"
                        onClick={handleAddImageSlot}
                        className="w-full py-2.5 border-2 border-dashed border-orange-300 hover:border-orange-500 bg-orange-50/50 hover:bg-orange-50 text-orange-700 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Ajouter une autre photo ({productImages.length + 1}/5)</span>
                      </button>
                    )}

                    {/* Quick Preset Images Selector */}
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[11px] text-slate-500 font-medium block mb-1">
                        Ou choisissez rapidement des photos modèles :
                      </span>
                      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
                        {PRESET_PRODUCT_IMAGES.map((img, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              if (productImages.length < 5) {
                                setProductImages(prev => [...prev, img]);
                              } else {
                                handleUpdateImageSlot(productImages.length - 1, img);
                              }
                            }}
                            className="w-11 h-11 rounded-lg overflow-hidden border border-slate-200 hover:border-orange-500 shrink-0 cursor-pointer transition-transform hover:scale-105"
                            title="Ajouter comme photo"
                          >
                            <img src={img} alt="Preset" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Description & Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Tailles disponibles (séparées par des virgules)</label>
                      <input
                        id="product-sizes-input"
                        type="text"
                        value={productSizes}
                        onChange={(e) => setProductSizes(e.target.value)}
                        placeholder="S, M, L, XL"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Couleurs (séparées par des virgules)</label>
                      <input
                        id="product-colors-input"
                        type="text"
                        value={productColors}
                        onChange={(e) => setProductColors(e.target.value)}
                        placeholder="Noir, Blanc, Beige"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block mb-1">Description du produit</label>
                      <textarea
                        id="product-description-input"
                        rows={2}
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        placeholder="Présentation détaillée..."
                        className="w-full p-3 text-xs bg-white border border-slate-300 rounded-xl resize-none focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    id="save-product-btn"
                    type="submit"
                    className="w-full py-3 bg-orange-600 hover:bg-orange-700 active:scale-[0.99] text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{editingProduct ? 'Mettre à jour le produit' : 'Enregistrer et publier sur la boutique'}</span>
                  </button>
                </form>
              </div>

              {/* Products List Table */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-orange-600" />
                  <span>Articles Actuels dans la Boutique mortuto-shop ({products.length})</span>
                </h3>

                <div className="divide-y divide-slate-100 overflow-x-auto">
                  {products.map((p) => (
                    <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          {p.images && p.images.length > 1 && (
                            <span className="absolute bottom-0 right-0 bg-black/75 text-white text-[9px] font-bold px-1 rounded-tl-md">
                              {p.images.length}📸
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-xs font-bold text-slate-900 truncate">{p.name}</h4>
                            {p.isPromo && (
                              <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-700 font-extrabold text-[10px]">
                                -{p.discountPercent}% Promo
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium">Catégorie : {p.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <span className="text-xs font-black text-slate-900 block">{formatCFA(p.price)}</span>
                          {p.originalPrice && (
                            <span className="text-[10px] text-slate-400 line-through block">{formatCFA(p.originalPrice)}</span>
                          )}
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => handleEditClick(p)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 transition-colors cursor-pointer"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteProduct(p.id)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 transition-colors cursor-pointer"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADMIN MANAGEMENT */}
          {activeTab === 'admins' && (
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <UserPlus className="w-4 h-4 text-orange-600" />
                  <span>Ajouter un Nouvel Administrateur</span>
                </h3>

                {adminNotice && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-2 animate-fade-in">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{adminNotice}</span>
                  </div>
                )}

                <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-4">
                    <label className="text-xs font-bold text-slate-700 block mb-1">Nom d'utilisateur *</label>
                    <input
                      id="new-admin-username-input"
                      type="text"
                      required
                      value={newAdminUsername}
                      onChange={(e) => setNewAdminUsername(e.target.value)}
                      placeholder="Ex: admin_mame"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="text-xs font-bold text-slate-700 block mb-1">Mot de passe *</label>
                    <input
                      id="new-admin-password-input"
                      type="password"
                      required
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="text-xs font-bold text-slate-700 block mb-1">Rôle</label>
                    <select
                      id="new-admin-role-select"
                      value={newAdminRole}
                      onChange={(e) => setNewAdminRole(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-semibold focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                    >
                      <option value="Gestionnaire">Gestionnaire Boutique</option>
                      <option value="Super Admin">Super Admin</option>
                    </select>
                  </div>

                  <div className="sm:col-span-12 pt-2">
                    <button
                      id="create-admin-btn"
                      type="submit"
                      className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 active:scale-[0.99] text-white font-bold rounded-xl text-xs transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Créer l'administrateur</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Admins List Table */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <Users className="w-4 h-4 text-orange-600" />
                  <span>Administrateurs Enregistrés ({admins.length})</span>
                </h3>

                <div className="divide-y divide-slate-100">
                  {admins.map((adm) => (
                    <div key={adm.id} className="py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center uppercase">
                          {adm.username.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{adm.username}</span>
                          <span className="text-slate-400 text-[10px]">Créé le {adm.createdAt}</span>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {adm.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Package className="w-4 h-4 text-orange-600" />
                <span>Commandes Reçues ({orders.length})</span>
              </h3>

              {orders.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 space-y-2">
                  <Package className="w-8 h-8 mx-auto" />
                  <p className="text-xs font-bold">Aucune commande enregistrée pour l'instant.</p>
                </div>
              ) : (
                orders.map((o) => (
                  <div key={o.id} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
                      <div>
                        <span className="font-bold text-slate-900">{o.id}</span>
                        <span className="text-slate-400 ml-2">• {o.date}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-slate-500 font-medium">Statut :</span>
                        <select
                          value={o.status}
                          onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as any)}
                          className="px-2 py-1 text-xs font-bold bg-orange-50 border border-orange-200 rounded-lg text-orange-800"
                        >
                          <option value="En préparation">En préparation</option>
                          <option value="Expédié">Expédié</option>
                          <option value="Livré">Livré</option>
                        </select>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600">
                      <p><span className="font-bold text-slate-800">Client :</span> {o.shippingAddress.fullName} ({o.shippingAddress.email})</p>
                      <p><span className="font-bold text-slate-800">Adresse :</span> {o.shippingAddress.address}, {o.shippingAddress.postalCode} {o.shippingAddress.city}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                      <span className="text-slate-500">{o.items.length} article(s)</span>
                      <span className="font-black text-slate-900 text-sm">{formatCFA(o.totalAmount)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
