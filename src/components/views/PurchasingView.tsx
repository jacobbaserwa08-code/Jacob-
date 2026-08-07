import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PurchaseItem } from '../../types';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { Truck, Plus, Trash2, CheckCircle, Search, FileText } from 'lucide-react';

export const PurchasingView: React.FC = () => {
  const { products, purchases, currency, recordPurchase } = useStore();

  const [showNewPurchaseModal, setShowNewPurchaseModal] = useState(false);
  const [supplierName, setSupplierName] = useState('');
  const [supplierPhone, setSupplierPhone] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);
  const [paidAmount, setPaidAmount] = useState<string>('');
  const [notes, setNotes] = useState('');

  // Item Selector State
  const [selectedProductId, setSelectedProductId] = useState('');
  const [itemQty, setItemQty] = useState<number>(10);
  const [itemBuyingPrice, setItemBuyingPrice] = useState<number>(1000);

  const handleSelectProduct = (pId: string) => {
    setSelectedProductId(pId);
    const prod = products.find((p) => p.id === pId);
    if (prod) {
      setItemBuyingPrice(prod.buyingPrice);
    }
  };

  const handleAddItemToPurchase = () => {
    if (!selectedProductId || itemQty <= 0) return;
    const prod = products.find((p) => p.id === selectedProductId);
    if (!prod) return;

    setPurchaseItems((prev) => [
      ...prev,
      {
        productId: prod.id,
        productName: prod.name,
        unit: prod.unit,
        quantity: itemQty,
        unitBuyingPrice: itemBuyingPrice,
        total: itemQty * itemBuyingPrice
      }
    ]);

    setSelectedProductId('');
  };

  const handleRemoveItem = (idx: number) => {
    setPurchaseItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const totalPurchaseAmount = purchaseItems.reduce((acc, i) => acc + i.total, 0);

  const handleSubmitPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierName) {
      alert('Veuillez renseigner le nom du fournisseur.');
      return;
    }
    if (purchaseItems.length === 0) {
      alert('Veuillez ajouter au moins un article à la commande.');
      return;
    }

    const numericPaid = paidAmount === '' ? totalPurchaseAmount : parseFloat(paidAmount) || 0;

    recordPurchase({
      supplierName,
      supplierPhone,
      invoiceNumber,
      items: purchaseItems,
      paidAmount: numericPaid,
      notes
    });

    setShowNewPurchaseModal(false);
    setSupplierName('');
    setSupplierPhone('');
    setInvoiceNumber('');
    setPurchaseItems([]);
    setPaidAmount('');
    setNotes('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 uppercase font-sans tracking-tight flex items-center space-x-2">
            <Truck className="w-6 h-6 text-slate-800" />
            <span>Achats & Approvisionnement</span>
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Enregistrez vos achats auprès des fournisseurs. Le stock est automatiquement incrémenté lors de la livraison.
          </p>
        </div>

        <button
          onClick={() => setShowNewPurchaseModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Saisir un Achat / Commande</span>
        </button>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-xs uppercase font-sans tracking-tight">Historique des Commandes d'Achat</h2>
          <span className="text-xs text-slate-400 font-medium">{purchases.length} achat(s) enregistré(s)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-widest text-[10px] border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Code Achat</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Fournisseur</th>
                <th className="py-3 px-4">Facture Fnr.</th>
                <th className="py-3 px-4">Articles Achetés</th>
                <th className="py-3 px-4 text-right">Montant Total</th>
                <th className="py-3 px-4 text-center">Statut Paiement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {purchases.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">{p.code}</td>
                  <td className="py-3.5 px-4 text-slate-500">{formatDateTime(p.date)}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{p.supplierName}</td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono">{p.invoiceNumber || '—'}</td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {p.items.map((i) => `${i.productName} (${i.quantity} ${i.unit})`).join(', ')}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900 font-mono">
                    {formatCurrency(p.totalAmount, currency)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        p.paymentStatus === 'paid'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {p.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Purchase Modal */}
      {showNewPurchaseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm uppercase font-sans tracking-tight flex items-center space-x-2">
                <Truck className="w-5 h-5 text-slate-900" />
                <span>Enregistrer un Achat / Approvisionnement</span>
              </h3>
              <button onClick={() => setShowNewPurchaseModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitPurchase} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nom du Fournisseur *</label>
                  <input
                    type="text"
                    required
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    placeholder="ex: Sococim, Cimenterie, Grossiste..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Téléphone Fournisseur</label>
                  <input
                    type="text"
                    value={supplierPhone}
                    onChange={(e) => setSupplierPhone(e.target.value)}
                    placeholder="+221 ..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">N° Facture / BL Fournisseur</label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    placeholder="FAC-2026-99"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Montant Payé au Fournisseur ({currency})</label>
                  <input
                    type="number"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    placeholder={`Total: ${totalPurchaseAmount}`}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Add Items Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase font-sans">Ajouter des Articles à la Commande</h4>

                <div className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5">
                    <label className="block font-bold text-slate-700 mb-0.5">Produit</label>
                    <select
                      value={selectedProductId}
                      onChange={(e) => handleSelectProduct(e.target.value)}
                      className="w-full p-1.5 bg-white border border-slate-200 rounded-lg font-medium text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      <option value="">-- Sélectionner un produit --</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (Stock actuel: {p.stockQuantity})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-3">
                    <label className="block font-bold text-slate-700 mb-0.5">Prix d'Achat Unit.</label>
                    <input
                      type="number"
                      min="0"
                      value={itemBuyingPrice}
                      onChange={(e) => setItemBuyingPrice(parseFloat(e.target.value) || 0)}
                      className="w-full p-1.5 bg-white border border-slate-200 rounded-lg font-bold font-mono text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block font-bold text-slate-700 mb-0.5">Qté Achetée</label>
                    <input
                      type="number"
                      min="1"
                      value={itemQty}
                      onChange={(e) => setItemQty(parseInt(e.target.value) || 1)}
                      className="w-full p-1.5 bg-white border border-slate-200 rounded-lg font-bold font-mono text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div className="col-span-2">
                    <button
                      type="button"
                      onClick={handleAddItemToPurchase}
                      className="w-full p-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors text-xs"
                    >
                      + Ajouter
                    </button>
                  </div>
                </div>

                {/* Items List */}
                {purchaseItems.length > 0 && (
                  <div className="divide-y divide-slate-200 border-t border-slate-200 pt-2">
                    {purchaseItems.map((item, idx) => (
                      <div key={idx} className="py-1.5 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">{item.productName}</span>
                        <span className="text-slate-600 font-mono">
                          {item.quantity} {item.unit} x {formatCurrency(item.unitBuyingPrice, currency)}
                        </span>
                        <span className="font-bold text-slate-900 font-mono">
                          {formatCurrency(item.total, currency)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-red-600 font-bold hover:underline text-[11px]"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-slate-900 font-mono uppercase">
                  TOTAL COMMANDE: {formatCurrency(totalPurchaseAmount, currency)}
                </span>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowNewPurchaseModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors"
                  >
                    Valider & Mettre à jour Stock
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
