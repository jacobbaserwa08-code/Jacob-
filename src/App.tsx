import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ReceiptModal } from './components/modals/ReceiptModal';

import { DashboardView } from './components/views/DashboardView';
import { POSView } from './components/views/POSView';
import { SalesView } from './components/views/SalesView';
import { InventoryView } from './components/views/InventoryView';
import { PurchasingView } from './components/views/PurchasingView';
import { ClientsView } from './components/views/ClientsView';
import { ExpensesView } from './components/views/ExpensesView';
import { PayrollView } from './components/views/PayrollView';
import { ReportsView } from './components/views/ReportsView';
import { AiAssistantView } from './components/views/AiAssistantView';
import { Menu, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, currentReceiptSale, setCurrentReceiptSale } = useStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'pos':
        return <POSView />;
      case 'sales':
        return <SalesView />;
      case 'inventory':
        return <InventoryView />;
      case 'purchasing':
        return <PurchasingView />;
      case 'clients':
        return <ClientsView />;
      case 'costs':
        return <ExpensesView />;
      case 'salaries':
        return <PayrollView />;
      case 'reports':
        return <ReportsView />;
      case 'ai_assistant':
        return <AiAssistantView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans antialiased selection:bg-slate-900 selection:text-white">
      {/* Header Navbar */}
      <Navbar
        searchValue={globalSearch}
        onSearchChange={(val) => {
          setGlobalSearch(val);
          if (val && activeTab !== 'inventory') {
            setActiveTab('inventory');
          }
        }}
        onOpenQuickSale={() => setActiveTab('pos')}
      />

      {/* Main Layout Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex items-start">
        {/* Mobile menu toggle bar */}
        <div className="lg:hidden fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="w-12 h-12 bg-slate-900 text-white font-bold rounded-full shadow-lg flex items-center justify-center border border-slate-700"
          >
            {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Dynamic Active View Page */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {renderActiveView()}
        </main>
      </div>

      {/* Printable Receipt Modal Overlay */}
      <ReceiptModal
        sale={currentReceiptSale}
        onClose={() => setCurrentReceiptSale(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
