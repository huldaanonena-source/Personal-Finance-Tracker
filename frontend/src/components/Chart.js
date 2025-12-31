import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import './Chart.css';

// Enregistrer les composants Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const Chart = ({ summary }) => {
  const expensesByCategory = summary.expensesByCategory || {};
  
  const hasData = Object.keys(expensesByCategory).length > 0;

  const data = {
    labels: Object.keys(expensesByCategory),
    datasets: [
      {
        label: 'Dépenses par catégorie',
        data: Object.values(expensesByCategory),
        backgroundColor: [
          '#667eea',
          '#764ba2',
          '#f093fb',
          '#4facfe',
          '#43e97b',
          '#fa709a',
          '#fee140',
          '#30cfd0'
        ],
        borderColor: '#fff',
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <h3>Répartition des dépenses</h3>
      
      {hasData ? (
        <div className="chart-wrapper">
          <Pie data={data} options={options} />
        </div>
      ) : (
        <div className="chart-empty">
          <p>📊</p>
          <span>Aucune dépense enregistrée</span>
          <small>Ajoutez des transactions pour voir la répartition</small>
        </div>
      )}
    </div>
  );
};

export default Chart;
