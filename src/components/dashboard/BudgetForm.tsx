import React, { useState } from 'react';
import type { BudgetFormData } from '../../types';

interface BudgetFormProps {
  onSubmit: (budget: BudgetFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: BudgetFormData;
}

export const BudgetForm: React.FC<BudgetFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState<BudgetFormData>(
    initialData || {
      category: '',
      amount: 0,
      period: 'monthly',
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const expenseCategories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Other Expense'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category || !formData.amount) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await onSubmit(formData);
    } catch (err) {
      setError('Failed to save budget');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
        {initialData ? 'Edit Budget' : 'Create Budget'}
      </h2>

      {error && (
        <div style={{
          padding: '0.75rem',
          marginBottom: '1rem',
          backgroundColor: '#fee',
          color: '#c33',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.875rem',
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Category */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="category" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
            Category *
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.625rem',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              backgroundColor: 'white',
            }}
          >
            <option value="">Select a category</option>
            {expenseCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="amount" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
            Budget Amount (£) *
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={formData.amount || ''}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
            placeholder="0.00"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.625rem',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
            }}
          />
        </div>

        {/* Period */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
            Period *
          </label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                name="period"
                value="weekly"
                checked={formData.period === 'weekly'}
                onChange={(e) => setFormData({ ...formData, period: e.target.value as 'weekly' | 'monthly' })}
                style={{ marginRight: '0.5rem' }}
              />
              Weekly
            </label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                name="period"
                value="monthly"
                checked={formData.period === 'monthly'}
                onChange={(e) => setFormData({ ...formData, period: e.target.value as 'weekly' | 'monthly' })}
                style={{ marginRight: '0.5rem' }}
              />
              Monthly
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ flex: 1 }}
          >
            {loading ? 'Saving...' : initialData ? 'Update Budget' : 'Create Budget'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="btn btn-outline"
            style={{ flex: 1 }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};