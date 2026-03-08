import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Transaction } from '../../types';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  formatCurrency: (amount: number) => string;
}

export const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  onDelete,
  formatCurrency 
}) => {
  const navigate = useNavigate();

  if (transactions.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</p>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          No transactions yet
        </h3>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Add your first transaction to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '0.75rem',
      }}>
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              backgroundColor: transaction.is_fraud_flagged ? '#fef2f2' : 'var(--color-bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: transaction.is_fraud_flagged ? '1px solid #fecaca' : 'none',
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>
                  {transaction.description}
                </h4>
                {transaction.is_fraud_flagged && (
                  <span style={{ fontSize: '0.75rem' }}>🚨</span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                <span>{transaction.category}</span>
                <span>•</span>
                <span>{new Date(transaction.date).toLocaleDateString()}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: transaction.type === 'income' ? 'var(--color-success)' : 'var(--color-danger)',
              }}>
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </span>
              <button
                onClick={() => navigate(`/transaction/edit/${transaction.id}`)}
                style={{
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.875rem',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-primary)',
                }}
                title="Edit transaction"
              >
                ✏️
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Delete this transaction?')) {
                    onDelete(transaction.id);
                  }
                }}
                style={{
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.875rem',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-danger)',
                }}
                title="Delete transaction"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};