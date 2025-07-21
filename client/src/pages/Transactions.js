// src/pages/Transactions.jsx
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import TransTopbar from '../components/TransTopbar';
import ReceiptUpload from '../components/ReceiptUpload';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { getTransactions } from '../services/TransactionService';
import '../components/DashboardLayout.css';  // .dashboard-container, .main-area, .content-area
import './Transactions.css';                // .transactions-page, .coin-pile
import './TransactionsPagination.css';      // pagination styles (below)

export default function Transactions() {
  const [txns, setTxns]       = useState([]);
  const [prefill, setPrefill] = useState({});
  const [page, setPage]       = useState(1);
  const pageSize              = 7; // show 10 per page

  // load all txns once
  const fetchTxns = async () => {
    try {
      const res = await getTransactions();
      setTxns(res.data);
    } catch (err) {
      console.error('Failed to load transactions', err);
    }
  };

  useEffect(() => {
    fetchTxns();
  }, []);

  // When receipt OCR arrives
  const handleReceiptData = data => {
    setPrefill(data);
  };

  // compute pagination
  const totalPages = Math.ceil(txns.length / pageSize);
  const paginatedTxns = txns.slice(
    (page - 1) * pageSize,
    (page - 1) * pageSize + pageSize
  );

  return (
    <div className="dashboard-container">
      <Sidebar refreshTransactions={fetchTxns}  />

      <div className="main-area">
        <TransTopbar />

        <main className="content-area">
          <div className="txn-and-upload">
            <h3>Upload receipt here</h3>
            <TransactionForm refresh={fetchTxns} prefill={prefill} />
            <ReceiptUpload onDataExtracted={handleReceiptData} />
          </div>

          {/* paginated list */}
          <TransactionList items={paginatedTxns} refresh={fetchTxns} />

          {/* pagination controls */}
          <div className="pagination">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
            >« First</button>
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
            >‹ Prev</button>

            <span>Page {page} of {totalPages}</span>

            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >Next ›</button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            >Last »</button>
          </div>
        </main>
      </div>
    </div>
  );
}
