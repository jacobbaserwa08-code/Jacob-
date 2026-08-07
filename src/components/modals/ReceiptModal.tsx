import React from 'react';
import { Sale } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { Printer, X, CheckCircle, Store, Phone, MapPin } from 'lucide-react';

interface ReceiptModalProps {
  sale: Sale | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ sale, onClose }) => {
  const { currency } = useStore();

  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  const changeToReturn = Math.max(0, sale.paidAmount - sale.finalAmount);
  const remainingDebt = Math.max(0, sale.finalAmount - sale.paidAmount);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
        {/* Modal Top Bar (Non-printable) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">Reçu de Caisse - {sale.code}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              id="btn-print-receipt"
              onClick={handlePrint}
              className="flex items-center space-x-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer</span>
            </button>
            <button
              id="btn-close-receipt"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Canvas */}
        <div id="printable-receipt" className="p-8 space-y-6 font-mono text-xs sm:text-sm">
          {/* Header */}
          <div className="text-center border-b border-dashed border-slate-300 pb-4 space-y-1">
            <div className="flex justify-center items-center space-x-2 mb-1">
              <Store className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-extrabold tracking-tight font-sans text-slate-950">
                Quincaillerie vie nouvelle
              </h2>
            </div>
            <p className="text-slate-600 font-sans text-xs">
              Outillage • Plomberie • Électricité • Matériaux • Peinture
            </p>
            <div className="flex items-center justify-center space-x-4 text-[11px] text-slate-500 font-sans pt-1">
              <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> Boulevard Commercial, Lot 45</span>
              <span className="flex items-center"><Phone className="w-3 h-3 mr-1" /> +221 33 800 12 34</span>
            </div>
          </div>

          {/* Transaction Metadata */}
          <div className="grid grid-cols-2 gap-2 text-xs border-b border-dashed border-slate-300 pb-3 font-sans">
            <div>
              <span className="text-slate-500">N° Facture:</span>{' '}
              <strong className="text-slate-900">{sale.code}</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-500">Date:</span>{' '}
              <span className="text-slate-900">{formatDateTime(sale.date)}</span>
            </div>
            <div>
              <span className="text-slate-500">Client:</span>{' '}
              <strong className="text-slate-900">{sale.clientName}</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-500">Vendeur:</span>{' '}
              <span className="text-slate-900">{sale.servedBy || 'Caisse'}</span>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <div className="grid grid-cols-12 font-bold text-slate-700 border-b border-slate-300 pb-1 text-xs">
              <span className="col-span-6">Désignation</span>
              <span className="col-span-2 text-center">Qté</span>
              <span className="col-span-2 text-right">P.U</span>
              <span className="col-span-2 text-right">Total</span>
            </div>
            <div className="divide-y divide-slate-100 py-2">
              {sale.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 py-1.5 text-xs">
                  <div className="col-span-6 pr-2 font-medium">
                    {item.productName}
                    <span className="text-[10px] text-slate-500 block">({item.unit})</span>
                  </div>
                  <div className="col-span-2 text-center">{item.quantity}</div>
                  <div className="col-span-2 text-right">{item.unitPrice.toLocaleString()}</div>
                  <div className="col-span-2 text-right font-bold">{item.total.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Section */}
          <div className="border-t-2 border-slate-900 pt-3 space-y-1.5 font-sans">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Sous-total:</span>
              <span>{formatCurrency(sale.subtotal, currency)}</span>
            </div>
            {sale.discount > 0 && (
              <div className="flex justify-between text-xs text-amber-700 font-medium">
                <span>Remise accordée:</span>
                <span>-{formatCurrency(sale.discount, currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-extrabold text-slate-950 pt-1 border-t border-slate-200">
              <span>TOTAL NET:</span>
              <span className="text-amber-600">{formatCurrency(sale.finalAmount, currency)}</span>
            </div>

            <div className="pt-2 border-t border-dashed border-slate-300 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-600">Mode de Paiement:</span>
                <span className="font-bold uppercase">{sale.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Montant Reçu / Versé:</span>
                <span className="font-bold">{formatCurrency(sale.paidAmount, currency)}</span>
              </div>

              {changeToReturn > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 p-1.5 rounded">
                  <span>Monnaie rendue:</span>
                  <span>{formatCurrency(changeToReturn, currency)}</span>
                </div>
              )}

              {remainingDebt > 0 && (
                <div className="flex justify-between text-rose-700 font-bold bg-rose-50 p-1.5 rounded">
                  <span>Reste en Crédit Client:</span>
                  <span>{formatCurrency(remainingDebt, currency)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center pt-4 border-t border-dashed border-slate-300 text-[11px] text-slate-500 font-sans space-y-1">
            <p className="font-semibold text-slate-800">Merci de votre confiance !</p>
            <p>Les marchandises vendues ne sont ni reprises ni échangées après 48h.</p>
            <p className="text-[10px] text-slate-400">Quincaillerie Vie Nouvelle • Tout pour vos travaux</p>
          </div>
        </div>
      </div>
    </div>
  );
};
