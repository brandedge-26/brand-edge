import mongoose from "mongoose";
import { ENV } from "./envs.js";



const connectionOptions = {
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
};



export const connectDB = async () => {

    const DB_URL = ENV.DB_URL;

    if (!DB_URL) {
        throw new Error("DB_URL environment variable is missing!");
    }

    try {

        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(DB_URL, connectionOptions);
            console.log(`MongoDB Connected`);
        }

    } catch (err) {
        console.error(`Connection Failed: ${err.message}`);
        throw err;
    }
};