import React, { useState, useEffect } from 'react';
import { getTransactions } from '../services/TransactionService';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import './ReportsPage.css';

// helper to get month key
const getMonthKey = dateStr => {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

// helper to get quarter key
const getQuarterKey = dateStr => {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const quarter = Math.floor(d.getMonth() / 3) + 1;
  return `${year}-Q${quarter}`;
};

export default function ReportsPage() {
  const [txns, setTxns] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [quarterly, setQuarterly] = useState([]);
  const [catMonthly, setCatMonthly] = useState({});
  const [catQuarterly, setCatQuarterly] = useState({});

  useEffect(() => {
    getTransactions().then(res => {
      const data = Array.isArray(res.data) ? res.data : res; // support both styles
      setTxns(data);
    });
  }, []);

  useEffect(() => {
    if (!txns.length) return;

    const mMap = {}, qMap = {}, cm = {}, cq = {};

    txns.forEach(t => {
      const keyM = getMonthKey(t.date);
      const keyQ = getQuarterKey(t.date);
      if (!mMap[keyM]) mMap[keyM] = { income: 0, expense: 0 };
      if (!qMap[keyQ]) qMap[keyQ] = { income: 0, expense: 0 };
      mMap[keyM][t.type] += t.amount;
      qMap[keyQ][t.type] += t.amount;

      if (!cm[keyM]) cm[keyM] = {};
      if (!cm[keyM][t.category]) cm[keyM][t.category] = { income: 0, expense: 0 };
      cm[keyM][t.category][t.type] += t.amount;

      if (!cq[keyQ]) cq[keyQ] = {};
      if (!cq[keyQ][t.category]) cq[keyQ][t.category] = { income: 0, expense: 0 };
      cq[keyQ][t.category][t.type] += t.amount;
    });

    setMonthly(Object.entries(mMap).sort().map(([period, vals]) => ({ period, ...vals })));
    setQuarterly(Object.entries(qMap).sort().map(([period, vals]) => ({ period, ...vals })));
    setCatMonthly(cm);
    setCatQuarterly(cq);
  }, [txns]);

  return (
    
    <div className="dashboard-container">
        
      <Sidebar />
      <div className="main-area">
        <Topbar />
        <main className="content-area reports-page">
            <h1>REPORT</h1>
            <br></br>
          <h2>Monthly Income & Expense</h2>
          <table className="report-table">
            <thead><tr><th>Month</th><th>Income</th><th>Expense</th><th>Net</th></tr></thead>
            <tbody>
              {monthly.map(m => (
                <tr key={m.period}>
                  <td>{m.period}</td>
                  <td>₹{m.income.toFixed(2)}</td>
                  <td>₹{m.expense.toFixed(2)}</td>
                  <td>₹{(m.income - m.expense).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Quarterly Income & Expense</h2>
          <table className="report-table">
            <thead><tr><th>Quarter</th><th>Income</th><th>Expense</th><th>Net</th></tr></thead>
            <tbody>
              {quarterly.map(q => (
                <tr key={q.period}>
                  <td>{q.period}</td>
                  <td>₹{q.income.toFixed(2)}</td>
                  <td>₹{q.expense.toFixed(2)}</td>
                  <td>₹{(q.income - q.expense).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Category Breakdown (Monthly)</h2>
          {Object.entries(catMonthly).map(([period, cats]) => {
            const sorted = Object.entries(cats).sort((a, b) => b[1].expense - a[1].expense);
            return (
              <div key={period} className="category-report">
                <h3>{period}</h3>
                <ul>
                  {sorted.map(([cat, vals]) => (
                    <li key={cat}>
                      <strong>{cat}</strong>: ₹{vals.expense.toFixed(2)} spent, ₹{vals.income.toFixed(2)} earned
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          <br></br>

          <h2>Category Breakdown (Quarterly)</h2>
          {Object.entries(catQuarterly).map(([period, cats]) => {
            const sorted = Object.entries(cats).sort((a, b) => b[1].expense - a[1].expense);
            return (
              <div key={period} className="category-report">
                <h3>{period}</h3>
                <ul>
                  {sorted.map(([cat, vals]) => (
                    <li key={cat}>
                      <strong>{cat}</strong>: ₹{vals.expense.toFixed(2)} spent, ₹{vals.income.toFixed(2)} earned
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </main>
      </div>
    </div>
  );
}
