import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors'
import connectDatabase from './database/connectdb.js';
dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
connectDatabase()

app.listen(process.env.PORT, () => {console.log(`Server is running on Port: ${process.env.PORT}`);})