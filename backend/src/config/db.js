import mongoose from 'mongoose';
import 'dotenv/config';

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Successfully connected to MongoDB.');
  } catch (error) {
	  console.error('Failed to connect to MongoDB:', error.message);
	  process.exit(1);
  }
}
