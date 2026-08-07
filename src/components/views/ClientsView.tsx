import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Client } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Users, Plus, Phone, Mail, MapPin, DollarSign, CheckCircle2, Search, X } from 'lucide-react';

export const ClientsView: React.FC = () => {
  const { clients, sales, currency, addClient, recordClientPayment } = useStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentNotes, setPaymentNotes] = useState<string>('');

  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    type: 'contractor' as 'particular' | 'company' | 'contractor',
    address: ''
  });

  const handleAddClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Veuillez remplir le nom et le numéro de téléphone.');
      return;
    }
    addClient(formData);
    setShowAddModal(false);
    setFormData({ name: '', phone: '', email: '', type: 'contractor', address: '' });
  };

  const handleOpenPayment = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;
    setSelectedClientId(clientId);
    setPaymentAmount(client.outstandingBalance);
    setPaymentNotes('Règlement crédit client');
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId || paymentAmount <= 0) return;
    recordClientPayment(selectedClientId, paymentAmount, paymentNotes);
    setShowPaymentModal(false);
  };

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  const totalOutstanding = clients.reduce((acc, c) => acc + c.outstandingBalance, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 uppercase font-sans tracking-tight flex items-center space-x-2">
            <Users className="w-6 h-6 text-slate-800" />
            <span>Gestion des Clients & Crédits</span>
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Répertoire des artisans, entreprises du BTP et particuliers avec suivi des dettes et règlements.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Client</span>
        </button>
      </div>

      {/* Debt Summary Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Total Crédits Clients Accordés</span>
          <div className="text-xl font-bold text-red-400 font-mono mt-0.5">
            {formatCurrency(totalOutstanding, currency)}
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher client, téléphone..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-600"
          />
        </div>
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => {
          return (
            <div
              key={client.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between space-y-3 hover:border-slate-400 transition-all"
            >
              <div>
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">{client.name}</h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      client.type === 'company'
                        ? 'bg-blue-100 text-blue-800'
                        : client.type === 'contractor'
                        ? 'bg-slate-100 text-slate-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {client.type === 'company' ? 'Entreprise' : client.type === 'contractor' ? 'Artisan / BTP' : 'Particulier'}
                  </span>
                </div>

                <div className="mt-2 space-y-1 text-xs text-slate-600 font-medium">
                  <p className="flex items-center"><Phone className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> {client.phone}</p>
                  {client.email && <p className="flex items-center"><Mail className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> {client.email}</p>}
                  {client.address && <p className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> {client.address}</p>}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <p className="text-[10px] text-slate-400">Achats Totaux: {formatCurrency(client.totalPurchases, currency)}</p>
                  <p className={`font-bold font-mono text-xs ${client.outstandingBalance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    Dette: {formatCurrency(client.outstandingBalance, currency)}
                  </p>
                </div>

                {client.outstandingBalance > 0 && (
                  <button
                    onClick={() => handleOpenPayment(client.id)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors text-xs shadow-xs"
                  >
                    Régler Dette
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm uppercase font-sans">Nouveau Client</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddClientSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nom / Raison Sociale *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ex: M. Diallo, Ent. Batiment Sn..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Téléphone *</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+221 77..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Type de Client</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="contractor">Artisan / Plombier / Électricien</option>
                  <option value="company">Entreprise BTP / Société</option>
                  <option value="particular">Particulier</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email (optionnel)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Adresse / Chantier</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Quartier, Zone..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg text-xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors"
                >
                  Enregistrer Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Debt Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm uppercase font-sans">Règlement de Crédit Client</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmPayment} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Montant du Versement ({currency})</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold font-mono text-slate-900 text-base focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes / Référence Reçu</label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg text-xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors"
                >
                  Valider le Règlement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
