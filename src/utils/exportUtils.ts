import type { Transaction } from '../types';
import { format } from 'date-fns';

export const exportToCSV = (transactions: Transaction[], filename: string = 'thrive-transactions.csv') => {
  if (transactions.length === 0) {
    alert('No transactions to export');
    return;
  }

  // Define CSV headers
  const headers = [
    'Date',
    'Description',
    'Category',
    'Type',
    'Amount',
    'Fraud Flagged',
    'Created At',
  ];

  // Convert transactions to CSV rows
  const rows = transactions.map(t => [
    format(new Date(t.date), 'yyyy-MM-dd'),
    `"${t.description.replace(/"/g, '""')}"`, // Escape quotes
    t.category,
    t.type,
    t.amount.toFixed(2),
    t.is_fraud_flagged ? 'Yes' : 'No',
    format(new Date(t.created_at), 'yyyy-MM-dd HH:mm:ss'),
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

export const exportFilteredToCSV = (
  transactions: Transaction[],
  startDate?: string,
  endDate?: string,
  type?: 'income' | 'expense'
) => {
  let filtered = transactions;

  // Filter by date range
  if (startDate) {
    filtered = filtered.filter(t => new Date(t.date) >= new Date(startDate));
  }
  if (endDate) {
    filtered = filtered.filter(t => new Date(t.date) <= new Date(endDate));
  }

  // Filter by type
  if (type) {
    filtered = filtered.filter(t => t.type === type);
  }

  const filename = `thrive-${type || 'all'}-${startDate || 'all'}-to-${endDate || 'all'}.csv`;
  exportToCSV(filtered, filename);
};