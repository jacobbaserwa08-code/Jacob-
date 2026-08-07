import React from 'react';
import { useStore } from '../context/StoreContext';
import { ActiveTab } from '../types';
import {
  LayoutDashboard,
  ShoppingCart,
  Receipt,
  Boxes,
  Truck,
  Users,
  Wallet,
  UserCheck,
  BarChart3,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onCloseMobile }) => {
  const { activeTab, setActiveTab, products, sales, clients } = useStore();

  const lowStockCount = products.filter((p) => p.stockQuantity <= p.minStockLevel).length;
  const totalUnpaidClients = clients.reduce((acc, c) => acc + (c.outstandingBalance > 0 ? 1 : 0), 0);

  const menuItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    {
      id: 'dashboard',
      label: 'Tableau de Bord',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      id: 'pos',
      label: 'Caisse / Nouvelle Vente',
      icon: <ShoppingCart className="w-5 h-5 text-amber-500" />
    },
    {
      id: 'sales',
      label: 'Ventes & Factures',
      icon: <Receipt className="w-5 h-5" />
    },
    {
      id: 'inventory',
      label: 'Stock & Inventaire',
      icon: <Boxes className="w-5 h-5" />,
      badge: lowStockCount > 0 ? lowStockCount : undefined
    },
    {
      id: 'purchasing',
      label: 'Achats & Fournisseurs',
      icon: <Truck className="w-5 h-5" />
    },
    {
      id: 'clients',
      label: 'Clients & Crédits',
      icon: <Users className="w-5 h-5" />,
      badge: totalUnpaidClients > 0 ? `${totalUnpaidClients} en crédit` : undefined
    },
    {
      id: 'costs',
      label: 'Charges & Dépenses',
      icon: <Wallet className="w-5 h-5" />
    },
    {
      id: 'salaries',
      label: 'Paiement Salaires',
      icon: <UserCheck className="w-5 h-5" />
    },
    {
      id: 'reports',
      label: 'Rapports & Bilan',
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      id: 'ai_assistant',
      label: 'Conseiller IA Stock',
      icon: <Sparkles className="w-5 h-5 text-indigo-400" />
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:sticky top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] bg-white text-slate-700 border-r border-slate-200 transition-transform duration-200 ease-in-out flex flex-col justify-between overflow-y-auto p-4 gap-2 shrink-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-4">
          <div>
            <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Menu Principal
            </div>

            <div className="space-y-1 mt-1">
              {menuItems.slice(0, 6).map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`sidebar-tab-${item.id}`}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-slate-900 text-white font-semibold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={isActive ? 'text-white' : 'text-slate-500'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`px-2 py-0.5 text-[10px] rounded font-mono font-bold uppercase ${
                          isActive
                            ? 'bg-slate-800 text-white'
                            : typeof item.badge === 'number'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Finance & RH
            </div>

            <div className="space-y-1 mt-1">
              {menuItems.slice(6).map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`sidebar-tab-${item.id}`}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-slate-900 text-white font-semibold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={isActive ? 'text-white' : 'text-slate-500'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`px-2 py-0.5 text-[10px] rounded font-mono font-bold uppercase ${
                          isActive
                            ? 'bg-slate-800 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stock Alert Summary Card */}
        <div className="mt-auto p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Alerte Stock</div>
          <div className="text-sm font-semibold text-red-600">
            {lowStockCount > 0 ? `${lowStockCount} articles critiques` : 'Stock à niveau optimal'}
          </div>
          {lowStockCount > 0 && (
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-red-500 h-1.5 rounded-full transition-all"
                style={{ width: `${Math.min(100, (lowStockCount / products.length) * 100)}%` }}
              />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
