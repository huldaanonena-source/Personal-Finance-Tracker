import React, { useState, useEffect } from 'react';

const TransactionForm = ({ onSubmit, onCancel, transaction }) => {
  const [type, setType] = useState('income');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setCategory(transaction.category);
      setAmount(transaction.amount);
      setDescription(transaction.description);
    }
  }, [transaction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ type, category, amount: parseFloat(amount), description });
  };

  return (
    <form onSubmit={handleSubmit}>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="income">Revenu</option>
        <option value="expense">Dépense</option>
      </select>

      <input
        type="text"
        placeholder="Catégorie"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Montant"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button type="submit">Enregistrer</button>
      <button type="button" onClick={onCancel}>Annuler</button>
    </form>
  );
};

export default TransactionForm;
