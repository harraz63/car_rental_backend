import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/car-rental';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
});

const User = mongoose.model('User', userSchema);

const seed = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  const existing = await User.findOne({ email: 'admin@carrental.com' });
  if (existing) {
    console.log('ℹ️  Admin already exists. Skipping seed.');
    await mongoose.disconnect();
    return;
  }

  const password = await bcrypt.hash('Admin@12345', 12);
  await User.create({
    name: 'Super Admin',
    email: 'admin@carrental.com',
    password,
    role: 'admin',
  });

  console.log('🌱 Admin seeded successfully!');
  console.log('   Email:    admin@carrental.com');
  console.log('   Password: Admin@12345');
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
