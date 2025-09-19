import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    merchant: {
        type: String,
        default: '',
    },
    category: {
        type: String,
        enum: ['food', 'utilities', 'entertainment', 'transport', 'healthcare', 'shopping', 'income', 'transfer', 'other'],
        default: 'other',
    },
    type: {
        type: String,
        enum: ['expense', 'income', 'transfer'],
        required: true,
    },
    originalText: {
        type: String,
        default: '',
    },
    isEdited: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
