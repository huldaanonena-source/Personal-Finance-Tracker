import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from '../utils/axios';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import Summary from '../components/Summary';
import Chart from '../components/Chart';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    expensesByCategory: {}
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transactionsRes, summaryRes] = await Promise.all([
        axios.get('/transactions'),
        axios.get('/transactions/summary')
      ]);
      setTransactions(transactionsRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      console.error('Erreur lors du chargement des données', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (transactionData) => {
    await axios.post('/transactions', transactionData);
    fetchData();
    setShowForm(false);
  };

  const handleUpdateTransaction = async (id, transactionData) => {
    await axios.put(`/transactions/${id}`, transactionData);
    fetchData();
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      await axios.delete(`/transactions/${id}`);
      fetchData();
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>💰 Finance Tracker</h1>
        <div>
          <span>Bonjour, {user?.name}</span>
          <button onClick={logout}>Déconnexion</button>
        </div>
      </header>

      <Summary summary={summary} />

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? '✕ Fermer' : '+ Nouvelle Transaction'}
      </button>

      {showForm && (
        <TransactionForm
          onSubmit={
            editingTransaction
              ? (data) => handleUpdateTransaction(editingTransaction._id, data)
              : handleAddTransaction
          }
          onCancel={handleCloseForm}
          transaction={editingTransaction}
        />
      )}

      <div className="dashboard-grid">
        <Chart summary={summary} />
        <TransactionList
          transactions={transactions}
          onEdit={handleEdit}
          onDelete={handleDeleteTransaction}
        />
      </div>
    </div>
  );
};

export default Dashboard;
