import connectDatabase from '../config/database';
import Transaction from '../models/Transaction';

connectDatabase();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    const transactions = await Transaction.find();

    const summary = {
      totalTransactions: transactions.length,
      totalIncome: 0,
      totalExpenses: 0,
      netBalance: 0,
      categoryBreakdown: {},
    };

    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        summary.totalIncome += Math.abs(transaction.amount);
      } else if (transaction.type === 'expense') {
        summary.totalExpenses += Math.abs(transaction.amount);
      }

      // Category breakdown
      if (!summary.categoryBreakdown[transaction.category]) {
        summary.categoryBreakdown[transaction.category] = 0;
      }
      if (transaction.type === 'expense') {
        summary.categoryBreakdown[transaction.category] += Math.abs(transaction.amount);
      }
    });

    summary.netBalance = summary.totalIncome - summary.totalExpenses;

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
