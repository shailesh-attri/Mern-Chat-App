import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDatabase from './database/connectdb.js';
import userRoute from './Routes/userRoute.js';
import { HandleError } from './middleware/Error.middleware.js';
import bodyParser from 'body-parser';
import userAuthRoute from './Routes/userAuthRoute.js';
import cookieParser from 'cookie-parser';
import messageRoute from './Routes/messageRoute.js';
import chatRoute from './Routes/chatRoute.js';
import { app, server } from './socket/socket.io.js';

dotenv.config();

const PORT = 8000;

const corsOptions = {
  origin: ['https://nexus-chat-app.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
};

// Set up CORS globally for all routes
app.use(cors(corsOptions));

// Other middleware and routes
app.use(bodyParser.json());
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Welcome to the Mern Chat App! Server is running successfully');
});

app.use("/api/user/auth", userAuthRoute);
app.use('/api/user', userRoute);
app.use('/api/user/chat', chatRoute);
app.use('/api/user/message', messageRoute);

// app.use(notFound);
app.use(HandleError);



// Connect to MongoDB
connectDatabase();

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});
