import React, { useState, useEffect } from 'react';
import { addTransaction } from '../services/TransactionService';
import './TransactionForm.css';

export default function TransactionForm({ refresh, prefill }) {
  const [form, setForm] = useState({
    amount: '',
    type: 'expense',
    category: '',
    note: '',
    date: new Date().toISOString().slice(0, 10)
  });

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    await addTransaction({
      ...form,
      amount: parseFloat(form.amount)
    });
    setForm(prev => ({
      ...prev,
      amount: '',
      category: '',
      note: '',
      date: new Date().toISOString().slice(0, 10)
    }));
    refresh();
  };

  useEffect(() => {
    setForm(f => ({
      ...f,
      ...Object.fromEntries(
        Object.entries(prefill).filter(([k, v]) => v != null && v !== '')
      )
    }));
  }, [prefill]);

  return (
    <form className="transaction-form" onSubmit={onSubmit}>
      <div className="tf-row">
        <div className="tf-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={onChange}
            required
          />
        </div>
        <div className="tf-group">
          <label>Amount (₹)</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={onChange}
            placeholder="e.g. 1200"
            required
          />
        </div>
      </div>

      <div className="tf-row">
        <div className="tf-group">
          <label>Type</label>
          <select name="type" value={form.type} onChange={onChange}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div className="tf-group">
          <label>Category</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={onChange}
            placeholder="e.g. Food, Salary"
          />
        </div>
      </div>

      <div className="tf-group">
        <label>Note</label>
        <input
          type="text"
          name="note"
          value={form.note}
          onChange={onChange}
          placeholder="Optional description"
        />
      </div>

      <button type="submit" className="tf-submit">
        + Add Transaction
      </button>
    </form>
  );
}
