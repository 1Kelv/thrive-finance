import React from 'react';
import type { Transaction } from '../../types';
import { analyzeTransaction } from '../../utils/fraudDetection';

interface FraudDetailModalProps {
  transaction: Transaction;
  allTransactions: Transaction[];
  onClose: () => void;
  onDelete: (id: string) => void;
  onMarkSafe: (id: string) => void;
  formatCurrency: (amount: number) => string;
}

export const FraudDetailModal: React.FC<FraudDetailModalProps> = ({
  transaction,
  allTransactions,
  onClose,
  onDelete,
  onMarkSafe,
  formatCurrency,
}) => {
  const analysis = analyzeTransaction(transaction, allTransactions);

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low': return '#f59e0b';
      case 'medium': return '#f97316';
      case 'high': return '#ef4444';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
    }}>
      <div className="card" style={{
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '2px solid var(--color-border)',
        }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#ef4444' }}>
              🚨 Fraud Analysis Report
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Transaction ID: {transaction.id.slice(0, 8)}...
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem',
              background: 'transparent',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
            }}
          >
            ✕
          </button>
        </div>

        {/* Transaction Details */}
        <div style={{
          padding: '1rem',
          backgroundColor: '#fef2f2',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
            Transaction Details
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Description</p>
              <p style={{ fontWeight: 600 }}>{transaction.description}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Amount</p>
              <p style={{ fontWeight: 600, color: '#ef4444' }}>{formatCurrency(transaction.amount)}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Category</p>
              <p style={{ fontWeight: 600 }}>{transaction.category}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Date</p>
              <p style={{ fontWeight: 600 }}>{new Date(transaction.date).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Risk Score */}
        <div style={{
          padding: '1rem',
          backgroundColor: analysis.riskScore >= 70 ? '#fee2e2' : analysis.riskScore >= 40 ? '#fef3c7' : '#dbeafe',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
            Fraud Risk Score
          </p>
          <p style={{
            fontSize: '3rem',
            fontWeight: 700,
            color: analysis.riskScore >= 70 ? '#dc2626' : analysis.riskScore >= 40 ? '#d97706' : '#2563eb',
          }}>
            {analysis.riskScore}
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            out of 100
          </p>
        </div>

        {/* Fraud Flags */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
            Detected Issues ({analysis.flags.length})
          </h3>
          {analysis.flags.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {analysis.flags.map((flag, index) => (
                <div
                  key={index}
                  style={{
                    padding: '1rem',
                    border: `2px solid ${getSeverityColor(flag.severity)}`,
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#fff',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      color: getSeverityColor(flag.severity),
                    }}>
                      {flag.severity} Risk
                    </span>
                    <span style={{ fontSize: '1.25rem' }}>
                      {flag.severity === 'high' ? '🚨' : flag.severity === 'medium' ? '⚠️' : '💡'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>
                    {flag.reason}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-secondary)' }}>No issues detected</p>
          )}
        </div>

        {/* Recommendations */}
        <div style={{
          padding: '1rem',
          backgroundColor: '#f0f9ff',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#1e40af' }}>
            💡 Recommendations
          </h3>
          <ul style={{ paddingLeft: '1.5rem', fontSize: '0.875rem', color: '#1e40af' }}>
            <li>Review your recent account activity for unauthorized transactions</li>
            <li>Verify this transaction is legitimate</li>
            {analysis.riskScore >= 50 && (
              <>
                <li>Consider contacting your bank if you don't recognize this charge</li>
                <li>Update your password and enable 2FA if not already active</li>
              </>
            )}
            <li>If unauthorized, delete this transaction and report it</li>
          </ul>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => {
                if (window.confirm('⚠️ Are you sure you want to delete this transaction?\n\nThis action cannot be undone.')) {
                  onDelete(transaction.id);
                  onClose();
                }
              }}
              className="btn"
              style={{
                flex: 1,
                backgroundColor: '#ef4444',
                color: 'white',
              }}
            >
              🗑️ Delete Transaction
            </button>
            <button
              onClick={onClose}
              className="btn btn-outline"
              style={{ flex: 1 }}
            >
              Keep Transaction
            </button>
          </div>

          {/* Mark as Safe Button */}
          <button
            onClick={() => {
              if (window.confirm('✅ Mark this transaction as safe?\n\nThis will remove the fraud flag and the transaction will no longer appear in fraud alerts.')) {
                onMarkSafe(transaction.id);
                onClose();
              }
            }}
            className="btn"
            style={{
              width: '100%',
              backgroundColor: '#10b981',
              color: 'white',
            }}
          >
            ✅ Mark as Safe (Not Fraud)
          </button>
        </div>
      </div>
    </div>
  );
};