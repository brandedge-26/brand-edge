import mongoose from "mongoose";
import { ENV } from "./envs.js";

// On serverless (Vercel), queries should never silently "buffer" waiting for
// a connection — we explicitly await the connection ourselves (see app.js),
// so a query running before that means something is wrong; fail it immediately.
mongoose.set("bufferCommands", false);

const connectionOptions = {
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 10000,
    heartbeatFrequencyMS: 10000,
    // Atlas clusters are replica sets — a primary election (during failover,
    // maintenance, or a tier upgrade) can briefly drop writes/reads. These
    // make the driver retry automatically instead of failing immediately.
    retryWrites: true,
    retryReads: true,
    maxPoolSize: 10,
};

// Log every connection state change so flaky/dropped connections show up
// clearly in production logs instead of only surfacing as request timeouts.
mongoose.connection.on("connected", () => console.log("MongoDB: connected"));
mongoose.connection.on("disconnected", () => console.warn("MongoDB: disconnected — requests will fail until it reconnects"));
mongoose.connection.on("reconnected", () => console.log("MongoDB: reconnected"));
mongoose.connection.on("error", (err) => console.error(`MongoDB: connection error — ${err.message}`));

// Cache the in-flight connection promise. On Vercel, a "warm" function
// instance reuses this module's state (and the live connection) across
// requests — cheap and instant. A "cold" instance starts fresh: the first
// request to hit it kicks off a new connection and *waits* for it here,
// instead of racing ahead against a connection that isn't ready yet.
let connectionPromise = null;

export const connectDB = () => {
    if (mongoose.connection.readyState === 1) {
        return Promise.resolve();
    }

    if (!connectionPromise) {
        const DB_URL = ENV.DB_URL;
        if (!DB_URL) {
            return Promise.reject(new Error("DB_URL environment variable is missing!"));
        }
        connectionPromise = mongoose.connect(DB_URL, connectionOptions).catch((err) => {
            connectionPromise = null; // let the next request try again
            throw err;
        });
    }

    return connectionPromise;
};
