import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { MonthlyData } from '../../utils/chartUtils';

interface MonthlyTrendsChartProps {
  data: MonthlyData[];
}

export const MonthlyTrendsChart: React.FC<MonthlyTrendsChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📈</p>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          No monthly data to display
        </p>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      notation: 'compact',
    }).format(value);
  };

  return (
    <div className="card">
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
        Monthly Trends (Last 6 Months)
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis 
            dataKey="month" 
            style={{ fontSize: '0.75rem' }}
            stroke="var(--color-text-secondary)"
          />
          <YAxis 
            tickFormatter={formatCurrency}
            style={{ fontSize: '0.75rem' }}
            stroke="var(--color-text-secondary)"
          />
          <Tooltip 
            formatter={(value: any) => new Intl.NumberFormat('en-GB', {
              style: 'currency',
              currency: 'GBP',
            }).format(Number(value))}
            contentStyle={{
              backgroundColor: 'var(--color-bg-primary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="income" 
            stroke="#10b981" 
            strokeWidth={2}
            name="Income"
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="expense" 
            stroke="#ef4444" 
            strokeWidth={2}
            name="Expenses"
            dot={{ fill: '#ef4444', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="net" 
            stroke="#3b82f6" 
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Net"
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Summary Stats */}
      <div style={{ 
        marginTop: '1.5rem', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--color-border)'
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
            Avg Income
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#10b981' }}>
            {formatCurrency(data.reduce((sum, d) => sum + d.income, 0) / data.length)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
            Avg Expenses
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ef4444' }}>
            {formatCurrency(data.reduce((sum, d) => sum + d.expense, 0) / data.length)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
            Avg Net
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#3b82f6' }}>
            {formatCurrency(data.reduce((sum, d) => sum + d.net, 0) / data.length)}
          </div>
        </div>
      </div>
    </div>
  );
};