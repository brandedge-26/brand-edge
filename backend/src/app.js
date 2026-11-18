import express from 'express';
import mongoose from "mongoose";
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
import salesRepRoutes from './routes/salesRep.routes.js';
import salesRoutes from './routes/sales.routes.js';

connectDB().catch((err) => console.error(`MongoDB connection error: ${err.message}`));



export const app = express();




// COOKIE PARSING
app.use(cookieParser());




// PARSING INCOMING DATA
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));




// CORS CONFIGURATION
app.use(cors({
    origin: (origin, callback) => {
        const allowed = [
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:3002",
            "https://brandedgecreations.pk",
            "https://www.brandedgecreations.pk",
            "https://admin.brandedgecreations.pk",
            "https://www.admin.brandedgecreations.pk",
            "https://sales.brandedgecreations.pk",
            "https://www.sales.brandedgecreations.pk",
        ];
        if (!origin || allowed.includes(origin)) return callback(null, true);
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// No caching on API responses
app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    next();
});

// Fail fast (instead of hanging ~10s and timing out) when MongoDB is
// disconnected, so the real cause is obvious instead of a generic 500.
app.use("/api", (req, res, next) => {
    if (mongoose.connection.readyState === 0) {
        return res.status(503).json({
            success: false,
            message: "Database temporarily unavailable — please try again in a moment.",
        });
    }
    next();
});








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
app.use('/api/sales-reps', salesRepRoutes);
app.use('/api/sales', salesRoutes);




// global error handler
app.use(globalErrorHandler);