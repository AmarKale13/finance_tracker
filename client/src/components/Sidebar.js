// src/components/Sidebar.jsx
import React, { useRef } from 'react';
import { uploadTransactionPDF } from '../services/TransactionService';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ refreshTransactions }) {
  const fileInput = useRef();
  const navigate = useNavigate();

  const onFileChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await uploadTransactionPDF(file);
      alert('Transactions imported!');
      refreshTransactions();        // trigger list reload
      navigate('/transactions');    // switch to transactions view
    } catch (err) {
      console.error(err);
      alert('Failed to import PDF.');
    } finally {
      e.target.value = null;
    }
  };

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">FinTrac</h2>
      <nav>
        <ul className="sidebar-nav">
          <li><a href="/">Dashboard</a></li>
          <li><a href="/transactions">Transactions</a></li>
          <li><a href="/reports">Reports</a></li>
        </ul>
      </nav>

      {/* PDF Upload */}
      <br></br>
      <br></br>
      <p className="sidebar-subtitle">Import Transactions</p>
      
      <button
        className="upload-pdf-btn"
        onClick={() => fileInput.current.click()}
      >
        📄 Upload PDF
      </button>
      <input
        ref={fileInput}
        type="file"
        accept="application/pdf"
        style={{ display: 'none' }}
        onChange={onFileChange}
      />
    </aside>
  );
}
