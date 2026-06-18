import express from 'express';
import cookieParser from "cookie-parser";
import cors from "cors";
import { globalErrorHandler } from './middlewares/errorHandler.js';
import { connectDB } from './config/db.js';
import applicationRoutes from './routes/application.routes.js';
import authRoutes from './routes/auth.routes.js';
import contactRoutes from './routes/contact.routes.js';
import consultationRoutes from './routes/consultation.routes.js';
import jobRoutes from './routes/job.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import notificationRoutes from './routes/notification.routes.js';

connectDB();



export const app = express();




// COOKIE PARSING
app.use(cookieParser());




// PARSING INCOMING DATA
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));




// CORS CONFIGURATION
app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://localhost:3001"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));








// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Brand Edge API!');
});



app.use('/api/applications', applicationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);




// global error handler
app.use(globalErrorHandler);