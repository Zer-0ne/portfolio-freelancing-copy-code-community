'use server'
import mongoose from 'mongoose';

const connect = async (): Promise<void> => {
    try {
        const uri = process.env.MONGO_DB_URI as string; // Replace with your MongoDB connection string

        await mongoose.connect(uri, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Error connecting to MongoDB:', error);
    }
};

export default connect;