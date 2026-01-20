
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  LayoutGrid, 
  List, 
  Plus, 
  Settings, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  X,
  Ghost,
  ChevronRight,
  Wallet
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  ResponsiveContainer, 
  XAxis, 
  Tooltip, 
  Cell 
} from 'recharts';

import { Transaction, TransactionType, DailySpending } from './types';
import { CATEGORIES, INITIAL_TRANSACTIONS } from './constants';
import { formatCurrency, formatDateLabel } from './utils/formatters';
import { Icon } from './components/Icon';

// --- UI Sub-components ---

const BottomSheet = ({ onClose, onSubmit }: { onClose: () => void, onSubmit: (data: any) => void }) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('other');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(parseFloat(amount))) return;
    onSubmit({
      amount: parseFloat(amount),
      type,
      category,
      note: note || CATEGORIES[category].name,
      date: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="w-full max-w-md bg-zinc-900 border-t border-zinc-800 rounded-t-[3rem] shadow-2xl z-10 animate-slide-up">
        <div className="p-1.5 flex justify-center">
          <div className="w-12 h-1.5 bg-zinc-800 rounded-full mt-2 opacity-50" />
        </div>
        
        <div className="p-8 pt-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black tracking-tight">Nuova Voce</h2>
            <button onClick={onClose} className="p-2.5 bg-zinc-800 rounded-full text-zinc-400 active:scale-90 transition-transform">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex p-1.5 bg-zinc-800/50 rounded-2xl">
              {(['expense', 'income'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all capitalize ${
                    type === t ? 'bg-zinc-700 text-white shadow-xl' : 'text-zinc-500'
                  }`}
                >
                  {t === 'expense' ? 'Uscita' : 'Entrata'}
                </button>
              ))}
            </div>

            <div className="text-center">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Importo</p>
              <div className="flex items-center justify-center gap-1 group">
                <span className="text-3xl font-bold text-zinc-600 group-focus-within:text-emerald-500 transition-colors">$</span>
                <input
                  autoFocus
                  type="number"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-transparent text-6xl font-black text-white w-full max-w-[220px] text-center outline-none placeholder:text-zinc-800"
                />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Categoria</p>
              <div className="grid grid-cols-4 gap-3">
                {Object.values(CATEGORIES).slice(0, 8).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border-2 ${
                      category === cat.id ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-zinc-800/30 border-transparent active:scale-90'
                    }`}
                  >
                    <div className={`p-2.5 rounded-full ${cat.color} bg-opacity-20 text-white`}>
                      <Icon name={cat.icon} size={18} />
                    </div>
                    <span className="text-[9px] font-black text-zinc-500 truncate w-full text-center uppercase tracking-tighter">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black py-5 rounded-[2rem] text-lg transition-all transform active:scale-95 shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)] mb-2"
            >
              Conferma
            </button>
          </form>
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem('zenwallet_transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const chartData = useMemo(() => {
    const last7Days: DailySpending[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toLocaleDateString('it-IT', { weekday: 'short' });
      const amount = transactions
        .filter(t => t.type === 'expense' && new Date(t.date).toDateString() === d.toDateString())
        .reduce((acc, t) => acc + t.amount, 0);
      last7Days.push({ day: dayStr, amount });
    }
    return last7Days;
  }, [transactions]);

  const addTransaction = useCallback((data: any) => {
    const newTransaction: Transaction = {
      ...data,
      id: crypto.randomUUID(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  }, []);

  const groupedTransactions = useMemo(() => {
    return transactions.reduce((groups, item) => {
      const label = formatDateLabel(item.date);
      if (!groups[label]) groups[label] = [];
      groups[label].push(item);
      return groups;
    }, {} as Record<string, Transaction[]>);
  }, [transactions]);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col overflow-hidden max-w-md mx-auto relative border-x border-zinc-900/50">
      
      {/* Glow di sfondo premium */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header fisso con blur */}
      <header className="fixed top-0 left-0 right-0 max-w-md mx-auto px-8 pt-[calc(env(safe-area-inset-top,1rem)+1rem)] pb-4 bg-zinc-950/80 backdrop-blur-xl z-50 flex justify-between items-center border-b border-zinc-900/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800">
            <Wallet size={18} className="text-emerald-500" />
          </div>
          <span className="font-black text-lg tracking-tight">ZenWallet</span>
        </div>
        <button className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 active:scale-90 transition-transform">
          <Settings size={18} />
        </button>
      </header>

      {/* Area Contenuto Scorribile */}
      <main className="flex-1 overflow-y-auto hide-scrollbar pt-[calc(env(safe-area-inset-top,1rem)+4.5rem)] pb-32">
        {activeTab === 'dashboard' ? (
          <div className="space-y-10 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Sezione Saldo */}
            <div className="text-center py-6">
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Patrimonio Totale</p>
              <h1 className="text-6xl font-black tracking-tighter text-white">
                {formatCurrency(stats.balance).split('.')[0]}
                <span className="text-2xl text-zinc-600">.{formatCurrency(stats.balance).split('.')[1]}</span>
              </h1>
            </div>

            {/* Bento Grid Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900/40 border border-zinc-800/60 p-5 rounded-[2.5rem] flex flex-col justify-between aspect-square active:scale-95 transition-all">
                <div className="flex justify-between items-center mb-6">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl">
                    <TrendingUp size={22} className="text-emerald-500" />
                  </div>
                  <ChevronRight size={14} className="text-zinc-700" />
                </div>
                <div>
                  <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-1">Entrate</p>
                  <p className="text-xl font-black text-emerald-400">{formatCurrency(stats.income)}</p>
                </div>
              </div>

              <div className="bg-zinc-900/40 border border-zinc-800/60 p-5 rounded-[2.5rem] flex flex-col justify-between aspect-square active:scale-95 transition-all">
                <div className="flex justify-between items-center mb-6">
                  <div className="p-3 bg-rose-500/10 rounded-2xl">
                    <TrendingDown size={22} className="text-rose-500" />
                  </div>
                  <ChevronRight size={14} className="text-zinc-700" />
                </div>
                <div>
                  <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-1">Uscite</p>
                  <p className="text-xl font-black text-rose-400">{formatCurrency(stats.expense)}</p>
                </div>
              </div>

              {/* Grafico Settimanale */}
              <div className="col-span-2 bg-zinc-900/40 border border-zinc-800/60 p-8 rounded-[3rem]">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-black text-sm uppercase tracking-widest text-zinc-400">Trend Spese</h3>
                  <div className="px-3 py-1 bg-zinc-800/80 rounded-full border border-zinc-700 text-[9px] font-black text-zinc-500 uppercase tracking-widest">7 Giorni</div>
                </div>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 10, fontWeight: 800 }} dy={10} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 12 }}
                        contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '16px', fontSize: '12px' }}
                        itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                        labelStyle={{ display: 'none' }}
                        formatter={(v: any) => [formatCurrency(v), '']}
                      />
                      <Bar dataKey="amount" radius={[10, 10, 10, 10]} barSize={28}>
                        {chartData.map((_, i) => (
                          <Cell key={`cell-${i}`} fill={i === 6 ? '#10b981' : '#27272a'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-6 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {Object.keys(groupedTransactions).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-zinc-700 space-y-4">
                <Ghost size={48} strokeWidth={1.5} className="opacity-20" />
                <p className="font-black text-xs uppercase tracking-widest">Nessuna transazione</p>
              </div>
            ) : (
              Object.keys(groupedTransactions).map((label) => (
                <div key={label} className="space-y-4">
                  <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] ml-2 mb-4">{label}</h4>
                  <div className="space-y-3">
                    {groupedTransactions[label].map((t) => {
                      const cat = CATEGORIES[t.category] || CATEGORIES.other;
                      return (
                        <div key={t.id} className="flex items-center justify-between p-5 bg-zinc-900/20 border border-zinc-900/40 rounded-[2rem] active:scale-95 transition-all">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl ${cat.color} bg-opacity-20 text-white`}>
                              <Icon name={cat.icon} size={18} />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-zinc-100">{t.note}</p>
                              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{cat.name}</p>
                            </div>
                          </div>
                          <p className={`font-black text-sm tabular-nums ${t.type === 'income' ? 'text-emerald-400' : 'text-zinc-300'}`}>
                            {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Navigazione Inferiore Floattante */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-10 pt-4 pb-[calc(env(safe-area-inset-bottom,1.5rem)+1.5rem)] bg-zinc-950/90 backdrop-blur-2xl border-t border-zinc-900/50 flex justify-between items-center z-[90]">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'dashboard' ? 'text-emerald-500' : 'text-zinc-600 active:scale-90'}`}>
          <LayoutGrid size={24} strokeWidth={activeTab === 'dashboard' ? 3 : 2} />
          <span className="text-[9px] font-black uppercase tracking-widest">Home</span>
        </button>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-500 text-zinc-950 p-5 rounded-full -mt-16 shadow-[0_20px_40px_-10px_rgba(16,185,129,0.5)] active:scale-90 transition-all"
        >
          <Plus size={32} strokeWidth={4} />
        </button>

        <button onClick={() => setActiveTab('transactions')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'transactions' ? 'text-emerald-500' : 'text-zinc-600 active:scale-90'}`}>
          <List size={24} strokeWidth={activeTab === 'transactions' ? 3 : 2} />
          <span className="text-[9px] font-black uppercase tracking-widest">Lista</span>
        </button>
      </nav>

      {isModalOpen && <BottomSheet onClose={() => setIsModalOpen(false)} onSubmit={addTransaction} />}
    </div>
  );
};

export default App;
