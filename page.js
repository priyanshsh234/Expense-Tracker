'use client';
import { useEffect, useState } from 'react';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import MonthlyChart from '@/components/MonthlyChart';

export default function HomePage() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch('/api/transactions')
      .then((res) => res.json())
      .then((data) => {
        // Format the dates once here, on the client
        const formatted = data.map((t) => ({
          ...t,
          formattedDate: new Date(t.date).toLocaleDateString(),
        }));
        setTransactions(formatted);
      });
  }, []);

  const handleAdd = (t) => {
    setTransactions((prev) => [
      {
        ...t,
        formattedDate: new Date(t.date).toLocaleDateString(),
      },
      ...prev,
    ]);
  };

  const handleDelete = async (id) => {
    await fetch(`/api/transactions?id=${id}`, { method: 'DELETE' });
    setTransactions(transactions.filter((t) => t._id !== id));
  };

  return (
    <main className="p-4 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Personal Finance Tracker</h1>
      <TransactionForm onAdd={handleAdd} />
      <MonthlyChart transactions={transactions} />
      <TransactionList transactions={transactions} onDelete={handleDelete} />
    </main>
  );
}
