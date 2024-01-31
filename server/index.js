import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors'
import connectDatabase from './database/connectdb.js';
import userRoute from './Routes/userRoute.js';
import {notFound} from './middleware/Error.middleware.js'
import {HandleError} from './middleware/Error.middleware.js'
import bodyParser from 'body-parser';
dotenv.config()
const app = express()
app.use(cors())

app.use(express.json({extended: true}))
app.use(express.urlencoded({ extended: true }))

app.use("/api/user", userRoute)
// app.use("/api/user/:id", userRoute)

// app.use(notFound)
app.use(HandleError)

connectDatabase()

app.listen(process.env.PORT, () => {console.log(`Server is running on Port: ${process.env.PORT}`);})