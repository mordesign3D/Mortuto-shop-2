import React, { useState, useEffect } from 'react';
import { Product, CartItem, Order, AdminUser } from './types';
import { INITIAL_PRODUCTS, DEFAULT_ADMINS } from './data/initialData';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrdersModal } from './components/OrdersModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { MortutoLogo } from './components/MortutoLogo';
import { Sparkles, Award, Truck, Shield, RotateCcw, Tag, ShieldCheck, MessageCircle } from 'lucide-react';
import { WHATSAPP_BUSINESS_URL } from './utils/whatsapp';

export default function App() {
  // Products State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('mortuto_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Admins State
  const [admins, setAdmins] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem('mortuto_admins');
    return saved ? JSON.parse(saved) : DEFAULT_ADMINS;
  });

  // Current logged in admin state
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('mortuto_current_admin');
    return saved ? JSON.parse(saved) : null;
  });

  // Filtering & Search state
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart & Wishlist & Orders State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('mortuto_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('mortuto_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('mortuto_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // Modals & Drawers state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('mortuto_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('mortuto_admins', JSON.stringify(admins));
  }, [admins]);

  useEffect(() => {
    if (currentAdmin) {
      localStorage.setItem('mortuto_current_admin', JSON.stringify(currentAdmin));
    } else {
      localStorage.removeItem('mortuto_current_admin');
    }
  }, [currentAdmin]);

  useEffect(() => {
    localStorage.setItem('mortuto_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('mortuto_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('mortuto_orders', JSON.stringify(orders));
  }, [orders]);

  // Derived categories from products
  const categoriesList = ['Tous', 'Promotions', ...Array.from(new Set(products.map(p => p.category)))];

  // Filtered Products
  const filteredProducts = products.filter(product => {
    const matchesCategory =
      selectedCategory === 'Tous'
        ? true
        : selectedCategory === 'Promotions'
        ? product.isPromo === true
        : product.category === selectedCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Handlers
  const handleToggleWishlist = (id: string) => {
    setWishlist(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
  };

  const handleAddToCart = (product: Product, size?: string, color?: string) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(
        i =>
          i.product.id === product.id &&
          i.selectedSize === size &&
          i.selectedColor === color
      );

      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += 1;
        return copy;
      }

      return [...prev, { product, quantity: 1, selectedSize: size, selectedColor: color }];
    });
  };

  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      setCartItems(prev => prev.filter((_, i) => i !== index));
    } else {
      setCartItems(prev => {
        const copy = [...prev];
        copy[index].quantity = newQty;
        return copy;
      });
    }
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  // Product CRUD by Admin
  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p)));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  // Admin CRUD
  const handleAddAdmin = (newAdmin: AdminUser) => {
    setAdmins(prev => [...prev, newAdmin]);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o)));
  };

  const handleAdminSuccessLogin = (admin: AdminUser) => {
    setCurrentAdmin(admin);
    setIsAdminLoginOpen(false);
    setIsAdminDashboardOpen(true);
  };

  const handleAdminClick = () => {
    if (currentAdmin) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased">
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={categoriesList}
        wishlistCount={wishlist.length}
        ordersCount={orders.length}
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAdminLogin={handleAdminClick}
        currentAdmin={currentAdmin}
      />

      {/* Hero Showcase Banner */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-orange-400" />
                mortuto-shop • Vente en Ligne
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                <Tag className="w-3.5 h-3.5 mr-1.5" />
                Grandes Promotions jusqu'à -50%
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Bienvenue sur <span className="text-orange-500">mortuto-shop</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Découvrez notre sélection exclusive de vêtements, accessoires de luxe, chaussures tendance et électronique de pointe au meilleur prix avec livraison rapide.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center">
              <Award className="w-6 h-6 text-orange-400 mx-auto mb-1" />
              <span className="text-xs font-bold block">100% Authentique</span>
              <span className="text-[10px] text-slate-300">Garantie qualité</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center">
              <Truck className="w-6 h-6 text-orange-400 mx-auto mb-1" />
              <span className="text-xs font-bold block">Expédition Express</span>
              <span className="text-[10px] text-slate-300">Livraison Colissimo</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center space-x-2">
              <span>{selectedCategory === 'Tous' ? 'Tous nos Produits' : selectedCategory}</span>
              {selectedCategory === 'Promotions' && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 font-extrabold">
                  Baisse de Prix & Promos
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {filteredProducts.length} article{filteredProducts.length > 1 ? 's' : ''} disponible{filteredProducts.length > 1 ? 's' : ''}
            </p>
          </div>

          <button
            onClick={handleAdminClick}
            className="text-xs text-orange-600 font-bold hover:underline flex items-center space-x-1"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{currentAdmin ? 'Ouvrir Espace Admin' : 'Connexion Admin (mortuto4)'}</span>
          </button>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
            <p className="text-sm font-bold text-slate-800">Aucun produit ne correspond à vos critères.</p>
            <p className="text-xs text-slate-500">Essayez de réinitialiser la recherche ou d'explorer une autre catégorie.</p>
            <button
              onClick={() => {
                setSelectedCategory('Tous');
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition-colors"
            >
              Voir tous les produits mortuto-shop
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={handleToggleWishlist}
                onSelectProduct={setSelectedProduct}
                onAddToCart={(p) => handleAddToCart(p, p.sizes ? p.sizes[0] : undefined, p.colors ? p.colors[0].name : undefined)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-center space-x-3 justify-center sm:justify-start">
            <Shield className="w-8 h-8 text-orange-600 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">Paiement 100% Sécurisé</h4>
              <p className="text-[11px] text-slate-500">Cryptage SSL 256 bits & 3D Secure</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 justify-center sm:justify-start">
            <Truck className="w-8 h-8 text-orange-600 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">Livraison Offerte dès 80€</h4>
              <p className="text-[11px] text-slate-500">Envoi rapide avec suivi Colissimo</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 justify-center sm:justify-start">
            <RotateCcw className="w-8 h-8 text-orange-600 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">Retours Faciles</h4>
              <p className="text-[11px] text-slate-500">30 jours pour changer d'avis sans frais</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <MortutoLogo size="sm" />
          <p className="text-[11px] text-slate-400">
            © 2026 mortuto-shop - Vente en ligne. Tous droits réservés.
          </p>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onCompleteOrder={(order) => {
          setOrders(prev => [order, ...prev]);
          setCartItems([]);
        }}
      />

      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        admins={admins}
        onSuccessLogin={handleAdminSuccessLogin}
      />

      {currentAdmin && (
        <AdminDashboard
          isOpen={isAdminDashboardOpen}
          onClose={() => setIsAdminDashboardOpen(false)}
          currentAdmin={currentAdmin}
          onLogout={() => {
            setCurrentAdmin(null);
            setIsAdminDashboardOpen(false);
          }}
          products={products}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          admins={admins}
          onAddAdmin={handleAddAdmin}
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
        />
      )}

      {/* Floating WhatsApp Business Button */}
      <a
        href={WHATSAPP_BUSINESS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-2xl flex items-center space-x-2 transition-all hover:scale-105 border-2 border-white group"
        title="Contactez mortuto-shop sur WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
        <span className="hidden sm:inline text-xs font-black pr-1">WhatsApp Business</span>
      </a>
    </div>
  );
}
