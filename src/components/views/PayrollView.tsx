import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Employee, SalaryPayment, PaymentMethod } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { UserCheck, Plus, DollarSign, Calendar, FileText, CheckCircle } from 'lucide-react';

export const PayrollView: React.FC = () => {
  const {
    employees,
    salaryPayments,
    currency,
    addEmployee,
    recordSalaryPayment
  } = useStore();

  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Employee Form
  const [empName, setEmpName] = useState('');
  const [empRole, setEmpRole] = useState('Vendeur');
  const [empSalary, setEmpSalary] = useState<number>(150000);
  const [empPhone, setEmpPhone] = useState('');

  // Salary Payment Form
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [periodMonth, setPeriodMonth] = useState('2026-08');
  const [paymentType, setPaymentType] = useState<'full_salary' | 'advance' | 'bonus'>('full_salary');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [notes, setNotes] = useState('');

  const handleOpenSalaryModal = (emp: Employee) => {
    setSelectedEmpId(emp.id);
    setPaymentAmount(emp.monthlySalary);
    setPaymentType('full_salary');
    setNotes(`Salaire mois ${periodMonth}`);
    setShowPaymentModal(true);
  };

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName || !empPhone) return;

    addEmployee({
      name: empName,
      role: empRole,
      monthlySalary: empSalary,
      phone: empPhone,
      hireDate: new Date().toISOString().split('T')[0],
      active: true
    });

    setShowEmployeeModal(false);
    setEmpName('');
    setEmpPhone('');
  };

  const handleSaveSalaryPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmpId || paymentAmount <= 0) return;

    const emp = employees.find((e) => e.id === selectedEmpId);
    if (!emp) return;

    recordSalaryPayment({
      employeeId: emp.id,
      employeeName: emp.name,
      date: new Date().toISOString().split('T')[0],
      periodMonth,
      amount: paymentAmount,
      paymentType,
      paymentMethod,
      notes
    });

    setShowPaymentModal(false);
  };

  const totalPayrollPaid = salaryPayments.reduce((acc, s) => acc + s.amount, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 uppercase font-sans tracking-tight flex items-center space-x-2">
            <UserCheck className="w-6 h-6 text-slate-800" />
            <span>Gestion du Personnel & Salaires</span>
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Gestion de l'équipe (Gérant, Caissière, Magasiniers), enregistrement des salaires et avances.
          </p>
        </div>

        <button
          onClick={() => setShowEmployeeModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Membre du Personnel</span>
        </button>
      </div>

      {/* Salary Summary Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Masse Salariale Versée</span>
          <div className="text-xl font-bold text-white font-mono mt-0.5">
            {formatCurrency(totalPayrollPaid, currency)}
          </div>
        </div>
        <span className="text-xs text-slate-400 font-medium">{employees.length} employé(s) actifs</span>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {employees.map((emp) => (
          <div
            key={emp.id}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between space-y-3 hover:border-slate-400 transition-all"
          >
            <div>
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-slate-900 text-sm">{emp.name}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                  {emp.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Tél: {emp.phone}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400">Salaire Fixe:</p>
                <p className="font-bold text-slate-900 text-xs font-mono">
                  {formatCurrency(emp.monthlySalary, currency)}
                </p>
              </div>

              <button
                onClick={() => handleOpenSalaryModal(emp)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors shadow-xs"
              >
                Payer Salaire
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Salary Payments Log Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-900 text-xs uppercase font-sans tracking-tight">Historique des Règlements de Salaires</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-widest text-[10px] border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">N° Pièce</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Employé</th>
                <th className="py-3 px-4">Période</th>
                <th className="py-3 px-4">Type Versement</th>
                <th className="py-3 px-4">Mode Paiement</th>
                <th className="py-3 px-4 text-right">Montant Versé</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {salaryPayments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">{p.code}</td>
                  <td className="py-3.5 px-4 text-slate-500">{formatDate(p.date)}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{p.employeeName}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{p.periodMonth}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        p.paymentType === 'full_salary'
                          ? 'bg-emerald-100 text-emerald-700'
                          : p.paymentType === 'advance'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {p.paymentType === 'full_salary' ? 'Salaire Complet' : p.paymentType === 'advance' ? 'Avance' : 'Prime / Bonus'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700 uppercase">{p.paymentMethod}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900 font-mono">
                    {formatCurrency(p.amount, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showEmployeeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm uppercase font-sans">Ajouter un Membre du Personnel</h3>
              <button onClick={() => setShowEmployeeModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEmployee} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nom & Prénom *</label>
                <input
                  type="text"
                  required
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  placeholder="ex: Mamadou Ndiaye"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Poste / Rôle</label>
                <select
                  value={empRole}
                  onChange={(e) => setEmpRole(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="Vendeur">Vendeur Comptoir</option>
                  <option value="Caissière">Caissier / Caissière</option>
                  <option value="Magasinier">Magasinier & Stockiste</option>
                  <option value="Gérant">Gérant / Responsable</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Salaire Mensuel Fixe ({currency})</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={empSalary}
                  onChange={(e) => setEmpSalary(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Téléphone *</label>
                <input
                  type="text"
                  required
                  value={empPhone}
                  onChange={(e) => setEmpPhone(e.target.value)}
                  placeholder="+221..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEmployeeModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg text-xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors"
                >
                  Enregistrer l'Employé
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pay Salary Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm uppercase font-sans">Paiement de Salaire / Avance</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSalaryPayment} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Type de Paiement</label>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="full_salary">Salaire Mensuel Complet</option>
                  <option value="advance">Avance sur Salaire</option>
                  <option value="bonus">Bonus / Prime Exceptionnelle</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Période / Mois (AAAA-MM)</label>
                <input
                  type="month"
                  value={periodMonth}
                  onChange={(e) => setPeriodMonth(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Montant à verser ({currency})</label>
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
                <label className="block font-bold text-slate-700 mb-1">Mode de Règlement</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="cash">Espèces / Caisse</option>
                  <option value="mobile_money">Mobile Money (Wave / Orange Money)</option>
                  <option value="card">Virement Bancaire</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Remarques / Reçu</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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
                  Valider le Paiement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
