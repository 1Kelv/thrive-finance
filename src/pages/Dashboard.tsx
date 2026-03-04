import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { TransactionList } from '../components/transactions/TransactionList';
import { CategoryPieChart } from '../components/dashboard/CategoryPieChart';
import { MonthlyTrendsChart } from '../components/dashboard/MonthlyTrendsChart';
import { FraudAlert } from '../components/dashboard/FraudAlert';
import { RiskScoreCard } from '../components/dashboard/RiskScoreCard';
import { transactionService } from '../services/transactionService';
import { getCategoryBreakdown, getMonthlyTrends } from '../utils/chartUtils';
import { calculateUserRiskScore } from '../utils/fraudDetection';
import type { Transaction, TransactionFormData } from '../types';
import { exportToCSV } from '../utils/exportUtils';
import { BudgetCard } from '../components/dashboard/BudgetCard';
import { BudgetForm } from '../components/dashboard/BudgetForm';
import { budgetService } from '../services/budgetService';
import { getAllBudgetProgress } from '../utils/budgetUtils';
import type { Budget, BudgetFormData } from '../types';
import { useSessionTimeout } from '../hooks/useSessionTimeout';
import { FraudDetailModal } from '../components/dashboard/FraudDetailModal.tsx';

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [selectedFraudTransaction, setSelectedFraudTransaction] = useState<Transaction | null>(null);

  useSessionTimeout(10); // 10 minute timeout


  // Load transactions on mount
  useEffect(() => {
    if (user) {
      loadTransactions();
      loadBudgets();
    }
  }, [user]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionService.getTransactions(user!.id);
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBudgets = async () => {
  try {
    const data = await budgetService.getBudgets(user!.id);
    setBudgets(data);
  } catch (error) {
    console.error('Error loading budgets:', error);
  }
};

const handleCreateBudget = async (budget: BudgetFormData) => {
  try {
    await budgetService.createBudget(user!.id, budget);
    await loadBudgets();
    setShowBudgetForm(false);
    setEditingBudget(null);
  } catch (error) {
    console.error('Error creating budget:', error);
    throw error;
  }
};

const handleUpdateBudget = async (budget: BudgetFormData) => {
  if (!editingBudget) return;
  
  try {
    await budgetService.updateBudget(editingBudget.id, budget);
    await loadBudgets();
    setShowBudgetForm(false);
    setEditingBudget(null);
  } catch (error) {
    console.error('Error updating budget:', error);
    throw error;
  }
};

const handleDeleteBudget = async (id: string) => {
  try {
    await budgetService.deleteBudget(id);
    await loadBudgets();
  } catch (error) {
    console.error('Error deleting budget:', error);
  }
};

  const handleAddTransaction = async (transaction: TransactionFormData) => {
    try {
      await transactionService.createTransaction(user!.id, transaction);
      await loadTransactions();
      setShowForm(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await transactionService.deleteTransaction(id);
      await loadTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleMarkTransactionSafe = async (id: string) => {
  try {
    await transactionService.markTransactionSafe(id);
    await loadTransactions();
  } catch (error) {
    console.error('Error marking transaction as safe:', error);
  }
};

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Calculate totals
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = income - expenses;

  // Calculate chart data
  const expenseCategories = getCategoryBreakdown(transactions, 'expense');
  const incomeCategories = getCategoryBreakdown(transactions, 'income');
  const monthlyTrends = getMonthlyTrends(transactions, 6);

  // Calculate fraud detection data
  const flaggedTransactions = transactions.filter(t => t.is_fraud_flagged);
  const userRiskScore = calculateUserRiskScore(transactions);

  // Calculate budget progress
  const budgetProgressList = getAllBudgetProgress(budgets, transactions);

  const formatCurrency = (amount: number) => {
    const userCurrency = user?.user_metadata?.currency || 'GBP';
    
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: userCurrency,
    }).format(amount);
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        background: 'var(--color-bg-primary)',
        borderBottom: '1px solid var(--color-border)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div 
  onClick={() => navigate('/dashboard')} 
  style={{ cursor: 'pointer' }}
>
  <Logo size={40} showText={true} />
</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={() => navigate('/settings')}
            className="btn btn-outline"
            style={{ fontSize: '1.25rem', padding: '0.5rem 0.75rem' }}
          >
            ⚙️
          </button>
          <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
            {user?.email}
          </span>
          <button onClick={handleSignOut} className="btn btn-outline">
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '2rem' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: 700,
                marginBottom: '0.5rem',
                color: 'var(--color-text-primary)',
              }}>
                Welcome back, {user?.user_metadata?.full_name || 'there'}! 👋
              </h1>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Here's your financial overview
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {transactions.length > 0 && (
                <button 
                  onClick={() => exportToCSV(transactions)}
                  className="btn btn-outline"
                >
                  📥 Export CSV
                </button>
              )}
              <button 
                onClick={() => setShowForm(!showForm)} 
                className="btn btn-primary"
              >
                {showForm ? 'Cancel' : '+ Add Transaction'}
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}>
            <div className="card">
              <h3 style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                Total Balance
              </h3>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {formatCurrency(balance)}
              </p>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                Income
              </h3>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-success)' }}>
                {formatCurrency(income)}
              </p>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                Expenses
              </h3>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-danger)' }}>
                {formatCurrency(expenses)}
              </p>
            </div>

            {/* Risk Score Card */}
            {transactions.length > 0 && (
              <RiskScoreCard
                score={userRiskScore.score}
                level={userRiskScore.level}
                flaggedCount={userRiskScore.flaggedCount}
                totalCount={transactions.length}
              />
            )}
          </div>

          {/* Fraud Alert */}
{flaggedTransactions.length > 0 && (
  <FraudAlert
    flaggedTransactions={flaggedTransactions}
    onReview={(id) => {
      const transaction = transactions.find(t => t.id === id);
      if (transaction) {
        setSelectedFraudTransaction(transaction);
      }
    }}
  />
)}

          {/* Transaction Form */}
          {showForm && (
            <div style={{ marginBottom: '2rem' }}>
              <TransactionForm 
                onSubmit={handleAddTransaction}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}

          {/* Transaction List */}
          <div style={{ marginBottom: '2rem' }}>
            <TransactionList 
              transactions={transactions}
              onDelete={handleDeleteTransaction}
              loading={loading}
            />
          </div>

          {/* Charts Section */}
          {transactions.length > 0 ? (
            <>
              {/* Monthly Trends */}
              <div style={{ marginBottom: '2rem' }}>
                <MonthlyTrendsChart data={monthlyTrends} />
              </div>

              {/* Category Breakdowns */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '1.5rem',
              }}>
                <CategoryPieChart 
                  data={expenseCategories}
                  title="Expenses by Category"
                  type="expense"
                />
                <CategoryPieChart 
                  data={incomeCategories}
                  title="Income by Category"
                  type="income"
                />
              </div>
            </>
          ) : (
            !loading && transactions.length === 0 && (
              <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                  Add transactions to see insights! 📊
                </h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Your charts and trends will appear here once you add some transactions.
                </p>
              </div>
            )
          )}

          {/* Budgets Section */}
          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '2px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Budget Goals 🎯
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                  Set spending limits and track your progress
                </p>
              </div>
              <button 
                onClick={() => {
                  setEditingBudget(null);
                  setShowBudgetForm(!showBudgetForm);
                }} 
                className="btn btn-primary"
              >
                {showBudgetForm ? 'Cancel' : '+ Add Budget'}
              </button>
            </div>

            {/* Budget Form */}
            {showBudgetForm && (
              <div style={{ marginBottom: '2rem' }}>
                <BudgetForm 
                  onSubmit={editingBudget ? handleUpdateBudget : handleCreateBudget}
                  onCancel={() => {
                    setShowBudgetForm(false);
                    setEditingBudget(null);
                  }}
                  initialData={editingBudget ? {
                    category: editingBudget.category,
                    amount: editingBudget.amount,
                    period: editingBudget.period,
                  } : undefined}
                />
              </div>
            )}

            {/* Budget Cards */}
            {budgetProgressList.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem',
              }}>
                {budgetProgressList.map((budgetProgress) => (
                  <BudgetCard
                    key={budgetProgress.budget.id}
                    budgetProgress={budgetProgress}
                    onEdit={(id) => {
                      const budget = budgets.find(b => b.id === id);
                      if (budget) {
                        setEditingBudget(budget);
                        setShowBudgetForm(true);
                      }
                    }}
                    onDelete={handleDeleteBudget}
                    formatCurrency={formatCurrency}
                  />
                ))}
              </div>
            ) : (
              !showBudgetForm && (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                  <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</p>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    No budgets set yet
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                    Create your first budget to start tracking your spending goals
                  </p>
                  <button 
                    onClick={() => setShowBudgetForm(true)}
                    className="btn btn-primary"
                  >
                    Create Your First Budget
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </main>
      {/* Fraud Detail Modal */}
      {selectedFraudTransaction && (
        <FraudDetailModal 
          transaction={selectedFraudTransaction}
          allTransactions={transactions}
          onClose={() => setSelectedFraudTransaction(null)}
          onDelete={handleDeleteTransaction}
          onMarkSafe={handleMarkTransactionSafe}
          formatCurrency={formatCurrency}
        />
      )}
    </div>
  );
};