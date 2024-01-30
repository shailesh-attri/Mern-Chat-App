import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors'
import connectDatabase from './database/connectdb.js';
import userRoute from './Routes/userRoute.js';
dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
app.use("/api/auth", userRoute)
connectDatabase()

app.listen(process.env.PORT, () => {console.log(`Server is running on Port: ${process.env.PORT}`);})