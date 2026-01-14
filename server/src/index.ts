import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

// Import routes
import reportsRouter from './routes/reports';
import employeesRouter from './routes/employees';
import uploadRouter from './routes/upload';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Cho phép body lớn (batch import)
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/reports', reportsRouter);
app.use('/employees', employeesRouter);
app.use('/upload', uploadRouter);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});