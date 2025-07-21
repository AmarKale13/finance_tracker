// src/components/TransactionList.jsx
import React from 'react';
import TransactionCard from './TransactionCard';
import { deleteTransaction } from '../services/TransactionService';
import './TransactionList.css';

export default function TransactionList({ items, refresh }) {
  const handleDelete = async id => {
    try {
      await deleteTransaction(id);
      refresh();   // re‑fetch the updated list
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div className="transaction-cards-container">
      {items.map(tx => (
        <TransactionCard
          key={tx._id}
          date={tx.date}
          category={tx.category}
          note={tx.note}
          amount={tx.type === 'expense' ? -tx.amount : tx.amount}
          onDelete={() => handleDelete(tx._id)}
        />
      ))}
    </div>
  );
}
