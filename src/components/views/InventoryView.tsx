import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductType, MovementType } from '../../types';
import { PRODUCT_TYPES, getProductTypeInfo } from '../../data/productTypes';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import {
  Boxes,
  Plus,
  Search,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Edit,
  Trash2,
  Package,
  History,
  X,
  Check
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const {
    products,
    stockMovements,
    currency,
    addProduct,
    updateProduct,
    deleteProduct,
    adjustStock
  } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'movements'>('catalog');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'low' | 'out'>('all');

  // Modal States
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustProductId, setAdjustProductId] = useState<string>('');
  const [adjustQty, setAdjustQty] = useState<number>(0);
  const [adjustType, setAdjustType] = useState<MovementType>('adjustment_add');
  const [adjustNotes, setAdjustNotes] = useState<string>('');

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    category: 'outillage' as ProductType,
    buyingPrice: 0,
    sellingPrice: 0,
    stockQuantity: 0,
    minStockLevel: 5,
    unit: 'Pièce',
    location: '',
    description: ''
  });

  const openNewProductModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `PROD-${Math.floor(100 + Math.random() * 900)}`,
      barcode: '',
      category: 'outillage',
      buyingPrice: 1000,
      sellingPrice: 1500,
      stockQuantity: 10,
      minStockLevel: 5,
      unit: 'Pièce',
      location: 'Rayon A',
      description: ''
    });
    setShowProductModal(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      barcode: product.barcode || '',
      category: product.category,
      buyingPrice: product.buyingPrice,
      sellingPrice: product.sellingPrice,
      stockQuantity: product.stockQuantity,
      minStockLevel: product.minStockLevel,
      unit: product.unit,
      location: product.location || '',
      description: product.description || ''
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sku) {
      alert('Veuillez remplir au moins le nom et la référence (SKU) du produit.');
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct(formData);
    }

    setShowProductModal(false);
  };

  const openAdjustModal = (productId: string) => {
    setAdjustProductId(productId);
    setAdjustQty(5);
    setAdjustType('adjustment_add');
    setAdjustNotes('Ajustement manuel d\'inventaire');
    setShowAdjustModal(true);
  };

  const handleConfirmAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustProductId || adjustQty === 0) return;
    adjustStock(adjustProductId, adjustQty, adjustType, adjustNotes);
    setShowAdjustModal(false);
  };

  // Filtered product catalog
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchTerm));
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    let matchesStock = true;
    if (stockStatusFilter === 'low') matchesStock = p.stockQuantity <= p.minStockLevel && p.stockQuantity > 0;
    if (stockStatusFilter === 'out') matchesStock = p.stockQuantity <= 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 uppercase font-sans tracking-tight flex items-center space-x-2">
            <Boxes className="w-6 h-6 text-slate-800" />
            <span>Gestion des Stocks & Inventaire</span>
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Suivi des quantités restantes, prix d'achat, prix de vente et catégories de produits.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="btn-add-product"
            onClick={openNewProductModal}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Produit</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab('catalog')}
          className={`pb-3 px-4 font-bold text-xs flex items-center space-x-2 border-b-2 transition-colors ${
            activeSubTab === 'catalog'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Catalogue & Niveaux de Stock ({products.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('movements')}
          className={`pb-3 px-4 font-bold text-xs flex items-center space-x-2 border-b-2 transition-colors ${
            activeSubTab === 'movements'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Mouvements de Stock ({stockMovements.length})</span>
        </button>
      </div>

      {activeSubTab === 'catalog' ? (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher nom, référence (SKU)..."
                className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="flex items-center space-x-2 text-xs overflow-x-auto w-full md:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800"
              >
                <option value="all">Toutes les Catégories</option>
                {PRODUCT_TYPES.map((pt) => (
                  <option key={pt.id} value={pt.id}>
                    {pt.label}
                  </option>
                ))}
              </select>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setStockStatusFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
                    stockStatusFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setStockStatusFilter('low')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
                    stockStatusFilter === 'low'
                      ? 'bg-orange-100 text-orange-800 border border-orange-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Stock Bas
                </button>
                <button
                  onClick={() => setStockStatusFilter('out')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
                    stockStatusFilter === 'out'
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Rupture
                </button>
              </div>
            </div>
          </div>

          {/* Product Catalog Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-widest text-[10px] border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">SKU / Produit</th>
                    <th className="py-3 px-4">Catégorie</th>
                    <th className="py-3 px-4 text-right">Prix d'Achat</th>
                    <th className="py-3 px-4 text-right">Prix de Vente</th>
                    <th className="py-3 px-4 text-right">Stock Restant</th>
                    <th className="py-3 px-4">Rayon</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredProducts.map((p) => {
                    const isOut = p.stockQuantity <= 0;
                    const isLow = p.stockQuantity > 0 && p.stockQuantity <= p.minStockLevel;
                    const typeInfo = getProductTypeInfo(p.category);

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">SKU: {p.sku}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                            {typeInfo.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-slate-500">
                          {formatCurrency(p.buyingPrice, currency)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-slate-900 font-mono">
                          {formatCurrency(p.sellingPrice, currency)}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span
                            className={`px-2.5 py-0.5 rounded font-mono font-bold text-[11px] inline-block ${
                              isOut
                                ? 'bg-red-100 text-red-700 uppercase'
                                : isLow
                                ? 'bg-orange-100 text-orange-700 uppercase'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {p.stockQuantity} {p.unit}(s)
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">{p.location || '—'}</td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <button
                              onClick={() => openAdjustModal(p.id)}
                              title="Réapprovisionner / Ajuster"
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openEditProductModal(p)}
                              title="Modifier"
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Supprimer le produit ${p.name} ?`)) {
                                  deleteProduct(p.id);
                                }
                              }}
                              title="Supprimer"
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Stock Movement Log */
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-widest text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Date & Heure</th>
                  <th className="py-3 px-4">Produit</th>
                  <th className="py-3 px-4">Type Mouvement</th>
                  <th className="py-3 px-4 text-right">Variation</th>
                  <th className="py-3 px-4 text-right">Ancien Stock → Nouveau</th>
                  <th className="py-3 px-4">Réf / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {stockMovements.map((mov) => (
                  <tr key={mov.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500">{formatDateTime(mov.date)}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{mov.productName}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          mov.type === 'purchase' || mov.type === 'adjustment_add'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {mov.type}
                      </span>
                    </td>
                    <td className={`py-3.5 px-4 text-right font-mono font-bold ${mov.quantity > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-600">
                      {mov.previousStock} → <strong className="text-slate-900">{mov.newStock}</strong>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">{mov.notes || mov.reference || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base uppercase font-sans">
                {editingProduct ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit'}
              </h3>
              <button onClick={() => setShowProductModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Désignation Produit *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ex: Ciment Portland 50kg, Perceuse 800W..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">SKU / Référence *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="OUT-PER-800"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Catégorie / Rayon</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductType })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    {PRODUCT_TYPES.map((pt) => (
                      <option key={pt.id} value={pt.id}>
                        {pt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prix d'Achat ({currency})</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.buyingPrice}
                    onChange={(e) => setFormData({ ...formData, buyingPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prix de Vente ({currency})</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Initial Restant</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unité de Vente</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="Pièce">Pièce</option>
                    <option value="Sac">Sac</option>
                    <option value="Mètre">Mètre</option>
                    <option value="Kg">Kg</option>
                    <option value="Boîte">Boîte</option>
                    <option value="Rouleau">Rouleau</option>
                    <option value="Litre">Litre</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Seuil Alerte Stock Bas</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.minStockLevel}
                    onChange={(e) => setFormData({ ...formData, minStockLevel: parseInt(e.target.value) || 1 })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Emplacement / Étagère</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Rayon A2"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-sm"
                >
                  Enregistrer Produit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base uppercase font-sans">Ajustement de Stock</h3>
              <button onClick={() => setShowAdjustModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmAdjust} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Type d'Ajustement</label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value as MovementType)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="adjustment_add">Entrée / Réapprovisionnement (+)</option>
                  <option value="adjustment_remove">Correction négative / Perte (-)</option>
                  <option value="damage">Avarie / Cassé (-)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Quantité à appliquer</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(parseInt(e.target.value) || 0)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 text-base focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Motif / Justification</label>
                <textarea
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                  rows={2}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-sm"
                >
                  Appliquer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
