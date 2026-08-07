import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductType, SaleItem, PaymentMethod } from '../../types';
import { PRODUCT_TYPES } from '../../data/productTypes';
import { formatCurrency } from '../../utils/formatters';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  User,
  CheckCircle,
  AlertCircle,
  Package,
  CreditCard,
  Banknote,
  Smartphone,
  ShieldAlert
} from 'lucide-react';

export const POSView: React.FC = () => {
  const {
    products,
    clients,
    currency,
    recordSale,
    setCurrentReceiptSale,
    setActiveTab
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Cart State
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [customClientName, setCustomClientName] = useState<string>('Client Comptant');
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [paidAmount, setPaidAmount] = useState<string>('');
  const [saleNotes, setSaleNotes] = useState<string>('');
  const [servedBy, setServedBy] = useState<string>('Caissier Principal');

  // Filtered products catalog
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchTerm));
    return matchesCat && matchesSearch;
  });

  // Cart Helpers
  const addToCart = (product: Product) => {
    if (product.stockQuantity <= 0) {
      alert(`Stock épuisé ! Le produit "${product.name}" n'est plus disponible en stock.`);
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.stockQuantity) {
          alert(`Quantité maximale atteint ! Seuls ${product.stockQuantity} ${product.unit}(s) sont disponibles en stock.`);
          return prevCart;
        }
        return prevCart.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total: (item.quantity + 1) * item.unitPrice
              }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            productId: product.id,
            productName: product.name,
            unit: product.unit,
            quantity: 1,
            unitPrice: product.sellingPrice,
            unitCost: product.buyingPrice,
            total: product.sellingPrice
          }
        ];
      }
    });
  };

  const updateCartQuantity = (productId: string, newQty: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (newQty > product.stockQuantity) {
      alert(`Stock insuffisant ! Le stock restant est de ${product.stockQuantity} ${product.unit}(s).`);
      return;
    }

    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: newQty,
              total: newQty * item.unitPrice
            }
          : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setPaidAmount('');
    setSaleNotes('');
  };

  // Computations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.total, 0);
  const cartTotal = Math.max(0, cartSubtotal - discount);
  const numericPaidAmount = paidAmount === '' ? cartTotal : parseFloat(paidAmount) || 0;
  const changeAmount = Math.max(0, numericPaidAmount - cartTotal);
  const creditAmount = Math.max(0, cartTotal - numericPaidAmount);

  // Handle Checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Veuillez ajouter au moins un produit dans le panier.');
      return;
    }

    let clientName = customClientName;
    if (selectedClientId) {
      const selectedClient = clients.find((c) => c.id === selectedClientId);
      if (selectedClient) clientName = selectedClient.name;
    }

    if (paymentMethod === 'credit' && !selectedClientId) {
      alert('Pour effectuer une vente à crédit, veuillez sélectionner un client enregistré.');
      return;
    }

    const createdSale = recordSale({
      clientId: selectedClientId || undefined,
      clientName,
      items: cart,
      discount,
      paymentMethod,
      paidAmount: numericPaidAmount,
      notes: saleNotes,
      servedBy
    });

    clearCart();
    setCurrentReceiptSale(createdSale);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full pb-12">
      {/* Left Column: Product Catalog & Category Selection (8 cols) */}
      <div className="lg:col-span-7 xl:col-span-8 space-y-4">
        {/* Header & Category Tabs */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 uppercase font-sans tracking-tight flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-slate-800" />
              <span>Caisse & Catalogue Produits</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              {filteredProducts.length} produit(s) disponible(s)
            </span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom, SKU (ex: OUT-PER), code-barres..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tous les Rayons
            </button>
            {PRODUCT_TYPES.map((pt) => (
              <button
                key={pt.id}
                onClick={() => setSelectedCategory(pt.id)}
                className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                  selectedCategory === pt.id
                    ? 'bg-slate-900 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium'
                }`}
              >
                {pt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 max-h-[calc(100vh-18rem)] overflow-y-auto pr-1">
          {filteredProducts.map((product) => {
            const isOut = product.stockQuantity <= 0;
            const isLow = product.stockQuantity > 0 && product.stockQuantity <= product.minStockLevel;

            return (
              <div
                key={product.id}
                onClick={() => !isOut && addToCart(product)}
                className={`bg-white rounded-xl p-4 border transition-all flex flex-col justify-between group cursor-pointer ${
                  isOut
                    ? 'opacity-60 bg-slate-50 border-slate-200 cursor-not-allowed'
                    : 'border-slate-200 hover:border-slate-400 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400">
                      {product.sku}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        isOut
                          ? 'bg-red-100 text-red-700'
                          : isLow
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {isOut
                        ? 'Épuisé'
                        : `${product.stockQuantity} ${product.unit}(s)`}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-xs line-clamp-2 group-hover:text-slate-900 transition-colors">
                    {product.name}
                  </h3>
                  {product.location && (
                    <p className="text-[10px] text-slate-400 mt-0.5">Emplacement: {product.location}</p>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-sm font-bold text-slate-900 font-mono">
                    {formatCurrency(product.sellingPrice, currency)}
                  </div>
                  <button
                    disabled={isOut}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isOut
                        ? 'bg-slate-100 text-slate-300'
                        : 'bg-slate-900 hover:bg-slate-800 text-white font-bold'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Active Cart & Checkout Terminal (4-5 cols) */}
      <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between space-y-4">
        {/* Cart Header */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-slate-900" />
              <h3 className="font-bold text-slate-900 text-sm uppercase font-sans">Panier de Vente</h3>
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-red-600 hover:text-red-800 font-bold flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Vider</span>
              </button>
            )}
          </div>

          {/* Cart Item List */}
          <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto my-2 pr-1">
            {cart.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs space-y-2">
                <Package className="w-10 h-10 mx-auto text-slate-300" />
                <p>Le panier est vide.</p>
                <p className="text-[11px]">Cliquez sur un produit pour l'ajouter à la caisse.</p>
              </div>
            ) : (
              cart.map((item) => {
                return (
                  <div key={item.productId} className="py-2.5 flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-xs truncate">{item.productName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {formatCurrency(item.unitPrice, currency)} / {item.unit}
                      </p>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center space-x-1.5 bg-slate-100 rounded-lg p-1">
                      <button
                        onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                        className="p-1 hover:bg-slate-200 rounded text-slate-700"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-mono font-bold px-1 text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                        className="p-1 hover:bg-slate-200 rounded text-slate-700"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <p className="font-bold text-slate-900 text-xs font-mono">
                        {formatCurrency(item.total, currency)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-[10px] text-red-500 hover:underline"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Client & Payment Options */}
        <div className="space-y-3 pt-3 border-t border-slate-200 text-xs">
          {/* Select Client */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center">
              <User className="w-3.5 h-3.5 mr-1 text-slate-700" />
              Client
            </label>
            <select
              value={selectedClientId}
              onChange={(e) => {
                setSelectedClientId(e.target.value);
                if (!e.target.value) setCustomClientName('Client Comptant');
              }}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="">Client Comptant (Passage)</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.outstandingBalance > 0 ? `(Dette: ${c.outstandingBalance} FCFA)` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Discount & Server */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-slate-600 mb-0.5">Remise ({currency})</label>
              <input
                type="number"
                min="0"
                value={discount || ''}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-0.5">Vendeur / Caissier</label>
              <input
                type="text"
                value={servedBy}
                onChange={(e) => setServedBy(e.target.value)}
                className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Mode de Paiement</label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'cash', label: 'Espèces', icon: <Banknote className="w-3.5 h-3.5" /> },
                { id: 'mobile_money', label: 'Mobile Money', icon: <Smartphone className="w-3.5 h-3.5" /> },
                { id: 'card', label: 'Carte Bq.', icon: <CreditCard className="w-3.5 h-3.5" /> },
                { id: 'credit', label: 'Crédit Client', icon: <ShieldAlert className="w-3.5 h-3.5" /> }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                  className={`flex items-center justify-center space-x-1.5 p-2 rounded-lg font-bold border text-xs transition-all ${
                    paymentMethod === m.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {m.icon}
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Paid Amount */}
          <div>
            <label className="block font-semibold text-slate-600 mb-0.5">Montant Versé ({currency})</label>
            <input
              type="number"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              placeholder={`Par défaut: ${cartTotal}`}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        {/* Totals Summary & Submit Button */}
        <div className="pt-3 border-t border-slate-200 space-y-3">
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Sous-total:</span>
              <span className="font-bold font-mono">{formatCurrency(cartSubtotal, currency)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Remise:</span>
                <span className="font-bold font-mono">-{formatCurrency(discount, currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
              <span>TOTAL À PAYER:</span>
              <span className="font-mono">{formatCurrency(cartTotal, currency)}</span>
            </div>

            {changeAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 p-1.5 rounded-lg font-mono">
                <span>Monnaie à rendre:</span>
                <span>{formatCurrency(changeAmount, currency)}</span>
              </div>
            )}

            {creditAmount > 0 && paymentMethod !== 'credit' && (
              <div className="flex justify-between text-orange-800 font-bold bg-orange-50 p-1.5 rounded-lg font-mono">
                <span>Reste en Crédit:</span>
                <span>{formatCurrency(creditAmount, currency)}</span>
              </div>
            )}
          </div>

          <button
            id="btn-validate-sale"
            disabled={cart.length === 0}
            onClick={handleCheckout}
            className={`w-full py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-sm ${
              cart.length === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Valider la Vente & Imprimer Reçu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
