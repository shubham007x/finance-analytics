import connectDatabase from '../config/database';
import Transaction from '../models/Transaction';

connectDatabase();

export default async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;

  try {
    switch (method) {
      case 'PUT':
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
        const deletedTransaction = await Transaction.findByIdAndDelete(id);
        if (!deletedTransaction) {
          res.status(404).json({ message: 'Transaction not found' });
          return;
        }
        res.status(200).json({ message: 'Transaction deleted successfully' });
        break;

      default:
        res.setHeader('Allow', ['PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
