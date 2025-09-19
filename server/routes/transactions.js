const express = require('express');
const Transaction = require('../models/Transaction');
const router = express.Router();

// Get all transactions
router.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get transaction summary
router.get('/summary', async (req, res) => {
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

        res.json(summary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update transaction
router.put('/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            { ...req.body, isEdited: true },
            { new: true }
        );
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.json(transaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete transaction with enhanced logging
router.delete('/:id', async (req, res) => {
    try {
        console.log(`DELETE request received for transaction ID: ${req.params.id}`);
        const transaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!transaction) {
            console.warn(`Transaction not found for ID: ${req.params.id}`);
            return res.status(404).json({ message: 'Transaction not found' });
        }
        console.log(`Transaction deleted successfully for ID: ${req.params.id}`);
        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
