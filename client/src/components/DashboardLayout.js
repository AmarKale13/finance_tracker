import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar  from './Topbar';
import AnimatedHero from './AnimatedHero';
import { getTransactions } from '../services/TransactionService';
import './DashboardLayout.css';
import ExpenseChart from './ExpenseChart';
import CategoryPieChart from './CategoryPieChart';
import Footer from './Footer';

export default function DashboardLayout() {
  const [txns, setTxns]     = useState([]);
  const [start, setStart]   = useState('');
  const [end, setEnd]       = useState('');
  const [totals, setTotals] = useState({ income: 0, expense: 0, net: 0 });
  const [chartData, setChartData] = useState([]);
  // load once
  useEffect(() => {
    getTransactions().then(res => setTxns(res.data));
    // console.log(res.data);

  }, []);

  // recompute when data or dates change
  useEffect(() => {
    let filtered = txns;
    if (start) {
      const s = new Date(start).setHours(0,0,0,0);
      filtered = filtered.filter(t => new Date(t.date).getTime() >= s);
    }
    if (end) {
      const e = new Date(end).setHours(23,59,59,999);
      filtered = filtered.filter(t => new Date(t.date).getTime() <= e);
    }
    const income  = filtered.filter(t => t.type==='income').reduce((sum, t) => sum + t.amount, 0);
    const expense = filtered.filter(t => t.type==='expense').reduce((sum, t) => sum + t.amount, 0);
    setTotals({ income, expense, net: income - expense });

    const byDate = {};
   filtered.forEach(t => {
     const d = new Date(t.date).toISOString().slice(0,10);
     if (!byDate[d]) byDate[d] = { date: d, income: 0, expense: 0 };
     byDate[d][t.type] += t.amount;
   });
   const chartData = Object.values(byDate)
     .sort((a,b) => a.date.localeCompare(b.date))
     .map(item => ({ 
       ...item, 
       net: item.income - item.expense 
     }));
   setChartData(chartData);
  }, [txns, start, end]);

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-area">
        <Topbar />

        {/* Hero Animation */}
        <AnimatedHero />

        {/* Date Filters */}
        <div className="center-section">
          {/* Date Filters */}
        <h2>Get Your Balance Info</h2>
          <div className="filters">
            <label>
              From
              <input
                type="date"
                value={start}
                onChange={e => setStart(e.target.value)}
              />
            </label>
            <label>
              To
              <input
                type="date"
                value={end}
                onChange={e => setEnd(e.target.value)}
              />
            </label>
          </div>

          {/* Summary Cards */}
          <div className="summary" style={{alignItems: 'center'}}>
            {['income','expense','net'].map(key => (
              <div key={key} className="card">
                <div className="first-content">
                  <span>
                    {key === 'income' ? 'Total Income'
                     : key === 'expense' ? 'Total Expense'
                     : 'Net'}
                  </span>
                </div>
                <div className="second-content">
                  <span>₹{totals[key].toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='expense-chart'>
          <h3>Your Financial Journey: Income vs. Expenses</h3>

          <ExpenseChart data={chartData} />
        </div>
        


          <h3>Where Your Money Comes From and Goes</h3>
        <div className="category-charts">
          <div className="chart-wrapper">
            <h3>Expenses by Category</h3>
            <CategoryPieChart
              transactions={txns}
              start={start}
              end={end}
              filterType1="expense"
            />
          </div>
          <div className="chart-wrapper">
            <h3>Income by Category</h3>
            <CategoryPieChart
              transactions={txns}
              start={start}
              end={end}
              filterType1="income"
            />
          </div>
      </div>


        {/* Main Content */}
        <main className="content-area">
          <Outlet />
        </main>
        <div className="footer">
        <Footer />
        </div>
      </div>
    </div>
  );
}
