import { connectDB } from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    const transactions = await Transaction.find({});
    return res.status(200).json(transactions);
  }

  if (req.method === 'POST') {
    const { amount, date, description } = req.body;
    const transaction = await Transaction.create({ amount, date, description });
    return res.status(201).json(transaction);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    await Transaction.findByIdAndDelete(id);
    return res.status(204).end();
  }

  if (req.method === 'PUT') {
    const { id, amount, date, description } = req.body;
    const updated = await Transaction.findByIdAndUpdate(id, { amount, date, description }, { new: true });
    return res.status(200).json(updated);
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
