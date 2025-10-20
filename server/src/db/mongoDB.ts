import mongoose from 'mongoose';
const MONGODB_URI = process.env.MONGODB_URI;
export const mongoDBConnect = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    await mongoose.connect(MONGODB_URI);
    console.log('🟢🟢🟢 Connected to MongoDB 🤖 with Mongoose');
  } catch (error) {
    console.error('❌❌❌ Database connection error:', error);
    process.exit(1);
  }
};
