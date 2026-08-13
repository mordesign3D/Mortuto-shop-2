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
  DollarSign,
  Percent,
  Image as ImageIcon,
  Check,
  LogOut,
  Sparkles,
  ShoppingBag,
  Shield,
  Layers,
  Clock,
  ArrowDownRight
} from 'lucide-react';

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
  'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800'
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

  // Product Form State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('Vêtements');
  const [customCategory, setCustomCategory] = useState('');
  const [productPrice, setProductPrice] = useState<number | ''>(99.90);
  const [isPromo, setIsPromo] = useState(false);
  const [discountPercent, setDiscountPercent] = useState<number | ''>(20);
  const [originalPrice, setOriginalPrice] = useState<number | ''>(124.88);
  const [productImage, setProductImage] = useState(PRESET_PRODUCT_IMAGES[0]);
  const [productDescription, setProductDescription] = useState('Produit de haute qualité sélectionné par mortuto-shop.');
  const [productSizes, setProductSizes] = useState('S, M, L, XL');
  const [productColors, setProductColors] = useState('Noir, Blanc, Beige');
  const [successNotice, setSuccessNotice] = useState('');

  // Admin Creation Form State
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'Super Admin' | 'Gestionnaire'>('Gestionnaire');
  const [adminNotice, setAdminNotice] = useState('');

  // Calculate prices based on discount %
  const handleDiscountPercentChange = (val: number | '') => {
    setDiscountPercent(val);
    if (val !== '' && productPrice !== '') {
      const orig = Number((Number(productPrice) / (1 - Number(val) / 100)).toFixed(2));
      setOriginalPrice(orig);
    }
  };

  const handlePriceChange = (val: number | '') => {
    setProductPrice(val);
    if (val !== '' && isPromo && discountPercent !== '') {
      const orig = Number((Number(val) / (1 - Number(discountPercent) / 100)).toFixed(2));
      setOriginalPrice(orig);
    }
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProductName('');
    setProductCategory('Vêtements');
    setCustomCategory('');
    setProductPrice(99.90);
    setIsPromo(false);
    setDiscountPercent(20);
    setOriginalPrice(124.88);
    setProductImage(PRESET_PRODUCT_IMAGES[0]);
    setProductDescription('Produit de haute qualité sélectionné par mortuto-shop.');
    setProductSizes('S, M, L, XL');
    setProductColors('Noir, Blanc, Beige');
  };

  const handleEditClick = (p: Product) => {
    setEditingProduct(p);
    setProductName(p.name);
    setProductCategory(p.category);
    setProductPrice(p.price);
    setIsPromo(!!p.isPromo);
    setDiscountPercent(p.discountPercent || 20);
    setOriginalPrice(p.originalPrice || Number((p.price * 1.25).toFixed(2)));
    setProductImage(p.image);
    setProductDescription(p.description);
    setProductSizes(p.sizes ? p.sizes.join(', ') : 'S, M, L');
    setProductColors(p.colors ? p.colors.map(c => c.name).join(', ') : 'Noir, Blanc');
    setActiveTab('products');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || productPrice === '') return;

    const finalCategory = productCategory === 'Autre' && customCategory.trim() ? customCategory.trim() : productCategory;
    const finalPrice = Number(productPrice);
    const finalDiscount = isPromo && discountPercent !== '' ? Number(discountPercent) : undefined;
    const finalOriginalPrice = isPromo ? (originalPrice !== '' ? Number(originalPrice) : Number((finalPrice * 1.25).toFixed(2))) : undefined;

    const sizesArr = productSizes.split(',').map(s => s.trim()).filter(Boolean);
    const colorsArr = productColors.split(',').map(c => ({ name: c.trim(), hex: '#1F2937' })).filter(c => c.name);

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        name: productName.trim(),
        category: finalCategory,
        price: finalPrice,
        isPromo,
        discountPercent: finalDiscount,
        originalPrice: finalOriginalPrice,
        image: productImage,
        description: productDescription,
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
        price: finalPrice,
        isPromo,
        discountPercent: finalDiscount,
        originalPrice: finalOriginalPrice,
        rating: 5.0,
        reviewsCount: 1,
        image: productImage,
        description: productDescription,
        inStock: true,
        isNew: true,
        tags: ['Nouveau', 'mortuto-shop'],
        sizes: sizesArr.length > 0 ? sizesArr : undefined,
        colors: colorsArr.length > 0 ? colorsArr : undefined
      };
      onAddProduct(newProd);
      setSuccessNotice('Nouveau produit ajouté à la boutique !');
    }

    setTimeout(() => setSuccessNotice(''), 3000);
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
    setAdminNotice(`Compte administrateur "${newAdmin.username}" créé !`);
    setNewAdminUsername('');
    setNewAdminPassword('');
    setTimeout(() => setAdminNotice(''), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setProductImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
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
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-100 p-2 flex items-center space-x-2 border-b border-slate-200 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Gestion des Produits ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('admins')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === 'admins'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Gestion des Admins ({admins.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
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
                      onClick={resetProductForm}
                      className="text-xs text-slate-500 hover:text-slate-800 underline font-medium"
                    >
                      Annuler l'édition
                    </button>
                  )}
                </div>

                {successNotice && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-2">
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
                        type="text"
                        required
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="Ex: Veste Cuir Mortuto Premium"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    {/* Prix */}
                    <div className="md:col-span-3">
                      <label className="text-xs font-bold text-slate-700 block mb-1">Prix (€) *</label>
                      <div className="relative">
                        <DollarSign className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={productPrice}
                          onChange={(e) => handlePriceChange(e.target.value === '' ? '' : parseFloat(e.target.value))}
                          placeholder="99.90"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 font-bold"
                        />
                      </div>
                    </div>

                    {/* Classement Catégorie */}
                    <div className="md:col-span-3">
                      <label className="text-xs font-bold text-slate-700 block mb-1">Classement Catégorie *</label>
                      <select
                        value={productCategory}
                        onChange={(e) => setProductCategory(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 font-semibold"
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
                          type="text"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          placeholder="Nom de la nouvelle catégorie"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500"
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
                        className="w-4 h-4 text-orange-600 focus:ring-orange-500 rounded border-slate-300"
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
                              type="number"
                              min="1"
                              max="90"
                              value={discountPercent}
                              onChange={(e) => handleDiscountPercentChange(e.target.value === '' ? '' : parseInt(e.target.value))}
                              placeholder="20"
                              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-orange-300 rounded-xl font-bold text-orange-700"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Prix d'origine / barré avant remise (€)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={originalPrice}
                            onChange={(e) => setOriginalPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                            placeholder="124.88"
                            className="w-full px-3 py-2 text-xs bg-white border border-orange-300 rounded-xl font-semibold text-slate-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Photo du produit */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">Photo du produit *</label>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* Image Preview Box */}
                      <div className="w-20 h-20 rounded-2xl bg-white border border-slate-300 overflow-hidden shrink-0 shadow-xs">
                        <img src={productImage} alt="Aperçu" className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 w-full space-y-2">
                        <input
                          type="text"
                          required
                          value={productImage}
                          onChange={(e) => setProductImage(e.target.value)}
                          placeholder="Collez l'URL de l'image (https://...)"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                        />

                        <div className="flex items-center space-x-2">
                          <label className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-xl text-[11px] font-bold text-slate-700 cursor-pointer flex items-center space-x-1">
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>Charger un fichier image</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Quick Preset Selector */}
                    <div className="pt-1">
                      <span className="text-[11px] text-slate-500 font-medium block mb-1">Exemples d'images rapides :</span>
                      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                        {PRESET_PRODUCT_IMAGES.map((img, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setProductImage(img)}
                            className={`w-10 h-10 rounded-lg overflow-hidden border-2 shrink-0 ${
                              productImage === img ? 'border-orange-600 scale-105' : 'border-slate-200'
                            }`}
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
                        type="text"
                        value={productSizes}
                        onChange={(e) => setProductSizes(e.target.value)}
                        placeholder="S, M, L, XL"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Couleurs (séparées par des virgules)</label>
                      <input
                        type="text"
                        value={productColors}
                        onChange={(e) => setProductColors(e.target.value)}
                        placeholder="Noir, Blanc, Beige"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block mb-1">Description du produit</label>
                      <textarea
                        rows={2}
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        placeholder="Présentation détaillée..."
                        className="w-full p-3 text-xs bg-white border border-slate-300 rounded-xl resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    id="save-product-btn"
                    type="submit"
                    className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md flex items-center justify-center space-x-2"
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
                        <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" />
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
                          <span className="text-xs font-black text-slate-900 block">{p.price.toFixed(2)} €</span>
                          {p.originalPrice && (
                            <span className="text-[10px] text-slate-400 line-through block">{p.originalPrice.toFixed(2)} €</span>
                          )}
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleEditClick(p)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700 transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteProduct(p.id)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 transition-colors"
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
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{adminNotice}</span>
                  </div>
                )}

                <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-4">
                    <label className="text-xs font-bold text-slate-700 block mb-1">Nom d'utilisateur *</label>
                    <input
                      type="text"
                      required
                      value={newAdminUsername}
                      onChange={(e) => setNewAdminUsername(e.target.value)}
                      placeholder="Ex: admin_mame"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="text-xs font-bold text-slate-700 block mb-1">Mot de passe *</label>
                    <input
                      type="password"
                      required
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="text-xs font-bold text-slate-700 block mb-1">Rôle</label>
                    <select
                      value={newAdminRole}
                      onChange={(e) => setNewAdminRole(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-semibold"
                    >
                      <option value="Gestionnaire">Gestionnaire Boutique</option>
                      <option value="Super Admin">Super Admin</option>
                    </select>
                  </div>

                  <div className="sm:col-span-12 pt-2">
                    <button
                      id="create-admin-btn"
                      type="submit"
                      className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center space-x-2"
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
                      <span className="font-black text-slate-900 text-sm">{o.totalAmount.toFixed(2)} €</span>
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
