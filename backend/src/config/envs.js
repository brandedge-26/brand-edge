import "dotenv/config";


// VALIDATE REQUIRED ENVIRONMENT VARIABLES
const validateEnv = () => {

    const required = ['DB_URL', 'ACCESS_TOKEN_SECRET'];

    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    }

};

validateEnv();


export const ENV = {

    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    NODE_ENV: process.env.NODE_ENV,
    CLIENT_URL: process.env.CLIENT_URL,

    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,

}