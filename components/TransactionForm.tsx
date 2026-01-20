
import React, { useState } from 'react';
import { TransactionType, Category } from '../types';
import { CATEGORIES } from '../constants';
import { Icon } from './Icon';
import { X } from 'lucide-react';

interface TransactionFormProps {
  onClose: () => void;
  onSubmit: (data: {
    amount: number;
    type: TransactionType;
    category: string;
    note: string;
    date: string;
  }) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, onSubmit }) => {
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div 
        className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">New Transaction</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Toggle */}
            <div className="flex p-1 bg-zinc-800 rounded-xl">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  type === 'expense' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  type === 'income' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Income
              </button>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-medium text-zinc-500">$</span>
                <input
                  autoFocus
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-zinc-800 border-none rounded-2xl py-4 pl-10 pr-4 text-3xl font-semibold focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                />
              </div>
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Category</label>
              <div className="grid grid-cols-4 gap-3">
                {Object.values(CATEGORIES).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all border ${
                      category === cat.id ? 'bg-zinc-800 border-emerald-500/50' : 'bg-transparent border-transparent hover:bg-zinc-800/50'
                    }`}
                  >
                    <div className={`p-2.5 rounded-full ${cat.color} bg-opacity-20 text-white`}>
                      <Icon name={cat.icon} size={20} />
                    </div>
                    <span className="text-[10px] font-medium text-zinc-400">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Note Input */}
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Note</label>
              <input
                type="text"
                placeholder="What was it for?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-zinc-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 rounded-2xl transition-all transform active:scale-[0.98] shadow-lg shadow-emerald-500/20"
            >
              Add Transaction
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
