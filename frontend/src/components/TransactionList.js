import React, { useState } from 'react';
import './TransactionList.css';

const TransactionList = ({ transactions, onEdit, onDelete }) => {
  const [filter, setFilter] = useState('all');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getIcon = (category) => {
    const icons = {
      'Food': '🍔',
      'Rent': '🏠',
      'Transport': '🚗',
      'Entertainment': '🎬',
      'Health': '💊',
      'Shopping': '🛍️',
      'Bills': '📄',
      'Salary': '💼',
      'Freelance': '💻',
      'Investment': '📊',
      'Other Income': '💵',
      'Other Expense': '📦'
    };
    return icons[category] || '💰';
  };

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  return (
    <div className="transaction-list-container">
      <div className="list-header">
        <h3>Historique des transactions</h3>
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            Toutes
          </button>
          <button 
            className={filter === 'income' ? 'active' : ''} 
            onClick={() => setFilter('income')}
          >
            Revenus
          </button>
          <button 
            className={filter === 'expense' ? 'active' : ''} 
            onClick={() => setFilter('expense')}
          >
            Dépenses
          </button>
        </div>
      </div>

      <div className="transactions-list">
        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <p>📭 Aucune transaction trouvée</p>
            <small>Commencez par ajouter votre première transaction</small>
          </div>
        ) : (
          filteredTransactions.map(transaction => (
            <div key={transaction._id} className="transaction-item">
              <div className="transaction-icon">
                {getIcon(transaction.category)}
              </div>
              
              <div className="transaction-details">
                <div className="transaction-category">
                  {transaction.category}
                </div>
                <div className="transaction-description">
                  {transaction.description || 'Aucune description'}
                </div>
                <div className="transaction-date">
                  {formatDate(transaction.date)}
                </div>
              </div>

              <div className="transaction-amount-section">
                <div className={`transaction-amount ${transaction.type}`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </div>
                <div className="transaction-actions">
                  <button 
                    onClick={() => onEdit(transaction)}
                    className="btn-edit"
                    title="Modifier"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => onDelete(transaction._id)}
                    className="btn-delete"
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionList;
