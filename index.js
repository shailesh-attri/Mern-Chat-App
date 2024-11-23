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

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Log environment variables
console.log('Loaded environment variables:');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`PORT: ${process.env.PORT}`);
console.log(`MONGODB_URI: ${process.env.MONGODB_URI ? 'Loaded' : 'Not Loaded'}`);
console.log(`JWT_SECRET_KEY: ${process.env.JWT_SECRET_KEY ? 'Loaded' : 'Not Loaded'}`);

// Configure CORS
const allowedOrigins = [
  'https://nexus-chat-app.vercel.app',
  'https://nexus-chat-ebon.vercel.app',
  'https://nexus-chat-9v3v.onrender.com',
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Middleware setup
app.use(bodyParser.json());
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Mern Chat App! Server is running successfully');
  console.log('Root endpoint hit.');
});

app.use('/api/user/auth', userAuthRoute);
app.use('/api/user', userRoute);
app.use('/api/user/chat', chatRoute);
app.use('/api/user/message', messageRoute);

// Error handling middleware
app.use(HandleError);

// Print all registered routes
const listRoutes = (app) => {
  console.log('Registered APIs:');
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Route middleware
      console.log(`${middleware.route.stack[0].method.toUpperCase()} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      // Router middleware
      middleware.handle.stack.forEach((handler) => {
        const route = handler.route;
        if (route) {
          console.log(`${route.stack[0].method.toUpperCase()} ${route.path}`);
        }
      });
    }
  });
};

// Log environment mode
if (process.env.NODE_ENV === 'production') {
  console.log('Server is running in production mode.');
} else {
  console.log('Server is running in development mode.');
  console.log(`Server is running on: http://localhost:${PORT}`);
}

// Connect to MongoDB
connectDatabase()
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    // List all routes after DB connection
    listRoutes(app);
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1); // Exit the process if MongoDB connection fails
  });

// Start the server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on Port: ${PORT}`);
});
