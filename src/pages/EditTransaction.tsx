import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from '../components/common/Logo';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { transactionService } from '../services/transactionService';
import type { Transaction, TransactionFormData } from '../types';

export const EditTransaction: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user && id) {
      loadTransaction();
    }
  }, [user, id]);

  const loadTransaction = async () => {
    try {
      setLoading(true);
      const allTransactions = await transactionService.getTransactions(user!.id);
      const foundTransaction = allTransactions.find(t => t.id === id);
      
      if (foundTransaction) {
        setTransaction(foundTransaction);
      } else {
        // Transaction not found, go back to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error loading transaction:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: TransactionFormData) => {
    if (!id) return;
    
    try {
      await transactionService.updateTransaction(id, data);
      setSuccess(true);
      
      // Show success message for 2 seconds then redirect
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: 'var(--color-bg-secondary)',
      }}>
        <p>Loading ⏳...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: 'var(--color-bg-secondary)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div className="card" style={{ 
          maxWidth: '500px', 
          textAlign: 'center',
          padding: '3rem',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Transaction Updated ✅!
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-secondary)' }}>
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <header style={{ marginBottom: '2rem' }}>
          <div 
            onClick={() => navigate('/dashboard')}
            style={{ cursor: 'pointer', display: 'inline-block' }}
          >
            <Logo size={60} showText={true} />
          </div>
        </header>

        {/* Page Title */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            ✍️ Edit Transaction
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Update the details of your transaction
          </p>
        </div>

        {/* Transaction Form */}
        <TransactionForm 
          onSubmit={handleUpdate}
          onCancel={handleCancel}
          initialData={transaction}
        />
      </main>
    </div>
  );
};