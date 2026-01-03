import React from 'react';
import './TransactionList.css';

const TransactionList = ({ transactions, onEdit, onDelete }) => {
  if (!transactions.length) return <p>Aucune transaction pour le moment.</p>;

  return (
    <div className="transaction-list">
      {transactions.map((t) => (
        <div key={t._id} className="transaction-item">
          <div className="transaction-info">
            <span className="transaction-category">{t.category}</span>
            <span className={`transaction-amount ${t.type}`}>
              {t.type === 'expense' ? '-' : '+'}${t.amount.toFixed(2)}
            </span>
          </div>
          <div className="transaction-actions">
            <button onClick={() => onEdit(t)}>Modifier</button>
            <button onClick={() => onDelete(t._id)}>Supprimer</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
