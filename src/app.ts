import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import discussionRoutes from './routes/discussionRoutes';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/discussions', discussionRoutes);

mongoose.connect(process.env.MONGO_URI!)
   .then(() => console.log('Discussion Service: MongoDB connected'))
   .catch(err => console.error(err));

export default app;
