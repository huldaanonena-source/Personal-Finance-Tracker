import React, { useState, useEffect } from 'react';
import './TransactionForm.css';

const TransactionForm = ({ onSubmit, onCancel, transaction }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Other Income'];
  const expenseCategories = [
    'Food', 'Rent', 'Transport', 'Entertainment', 
    'Health', 'Shopping', 'Bills', 'Other Expense'
  ];

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        category: transaction.category,
        amount: transaction.amount,
        description: transaction.description || '',
        date: new Date(transaction.date).toISOString().split('T')[0]
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Réinitialiser la catégorie si on change de type
      ...(name === 'type' && { category: '' })
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.amount) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const dataToSubmit = {
      ...formData,
      amount: parseFloat(formData.amount)
    };

    if (transaction) {
      onSubmit(transaction._id, dataToSubmit);
    } else {
      onSubmit(dataToSubmit);
    }

    // Réinitialiser le formulaire
    setFormData({
      type: 'expense',
      category: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const categories = formData.type === 'income' ? incomeCategories : expenseCategories;

  return (
    <div className="transaction-form-container">
      <form onSubmit={handleSubmit} className="transaction-form">
        <h3>{transaction ? 'Modifier la transaction' : 'Nouvelle transaction'}</h3>

        <div className="form-row">
          <div className="form-group">
            <label>Type *</label>
            <select 
              name="type" 
              value={formData.type} 
              onChange={handleChange}
              required
            >
              <option value="expense">Dépense</option>
              <option value="income">Revenu</option>
            </select>
          </div>

          <div className="form-group">
            <label>Catégorie *</label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner...</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Montant ($) *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description (optionnelle)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Ajouter une note..."
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            {transaction ? 'Modifier' : 'Ajouter'}
          </button>
          <button type="button" onClick={onCancel} className="btn-cancel">
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
