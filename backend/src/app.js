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

// Ensure MongoDB is connected before handling any /api request. On a
// serverless "cold start" (Vercel) this awaits the fresh connection instead
// of racing ahead of it; on a warm instance it resolves instantly. Only
// fails (503) if the connection attempt itself genuinely fails/times out —
// not just because a cold start hasn't finished connecting yet.
app.use("/api", async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error(`MongoDB not ready for request: ${err.message}`);
        res.status(503).json({
            success: false,
            message: "Database temporarily unavailable — please try again in a moment.",
        });
    }
});








// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Brand Edge API!');
});

// Lightweight keep-warm endpoint — pinging this periodically (see
// .github/workflows/keep-warm.yml) keeps the Vercel function from going
// cold and keeps the MongoDB connection alive, since it passes through the
// same connectDB() middleware as every other /api route above.
app.get('/api/health', (req, res) => {
    res.json({ success: true, status: 'ok', time: new Date().toISOString() });
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