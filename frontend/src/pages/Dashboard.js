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
    try {
      await axios.post('/transactions', transactionData);
      fetchData();
      setShowForm(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout', error);
      alert('Erreur lors de l\'ajout de la transaction');
    }
  };

  const handleUpdateTransaction = async (id, transactionData) => {
    try {
      await axios.put(`/transactions/${id}`, transactionData);
      fetchData();
      setEditingTransaction(null);
    } catch (error) {
      console.error('Erreur lors de la modification', error);
      alert('Erreur lors de la modification');
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      try {
        await axios.delete(`/transactions/${id}`);
        fetchData();
      } catch (error) {
        console.error('Erreur lors de la suppression', error);
        alert('Erreur lors de la suppression');
      }
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>💰 Finance Tracker</h1>
          <div className="user-info">
            <span>Bonjour, {user?.name}</span>
            <button onClick={logout} className="btn-logout">
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Summary Cards */}
        <Summary summary={summary} />

        {/* Add Transaction Button */}
        <div className="action-bar">
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="btn-add-transaction"
          >
            {showForm ? '✕ Fermer' : '+ Nouvelle Transaction'}
          </button>
        </div>

        {/* Transaction Form */}
        {showForm && (
          <TransactionForm
            onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
            onCancel={handleCloseForm}
            transaction={editingTransaction}
          />
        )}

        {/* Chart and Transaction List */}
        <div className="dashboard-grid">
          <div className="chart-section">
            <Chart summary={summary} />
          </div>
          
          <div className="transactions-section">
            <TransactionList
              transactions={transactions}
              onEdit={handleEdit}
              onDelete={handleDeleteTransaction}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
