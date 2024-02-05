import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors'
import connectDatabase from './database/connectdb.js';
import userRoute from './Routes/userRoute.js';
import {notFound} from './middleware/Error.middleware.js'
import {HandleError} from './middleware/Error.middleware.js'
import bodyParser from 'body-parser';
import userAuthRoute from './Routes/userAuthRoute.js';
import cookieParser from 'cookie-parser';
import session from 'express-session'
dotenv.config()
const app = express()
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));
    

app.use(bodyParser.json())
app.use(express.json({extended: true}))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(session({
  secret:"dhfsksjhjfdasfh",
  resave: false,
  saveUninitialized: true,
  cookie:{secure:false}
}))

app.use("/api/user/auth", userAuthRoute)
app.use('/api/user', userRoute)
// app.use("/api/user/:id", userRoute)

// app.use(notFound)
app.use(HandleError)

connectDatabase()

app.listen(process.env.PORT, () => {console.log(`Server is running on Port: ${process.env.PORT}`);})