import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#d0ed57', '#8dd1e1', '#a4de6c'];

export default function CategoryPieChart({
  transactions,
  start,
  end,
  filterType1 ='expense'
}) {
  // 1) Filter by type & date
  const filtered = useMemo(() => {
    let arr = transactions.filter(t => t.type === filterType1);
    if (start) {
      const s = new Date(start).setHours(0,0,0,0);
      arr = arr.filter(t => new Date(t.date).getTime() >= s);
    }
    if (end){
      const e = new Date(end).setHours(23,59,59,999);
      arr = arr.filter(t => new Date(t.date).getTime() <= e);
    }
    return arr;
  }, [transactions, start, end, filterType1]);  

  // 2) Aggregate by category
  const data = useMemo(() => {
    const map = {};
    filtered.forEach(t => {
      const cat = t.category || 'Uncategorized';
      map[cat] = (map[cat] || 0) + t.amount;
    });
    let items = Object.entries(map)
      .map(([category, value]) => ({ category, value }))
      .sort((a, b) => b.value - a.value);

    // 3) Top 5 + Others
    if (items.length > 6) {
      const top5 = items.slice(0, 5);
      const others = items.slice(5).reduce((sum, it) => sum + it.value, 0);
      top5.push({ category: 'Others', value: others });
      items = top5;
    }
     

    return items;
  }, [filtered]);

  return (
    <ResponsiveContainer width="100%" height={300}>
         

      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="category"
          innerRadius={50}
          outerRadius={100}
          label
        >
          {data.map((entry, idx) => (
            <Cell key={entry.category} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={val => `₹${val.toFixed(2)}`} />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
}
