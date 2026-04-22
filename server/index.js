import express from 'express';
import cors from 'cors';
import dotenv from "dotenv"
import connectDb from './config/connectDB.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoute.js';
dotenv.config();

const app = express();
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))


const PORT=process.env.PORT || 5000;

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRouter)

app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
    connectDb();
});
