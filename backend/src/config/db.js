import mongoose from "mongoose";
import { ENV } from "./envs.js";



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
};

// Log every connection state change so flaky/dropped connections show up
// clearly in production logs instead of only surfacing as request timeouts.
mongoose.connection.on("connected", () => console.log("MongoDB: connected"));
mongoose.connection.on("disconnected", () => console.warn("MongoDB: disconnected — requests will fail until it reconnects"));
mongoose.connection.on("reconnected", () => console.log("MongoDB: reconnected"));
mongoose.connection.on("error", (err) => console.error(`MongoDB: connection error — ${err.message}`));

export const connectDB = async () => {

    const DB_URL = ENV.DB_URL;

    if (!DB_URL) {
        throw new Error("DB_URL environment variable is missing!");
    }

    try {

        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(DB_URL, connectionOptions);
        }

    } catch (err) {
        console.error(`Connection Failed: ${err.message}`);
        throw err;
    }
};