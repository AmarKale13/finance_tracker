// src/components/TransactionCard.jsx
import React from 'react';
import './TransactionCard.css';

export default function TransactionCard({ date, category, note, amount, onDelete }) {
  return (
    <div className="card">
      <div className="card1">
        <button
          className="delete-btn"
          onClick={e => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label="Delete transaction"
        >
          ×
        </button>

        <h3>{new Date(date).toLocaleDateString()}</h3>
        <p className="small">{category || '—'}</p>
        <p>{note || ''}</p>
        <p className="small">
          {amount < 0 ? 'Expense: ' : 'Income: '}₹{Math.abs(amount).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
