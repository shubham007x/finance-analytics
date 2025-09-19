import connectDatabase from './config/database';
import Transaction from './models/Transaction';

connectDatabase();

export default async function handler(req, res) {
  const { method, query } = req;

  try {
    switch (method) {
      case 'GET':
        if (query.summary) {
          // Handle /api/transactions/summary
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
        } else {
          // Handle /api/transactions
          const transactions = await Transaction.find().sort({ date: -1 });
          res.status(200).json(transactions);
        }
        break;

      case 'PUT':
        const { id } = req.query;
        const updatedTransaction = await Transaction.findByIdAndUpdate(
          id,
          { ...req.body, isEdited: true },
          { new: true }
        );
        if (!updatedTransaction) {
          res.status(404).json({ message: 'Transaction not found' });
          return;
        }
        res.status(200).json(updatedTransaction);
        break;

      case 'DELETE':
        const { id: deleteId } = req.query;
        const deletedTransaction = await Transaction.findByIdAndDelete(deleteId);
        if (!deletedTransaction) {
          res.status(404).json({ message: 'Transaction not found' });
          return;
        }
        res.status(200).json({ message: 'Transaction deleted successfully' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
