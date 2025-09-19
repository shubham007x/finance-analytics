import mongoose from 'mongoose';

const connectDatabase = async () => {
    try {
        const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/finance-tracker';

        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
};

export default connectDatabase;
