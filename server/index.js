import express from 'express';
import cors from 'cors';
import dotenv from "dotenv"
import connectDb from './config/connectDB.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoute.js';
import userRouter from './routes/userRoutes.js';
import interviewRouter from './routes/interviewRoute.js';
import paymentRouter from './routes/paymentRoutes.js';
dotenv.config();

const app = express();
app.use(cors({
    origin:"https://ai-interview-agent-v.vercel.app/",
    credentials:true
}))


const PORT=process.env.PORT || 5000;

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/interview",interviewRouter)
app.use("/api/payment",paymentRouter)

app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
    connectDb();
});
