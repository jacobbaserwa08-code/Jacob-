import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Store,
  ShoppingCart,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Search,
  DollarSign
} from 'lucide-react';
import { CurrencyCode } from '../types';

interface NavbarProps {
  onSearchChange?: (val: string) => void;
  searchValue?: string;
  onOpenQuickSale?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearchChange,
  searchValue = '',
  onOpenQuickSale
}) => {
  const { products, currency, setCurrency, resetToDemoData, setActiveTab } = useStore();

  const lowStockCount = products.filter((p) => p.stockQuantity <= p.minStockLevel).length;

  return (
    <header id="main-navbar" className="bg-white text-slate-800 sticky top-0 z-40 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center shrink-0">
              <div className="w-4 h-4 border-2 border-white rotate-45" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 uppercase font-sans">
                Quincaillerie Vie Nouvelle
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
                Système de Gestion Quincaillerie
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="Chercher un produit, une référence, un client..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* Quick Actions & Currency Switcher */}
          <div className="flex items-center space-x-3">
            {/* System Active Status */}
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Système Actif</span>
            </div>

            {/* Currency Selector */}
            <div className="hidden sm:flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
              {(['XOF', 'USD', 'EUR', 'CDF'] as CurrencyCode[]).map((c) => (
                <button
                  key={c}
                  id={`btn-currency-${c}`}
                  onClick={() => setCurrency(c)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                    currency === c
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {c === 'XOF' ? 'FCFA' : c}
                </button>
              ))}
            </div>

            {/* Low Stock Badge */}
            {lowStockCount > 0 && (
              <button
                id="btn-low-stock-alert"
                onClick={() => setActiveTab('inventory')}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                title={`${lowStockCount} article(s) en alerte stock bas`}
              >
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="hidden sm:inline uppercase text-[10px] tracking-wider">Stock Bas:</span>
                <span className="bg-red-600 text-white px-1.5 py-0.2 rounded text-[11px] font-mono font-bold">
                  {lowStockCount}
                </span>
              </button>
            )}

            {/* AI Assistant Button */}
            <button
              id="btn-ai-assistant-header"
              onClick={() => setActiveTab('ai_assistant')}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-slate-700" />
              <span className="hidden sm:inline">Conseiller IA</span>
            </button>

            {/* Quick POS Button */}
            <button
              id="btn-header-pos"
              onClick={onOpenQuickSale || (() => setActiveTab('pos'))}
              className="flex items-center space-x-1.5 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Caisse / Vente</span>
            </button>

            {/* Reset Button */}
            <button
              id="btn-reset-demo"
              onClick={resetToDemoData}
              title="Réinitialiser données démo"
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
