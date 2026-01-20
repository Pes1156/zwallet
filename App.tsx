
import React, { useState, useEffect, useCallback } from 'react';
import { Transaction, TransactionType } from './types';
import { INITIAL_TRANSACTIONS } from './constants';
import { Dashboard } from './components/Dashboard';
import { TransactionList } from './components/TransactionList';
import { TransactionForm } from './components/TransactionForm';
import { LayoutGrid, List, Plus, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize data
  useEffect(() => {
    const saved = localStorage.getItem('zenwallet_transactions');
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        setTransactions(INITIAL_TRANSACTIONS);
      }
    } else {
      setTransactions(INITIAL_TRANSACTIONS);
    }
  }, []);

  // Sync data
  useEffect(() => {
    localStorage.setItem('zenwallet_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = useCallback((data: {
    amount: number;
    type: TransactionType;
    category: string;
    note: string;
    date: string;
  }) => {
    const newTransaction: Transaction = {
      ...data,
      id: crypto.randomUUID(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 max-w-md mx-auto relative overflow-hidden flex flex-col">
      {/* Top Header/Status area (Native feel) */}
      <header className="pt-12 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-black rounded-[2px]" />
          </div>
          <span className="font-bold text-lg tracking-tight">ZenWallet</span>
        </div>
        <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400">
          <Settings size={20} />
        </button>
      </header>

      {/* Main Scrollable Content */}
      <main className="flex-1 overflow-y-auto hide-scrollbar pt-4">
        {activeTab === 'dashboard' ? (
          <Dashboard transactions={transactions} />
        ) : (
          <TransactionList transactions={transactions} />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-900 px-6 py-4 pb-8 flex justify-between items-center z-40">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'dashboard' ? 'text-emerald-500' : 'text-zinc-500'}`}
        >
          <LayoutGrid size={24} strokeWidth={activeTab === 'dashboard' ? 2.5 : 2} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Dash</span>
        </button>

        {/* Center FAB */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-500 text-black p-4 rounded-3xl -mt-12 shadow-xl shadow-emerald-500/20 active:scale-90 transition-transform flex items-center justify-center"
        >
          <Plus size={28} strokeWidth={3} />
        </button>

        <button 
          onClick={() => setActiveTab('transactions')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'transactions' ? 'text-emerald-500' : 'text-zinc-500'}`}
        >
          <List size={24} strokeWidth={activeTab === 'transactions' ? 2.5 : 2} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Log</span>
        </button>
      </nav>

      {/* Modal Layer */}
      {isModalOpen && (
        <TransactionForm 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={addTransaction} 
        />
      )}
    </div>
  );
};

export default App;
