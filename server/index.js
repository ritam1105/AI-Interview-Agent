import express from 'express';
import cors from 'cors';
import dotenv from "dotenv"
import connectDb from './config/connectDB.js';
dotenv.config();

const app = express();

const PORT=process.env.PORT || 5000;

app.get('/', (req, res) => {
    return res.json({message: 'Hello World'});
});

app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
    connectDb();
});
