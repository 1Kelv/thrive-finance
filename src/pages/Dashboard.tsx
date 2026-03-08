import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from '../components/common/Logo';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { TransactionList } from '../components/transactions/TransactionList';
import { CategoryPieChart } from '../components/dashboard/CategoryPieChart';
import { MonthlyTrendsChart } from '../components/dashboard/MonthlyTrendsChart';
import { FraudAlert } from '../components/dashboard/FraudAlert';
import { RiskScoreCard } from '../components/dashboard/RiskScoreCard';
import { BudgetCard } from '../components/dashboard/BudgetCard';
import { BudgetForm } from '../components/dashboard/BudgetForm';
import { FraudDetailModal } from '../components/dashboard/FraudDetailModal';
import { FeedbackModal } from '../components/common/FeedbackModal';
import { transactionService } from '../services/transactionService';
import { budgetService } from '../services/budgetService';
import { feedbackService } from '../services/feedbackService';
import { getCategoryBreakdown, getMonthlyTrends } from '../utils/chartUtils';
import { calculateUserRiskScore } from '../utils/fraudDetection';
import { getAllBudgetProgress } from '../utils/budgetUtils';
import { exportToCSV } from '../utils/exportUtils';
import { useSessionTimeout } from '../hooks/useSessionTimeout';
import type { Transaction, TransactionFormData, Budget, BudgetFormData } from '../types';
import type { FeedbackData } from '../services/feedbackService';

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Mobile detection
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  
  const [selectedFraudTransaction, setSelectedFraudTransaction] = useState<Transaction | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Session timeout (10 minutes)
  useSessionTimeout(10);

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

  const handleUpdateTransaction = async (transaction: TransactionFormData) => {
    if (!editingTransaction) return;
    
    try {
      await transactionService.updateTransaction(editingTransaction.id, transaction);
      await loadTransactions();
      setShowForm(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error('Error updating transaction:', error);
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

  const handleSubmitFeedback = async (data: FeedbackData) => {
    try {
      await feedbackService.submitFeedback(user!.id, user!.email!, data);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  };

  const handleExportCSV = () => {
    exportToCSV(transactions, 'thrive-transactions.csv');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // Calculate totals
  const balance = transactions.reduce((sum, t) => {
    return t.type === 'income' ? sum + t.amount : sum - t.amount;
  }, 0);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: user?.user_metadata?.currency || 'GBP',
    }).format(amount);
  };

  // Get chart data
  const incomeData = getCategoryBreakdown(
    transactions.filter(t => t.type === 'income'),
    'income'
  );
  const expenseData = getCategoryBreakdown(
    transactions.filter(t => t.type === 'expense'),
    'expense'
  );
  const monthlyTrends = getMonthlyTrends(transactions);

  // Calculate fraud detection data
  const flaggedTransactions = transactions.filter(t => t.is_fraud_flagged);
  const userRiskScore = calculateUserRiskScore(transactions);

  // Calculate budget progress
  const budgetProgressList = getAllBudgetProgress(budgets, transactions);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-secondary)' }}>
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '1rem' : '2rem' }}>
        <div>
          {/* Header */}
          <header style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: '1rem',
            marginBottom: '2rem',
          }}>
            <div 
              onClick={() => navigate('/dashboard')}
              style={{ cursor: 'pointer' }}
            >
              <Logo size={isMobile ? 50 : 60} showText={true} />
            </div>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              width: isMobile ? '100%' : 'auto',
            }}>
              {transactions.length > 0 && (
                <button onClick={handleExportCSV} className="btn btn-outline" style={isMobile ? {} : { width: 'auto' }}>
                  📥 Export CSV
                </button>
              )}
              <button 
                onClick={() => setShowFeedbackModal(true)}
                className="btn btn-outline"
                style={isMobile ? {} : { width: 'auto' }}
              >
                💬 Feedback
              </button>
              <button 
                onClick={() => {
                  setEditingTransaction(null);
                  setShowForm(!showForm);
                }} 
                className="btn btn-primary"
                style={isMobile ? {} : { width: 'auto' }}
              >
                {showForm ? 'Cancel' : '+ Add Transaction'}
              </button>
              <button 
                onClick={() => navigate('/settings')} 
                className="btn btn-outline"
                style={isMobile ? { width: 'auto' } : { width: 'auto', padding: '0.625rem' }}
              >
                ⚙️
              </button>
              <button onClick={handleSignOut} className="btn btn-outline" style={isMobile ? {} : { width: 'auto' }}>
                Sign Out
              </button>
            </div>
          </header>

          {/* Transaction Form */}
          {showForm && (
            <div style={{ marginBottom: '2rem' }}>
              <TransactionForm 
                onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
                onCancel={() => {
                  setShowForm(false);
                  setEditingTransaction(null);
                }}
                initialData={editingTransaction || undefined}
              />
            </div>
          )}

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

          {/* Summary Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}>
            <div className="card">
              <h3 style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                Balance
              </h3>
              <p style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 700, color: balance >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                {formatCurrency(balance)}
              </p>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                Income
              </h3>
              <p style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 700, color: 'var(--color-success)' }}>
                {formatCurrency(totalIncome)}
              </p>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                Expenses
              </h3>
              <p style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 700, color: 'var(--color-danger)' }}>
                {formatCurrency(totalExpenses)}
              </p>
            </div>

            <RiskScoreCard 
              riskScore={userRiskScore.score}
              level={userRiskScore.level}
              flaggedCount={userRiskScore.flaggedCount}
            />
          </div>

          {/* Transactions List */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
              Recent Transactions
            </h2>
            <TransactionList 
              transactions={transactions}
              onDelete={handleDeleteTransaction}
              onEdit={(transaction) => {
                setEditingTransaction(transaction);
                setShowForm(true);
              }}
              formatCurrency={formatCurrency}
            />
          </div>

          {/* Charts */}
          {transactions.length > 0 && (
            <>
              <h2 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                Analytics
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem',
              }}>
                {/* Income Pie Chart */}
                {incomeData.length > 0 && (
                  <CategoryPieChart
                    data={incomeData}
                    title="Income Breakdown"
                    type="income"
                  />
                )}

                {/* Expense Pie Chart */}
                {expenseData.length > 0 && (
                  <CategoryPieChart
                    data={expenseData}
                    title="Expense Breakdown"
                    type="expense"
                  />
                )}
              </div>

              {/* Monthly Trends - Full width */}
              <div style={{ marginBottom: '2rem' }}>
                <MonthlyTrendsChart data={monthlyTrends} />
              </div>
            </>
          )}

          {!transactions.length && !loading && (
            <div className="card" style={{ textAlign: 'center', padding: isMobile ? '2rem' : '3rem' }}>
              <h2 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                Add transactions to see insights! 📊
              </h2>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Your charts and trends will appear here once you add some transactions.
              </p>
            </div>
          )}

          {/* Budgets Section */}
          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '2px solid var(--color-border)' }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between', 
              alignItems: isMobile ? 'flex-start' : 'center', 
              gap: '1rem',
              marginBottom: '2rem' 
            }}>
              <div>
                <h2 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
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
                style={isMobile ? { width: '100%' } : { width: 'auto' }}
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
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
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
                <div className="card" style={{ textAlign: 'center', padding: isMobile ? '2rem' : '3rem' }}>
                  <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</p>
                  <h3 style={{ fontSize: isMobile ? '1.125rem' : '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    No budgets set yet
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                    Create your first budget to start tracking your spending goals
                  </p>
                  <button 
                    onClick={() => setShowBudgetForm(true)}
                    className="btn btn-primary"
                    style={isMobile ? { width: '100%' } : { width: 'auto' }}
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

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <FeedbackModal
          onClose={() => setShowFeedbackModal(false)}
          onSubmit={handleSubmitFeedback}
        />
      )}
    </div>
  );
};