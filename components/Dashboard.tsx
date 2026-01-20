
import React, { useMemo } from 'react';
import { Transaction, DailySpending } from '../types';
import { formatCurrency } from '../utils/formatters';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface DashboardProps {
  transactions: Transaction[];
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const stats = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const chartData = useMemo(() => {
    const last7Days: DailySpending[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
      const amount = transactions
        .filter(t => t.type === 'expense' && new Date(t.date).toDateString() === d.toDateString())
        .reduce((acc, t) => acc + t.amount, 0);
      last7Days.push({ day: dayStr, amount });
    }
    return last7Days;
  }, [transactions]);

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-700">
      {/* Main Balance Header */}
      <div className="text-center py-8">
        <p className="text-zinc-500 text-sm font-medium mb-1">Total Balance</p>
        <h1 className="text-5xl font-bold tracking-tight">
          {formatCurrency(stats.balance)}
        </h1>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-2 gap-4 px-4">
        {/* Income Card */}
        <div className="bento-card bg-zinc-900/50 border border-zinc-800 p-5 rounded-[2rem] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-emerald-500/10 rounded-2xl">
              <TrendingUp size={24} className="text-emerald-500" />
            </div>
            <ArrowUpRight size={18} className="text-zinc-600" />
          </div>
          <div>
            <p className="text-zinc-500 text-sm font-medium">Income</p>
            <p className="text-xl font-bold text-emerald-400">{formatCurrency(stats.income)}</p>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="bento-card bg-zinc-900/50 border border-zinc-800 p-5 rounded-[2rem] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-rose-500/10 rounded-2xl">
              <TrendingDown size={24} className="text-rose-500" />
            </div>
            <ArrowDownRight size={18} className="text-zinc-600" />
          </div>
          <div>
            <p className="text-zinc-500 text-sm font-medium">Expenses</p>
            <p className="text-xl font-bold text-rose-400">{formatCurrency(stats.expense)}</p>
          </div>
        </div>

        {/* Chart Card */}
        <div className="col-span-2 bento-card bg-zinc-900/50 border border-zinc-800 p-6 rounded-[2rem]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Weekly Spends</h3>
            <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded-full uppercase tracking-widest font-bold">Last 7 Days</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 12 }}
                  dy={10}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ 
                    backgroundColor: '#18181b', 
                    border: '1px solid #27272a', 
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ display: 'none' }}
                  formatter={(value: number) => [formatCurrency(value), 'Spent']}
                />
                <Bar dataKey="amount" radius={[8, 8, 8, 8]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === chartData.length - 1 ? '#10b981' : '#3f3f46'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
