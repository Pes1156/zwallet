
import React from 'react';
import { Transaction } from '../types';
import { CATEGORIES } from '../constants';
import { Icon } from './Icon';
import { formatCurrency, formatDateLabel } from '../utils/formatters';

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const grouped = transactions.reduce((groups, item) => {
    const label = formatDateLabel(item.date);
    if (!groups[label]) groups[label] = [];
    groups[label].push(item);
    return groups;
  }, {} as Record<string, Transaction[]>);

  const sortedGroups = Object.keys(grouped).sort((a, b) => {
    if (a === 'Today') return -1;
    if (b === 'Today') return 1;
    if (a === 'Yesterday') return -1;
    if (b === 'Yesterday') return 1;
    return 0;
  });

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
        <Icon name="Ghost" size={48} className="mb-4 opacity-20" />
        <p>No transactions yet.</p>
      </div>
    );
  }

  return (
    <div className="px-4 space-y-8 pb-32">
      {sortedGroups.map((groupLabel) => (
        <div key={groupLabel}>
          <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4 px-2">
            {groupLabel}
          </h4>
          <div className="space-y-3">
            {grouped[groupLabel].map((t) => {
              const category = CATEGORIES[t.category] || CATEGORIES.other;
              return (
                <div 
                  key={t.id}
                  className="flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${category.color} bg-opacity-20 text-white`}>
                      <Icon name={category.icon} size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t.note}</p>
                      <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">{category.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-zinc-200'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
