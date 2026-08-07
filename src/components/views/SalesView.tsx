import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { Search, Receipt, Printer, Eye, Calendar, User } from 'lucide-react';

export const SalesView: React.FC = () => {
  const { sales, currency, setCurrentReceiptSale, setActiveTab } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredSales = sales.filter((s) => {
    const matchesQuery =
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const totalSalesVal = filteredSales.reduce((acc, s) => acc + s.finalAmount, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 uppercase font-sans tracking-tight flex items-center space-x-2">
            <Receipt className="w-6 h-6 text-slate-800" />
            <span>Historique des Ventes & Reçus</span>
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Consultez toutes les ventes enregistrées, imprimez les factures et contrôlez les règlements.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('pos')}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
        >
          + Nouvelle Vente en Caisse
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par N° reçu (VTE-...), client..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs w-full sm:w-auto">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Statut:</span>
          {['all', 'paid', 'partial', 'unpaid'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all'
                ? 'Tous'
                : st === 'paid'
                ? 'Payés'
                : st === 'partial'
                ? 'Acomptes'
                : 'Non Payés'}
            </button>
          ))}
        </div>
      </div>

      {/* Sales Summary Bar */}
      <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between text-xs">
        <div>
          <span className="text-slate-400 uppercase tracking-wider font-bold text-[10px]">
            Total Ventes Sélectionnées ({filteredSales.length}):
          </span>{' '}
          <span className="text-base font-bold text-white ml-2 font-mono">
            {formatCurrency(totalSalesVal, currency)}
          </span>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-widest text-[10px] border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">N° Reçu</th>
                <th className="py-3 px-4">Date & Heure</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Articles</th>
                <th className="py-3 px-4">Mode Paiement</th>
                <th className="py-3 px-4 text-right">Total Net</th>
                <th className="py-3 px-4 text-right">Versé</th>
                <th className="py-3 px-4 text-center">Reçu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">{sale.code}</td>
                  <td className="py-3.5 px-4 text-slate-500">{formatDateTime(sale.date)}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{sale.clientName}</td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {sale.items.length} article(s) ({sale.items.map((i) => i.productName).join(', ')})
                  </td>
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
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900 font-mono">
                    {formatCurrency(sale.finalAmount, currency)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-700">
                    {formatCurrency(sale.paidAmount, currency)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => setCurrentReceiptSale(sale)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition-colors flex items-center justify-center space-x-1 mx-auto text-[10px]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Reçu</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
