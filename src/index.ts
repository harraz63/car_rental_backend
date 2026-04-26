import 'dotenv/config';
import app from './app';
import connectDB from './config/db';

const PORT = process.env.PORT || 3000;

const startServer = async (): Promise<void> => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📖 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

// Handle unhandled rejections
process.on('unhandledRejection', (reason: Error) => {
  console.error('💥 Unhandled Rejection:', reason.message);
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  console.error('💥 Uncaught Exception:', error.message);
  process.exit(1);
});

startServer();
