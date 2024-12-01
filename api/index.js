import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js'


dotenv.config();


// Connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error.message);
    });

const app = express();

app.use(express.json());

app.listen(8000, () => {    
    console.log('Server is running on port 8000!');
}); 


app.use('/api/user', userRoutes); 
app.use('/api/auth', authRoutes);
