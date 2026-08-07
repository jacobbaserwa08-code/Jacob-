import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ExpenseCategory, PaymentMethod } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Wallet, Plus, Trash2, Calendar } from 'lucide-react';

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  rent: 'Loyer Magasin',
  utilities: 'Électricité & Eau',
  transport: 'Transport & Logistique',
  maintenance: 'Entretien & Réparations',
  supplies: 'Fournitures Magasin',
  taxes: 'Taxes & Impôts',
  other: 'Autres Charges'
};

export const ExpensesView: React.FC = () => {
  const { expenses, currency, recordExpense, deleteExpense } = useStore();

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('rent');
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [notes, setNotes] = useState('');

  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || amount <= 0) {
      alert('Veuillez remplir le libellé et le montant de la charge.');
      return;
    }

    recordExpense({
      date: new Date().toISOString().split('T')[0],
      title,
      category,
      amount,
      paymentMethod,
      notes
    });

    setShowModal(false);
    setTitle('');
    setAmount(0);
    setNotes('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 uppercase font-sans tracking-tight flex items-center space-x-2">
            <Wallet className="w-6 h-6 text-slate-800" />
            <span>Gestion des Charges & Dépenses</span>
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Suivi des coûts d'exploitation de la quincaillerie (Loyer, électricité, transport, maintenance).
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Enregistrer une Dépense</span>
        </button>
      </div>

      {/* Summary Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Total Dépenses Enregistrées</span>
          <div className="text-xl font-bold text-white font-mono mt-0.5">
            {formatCurrency(totalExpenses, currency)}
          </div>
        </div>
        <span className="text-xs text-slate-400 font-medium">{expenses.length} dépense(s)</span>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-widest text-[10px] border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Libellé / Description</th>
                <th className="py-3 px-4">Catégorie</th>
                <th className="py-3 px-4">Mode Paiement</th>
                <th className="py-3 px-4 text-right">Montant</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 text-slate-500 font-medium">{formatDate(exp.date)}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {exp.title}
                    {exp.notes && <p className="text-[10px] text-slate-400 font-normal">{exp.notes}</p>}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {CATEGORY_LABELS[exp.category] || exp.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700 uppercase">{exp.paymentMethod}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-red-600 font-mono">
                    {formatCurrency(exp.amount, currency)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => deleteExpense(exp.id)}
                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm uppercase font-sans">Enregistrer une Charge / Dépense</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Libellé de la Dépense *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ex: Loyer du mois, Facture Senelec..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catégorie</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  {Object.entries(CATEGORY_LABELS).map(([catKey, catLabel]) => (
                    <option key={catKey} value={catKey}>
                      {catLabel}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Montant ({currency}) *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={amount || ''}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mode de Règlement</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="cash">Espèces / Caisse</option>
                  <option value="mobile_money">Mobile Money (Wave / Orange Money)</option>
                  <option value="card">Chèque / Virement Bancaire</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes / Remarques</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Détails complémentaires..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg text-xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors"
                >
                  Valider la Dépense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
