import React from 'react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import {
  TrendingUp,
  Boxes,
  AlertTriangle,
  Users,
  Wallet,
  ShoppingCart,
  Plus,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Package,
  Sparkles
} from 'lucide-react';
import { PRODUCT_TYPES } from '../../data/productTypes';

export const DashboardView: React.FC = () => {
  const {
    products,
    sales,
    clients,
    expenses,
    salaryPayments,
    currency,
    setActiveTab,
    setCurrentReceiptSale
  } = useStore();

  // Metrics Calculations
  const totalSalesRevenue = sales.reduce((acc, s) => acc + s.finalAmount, 0);
  const totalCostOfGoodsSold = sales.reduce(
    (acc, s) => acc + s.items.reduce((sum, item) => sum + item.unitCost * item.quantity, 0),
    0
  );
  const grossProfit = totalSalesRevenue - totalCostOfGoodsSold;

  const totalStockValueCost = products.reduce(
    (acc, p) => acc + p.buyingPrice * p.stockQuantity,
    0
  );
  const totalStockValueRetail = products.reduce(
    (acc, p) => acc + p.sellingPrice * p.stockQuantity,
    0
  );

  const lowStockProducts = products.filter((p) => p.stockQuantity <= p.minStockLevel);
  const totalClientDebt = clients.reduce((acc, c) => acc + c.outstandingBalance, 0);

  const totalExpensesAmount = expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalSalariesAmount = salaryPayments.reduce((acc, s) => acc + s.amount, 0);

  // Sales by Category
  const categorySalesMap: { [key: string]: number } = {};
  sales.forEach((s) => {
    s.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      const cat = prod?.category || 'autres';
      categorySalesMap[cat] = (categorySalesMap[cat] || 0) + item.total;
    });
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome / Dashboard Header Banner */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Tableau de Bord Exécutif</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase font-sans">
            Quincaillerie Vie Nouvelle
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Aperçu en temps réel de votre stock, vos ventes, vos charges et la paie des employés.
          </p>
        </div>

        {/* Quick Shortcut Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="dash-btn-pos"
            onClick={() => setActiveTab('pos')}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors shadow-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Nouvelle Vente</span>
          </button>
          <button
            id="dash-btn-inventory"
            onClick={() => setActiveTab('inventory')}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs transition-colors"
          >
            <Boxes className="w-4 h-4 text-slate-600" />
            <span>Gérer Stock</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Stock Value */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Valeur Inventaire</div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {formatCurrency(totalStockValueRetail, currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Coût d'achat: <span className="font-mono">{formatCurrency(totalStockValueCost, currency)}</span>
          </div>
        </div>

        {/* Total Sales Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Chiffre d'Affaires</div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {formatCurrency(totalSalesRevenue, currency)}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            Marge brute: <span className="font-mono">{formatCurrency(grossProfit, currency)}</span>
          </div>
        </div>

        {/* Client Debts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Crédits Clients</div>
          <div className="text-2xl font-bold text-red-600 font-mono">
            {formatCurrency(totalClientDebt, currency)}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
            <span>{clients.filter((c) => c.outstandingBalance > 0).length} client(s) en reste</span>
            <button
              onClick={() => setActiveTab('clients')}
              className="text-slate-900 font-bold hover:underline"
            >
              Voir →
            </button>
          </div>
        </div>

        {/* Total Expenses & Salaries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Charges & Salaires</div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {formatCurrency(totalExpensesAmount + totalSalariesAmount, currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Dépenses: <span className="font-mono">{formatCurrency(totalExpensesAmount, currency)}</span>
          </div>
        </div>
      </div>

      {/* Low Stock Alert Banner */}
      {lowStockProducts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <h2 className="font-bold text-slate-900 text-sm">
                Alerte Stock Bas ({lowStockProducts.length} articles critiques à réapprovisionner)
              </h2>
            </div>
            <button
              id="dash-btn-restock-all"
              onClick={() => setActiveTab('purchasing')}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors shadow-sm"
            >
              Commander Achats
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockProducts.slice(0, 6).map((product) => (
              <div
                key={product.id}
                className="bg-white p-3.5 rounded-xl border border-red-100 flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-slate-900 text-xs line-clamp-1">{product.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">Réf: {product.sku}</p>
                </div>
                <div className="text-right">
                  <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase">
                    {product.stockQuantity} {product.unit}s
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Seuil: {product.minStockLevel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section Grid: Sales History & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Sales History */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Dernières Ventes Effectuées</h2>
              <p className="text-xs text-slate-400">Transactions enregistrées en caisse</p>
            </div>
            <button
              onClick={() => setActiveTab('sales')}
              className="flex items-center text-xs font-bold text-slate-900 hover:underline"
            >
              <span>Tout l'historique</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="py-3 px-4">N° Reçu</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Mode / Statut</th>
                  <th className="py-3 px-4 text-right">Montant</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {sales.slice(0, 5).map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">{sale.code}</td>
                    <td className="py-3.5 px-4 text-slate-500">{formatDateTime(sale.date)}</td>
                    <td className="py-3.5 px-4 text-slate-800">{sale.clientName}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          sale.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-700'
                            : sale.status === 'partial'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {sale.paymentMethod} • {sale.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900 font-mono">
                      {formatCurrency(sale.finalAmount, currency)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setCurrentReceiptSale(sale)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded text-[10px] transition-colors"
                      >
                        Reçu
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Type / Category Breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Rayons & Produits</h2>
            <p className="text-xs text-slate-400">Répartition du stock par catégorie</p>
          </div>

          <div className="space-y-2">
            {PRODUCT_TYPES.map((pt) => {
              const count = products.filter((p) => p.category === pt.id).length;
              const salesVolume = categorySalesMap[pt.id] || 0;

              return (
                <div
                  key={pt.id}
                  onClick={() => setActiveTab('inventory')}
                  className="p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{pt.label}</p>
                      <p className="text-[10px] text-slate-400">{count} produit(s)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 font-mono">
                      {salesVolume > 0 ? formatCurrency(salesVolume, currency) : '—'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
