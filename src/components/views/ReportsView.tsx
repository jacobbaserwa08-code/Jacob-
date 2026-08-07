import React from 'react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';
import { BarChart3, Download, Upload, RefreshCw, TrendingUp, DollarSign, PieChart, Shield } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const {
    products,
    sales,
    expenses,
    salaryPayments,
    currency,
    exportDataJSON,
    importDataJSON,
    resetToDemoData
  } = useStore();

  // Financial Computations
  const totalRevenue = sales.reduce((acc, s) => acc + s.finalAmount, 0);
  const totalCostOfGoodsSold = sales.reduce(
    (acc, s) => acc + s.items.reduce((sum, i) => sum + i.unitCost * i.quantity, 0),
    0
  );
  const grossProfit = totalRevenue - totalCostOfGoodsSold;

  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalSalaries = salaryPayments.reduce((acc, s) => acc + s.amount, 0);
  const totalOperationalCosts = totalExpenses + totalSalaries;

  const netProfit = grossProfit - totalOperationalCosts;

  // Inventory Valuation
  const inventoryCostValue = products.reduce((acc, p) => acc + p.buyingPrice * p.stockQuantity, 0);
  const inventoryRetailValue = products.reduce((acc, p) => acc + p.sellingPrice * p.stockQuantity, 0);
  const potentialInventoryProfit = inventoryRetailValue - inventoryCostValue;

  const handleExport = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quincaillerie_vie_nouvelle_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataJSON(content);
        if (success) {
          alert('Sauvegarde restaurée avec succès !');
        } else {
          alert('Erreur lors de la lecture du fichier de sauvegarde JSON.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 uppercase font-sans tracking-tight flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-slate-800" />
            <span>Rapports Financiers & Bilan</span>
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Analyse de rentabilité, compte de résultat, valeur du stock et sauvegarde des données.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExport}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-300" />
            <span>Exporter Sauvegarde (JSON)</span>
          </button>

          <label className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors cursor-pointer border border-slate-200">
            <Upload className="w-4 h-4 text-slate-500" />
            <span>Restaurer</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </div>

      {/* Income Statement (Compte de Résultat) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase font-sans tracking-tight flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-slate-800" />
          <span>Compte de Résultat Synthétique</span>
        </h2>

        <div className="divide-y divide-slate-100 text-xs">
          <div className="py-2.5 flex justify-between font-bold text-slate-900">
            <span>Chiffre d'Affaires Brut (Ventes Total)</span>
            <span className="font-mono text-emerald-600">{formatCurrency(totalRevenue, currency)}</span>
          </div>

          <div className="py-2.5 flex justify-between text-slate-600 font-medium">
            <span>- Coût d'Achat des Marchandises Vendues (COGS)</span>
            <span className="font-mono text-slate-600">-{formatCurrency(totalCostOfGoodsSold, currency)}</span>
          </div>

          <div className="py-2.5 flex justify-between font-bold text-slate-900 bg-slate-50 px-3 rounded-lg my-1">
            <span>= MARGE BRUTE</span>
            <span className="font-mono text-slate-900">{formatCurrency(grossProfit, currency)}</span>
          </div>

          <div className="py-2.5 flex justify-between text-slate-600 font-medium">
            <span>- Charges d'Exploitation (Loyer, Eau, Elec, Transport)</span>
            <span className="font-mono text-slate-600">-{formatCurrency(totalExpenses, currency)}</span>
          </div>

          <div className="py-2.5 flex justify-between text-slate-600 font-medium">
            <span>- Charges Salariales (Salaires & Primes)</span>
            <span className="font-mono text-slate-600">-{formatCurrency(totalSalaries, currency)}</span>
          </div>

          <div
            className={`py-3.5 flex justify-between text-sm font-bold px-4 rounded-xl mt-2 ${
              netProfit >= 0
                ? 'bg-slate-900 text-white'
                : 'bg-red-50 text-red-900 border border-red-200'
            }`}
          >
            <span className="uppercase tracking-wider text-xs">= BÉNÉFICE NET DE L'EXERCICE</span>
            <span className={`font-mono text-base ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-600'}`}>
              {formatCurrency(netProfit, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Inventory Valuation Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase font-sans tracking-tight flex items-center space-x-2">
          <PieChart className="w-4 h-4 text-slate-800" />
          <span>Valorisation Actuelle du Stock</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Valeur au Prix d'Achat (Coût)</span>
            <p className="text-lg font-bold text-slate-900 font-mono mt-1">
              {formatCurrency(inventoryCostValue, currency)}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Valeur au Prix de Vente (Total)</span>
            <p className="text-lg font-bold text-slate-900 font-mono mt-1">
              {formatCurrency(inventoryRetailValue, currency)}
            </p>
          </div>

          <div className="bg-slate-900 text-white p-4 rounded-xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Marge Brute Latente en Stock</span>
            <p className="text-lg font-bold text-emerald-400 font-mono mt-1">
              {formatCurrency(potentialInventoryProfit, currency)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
