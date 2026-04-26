import mongoose from 'mongoose';

const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb+srv://harraz63hid:agSbaMiGlL6MBLTY@cluster0.znuztb8.mongodb.net/car-rental';

if (!MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable');
}

// تخزين الاتصال لضمان عدم فتح اتصالات متكررة في Vercel
let isConnected = false;

const connectDB = async (): Promise<void> => {
  mongoose.set('strictQuery', true);

  if (isConnected) {
    console.log('✅ Using existing MongoDB connection');
    return;
  }

  try {
    const db = await mongoose.connect(MONGO_URI);
    isConnected = !!db.connections[0].readyState;
    console.log(`✅ MongoDB Connected: ${db.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    // في Vercel لا نفضل عمل process.exit(1) حتى لا نقتل الـ Function تماماً
    throw error;
  }
};

export default connectDB;
