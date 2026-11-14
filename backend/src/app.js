import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import connectDB from './config/db.js';
import taskRoutes from './routes/taskRoutes.js';

const {PORT=5000, CLIENT_ORIGIN } = process.env;

const app = express();

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());
app.use('/api',taskRoutes)


connectDB();

app.get('/', (req, res) => {
  res.send('Express server is running!');
});


app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
})