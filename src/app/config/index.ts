import dotenv from 'dotenv';
import path from 'path';

// রুট ডিরেক্টরি থেকে .env ফাইল লোড করা হচ্ছে
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export default {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    database_url: process.env.DATABASE_URL,
    bcrypt_salt_rounds: process.env.BCRYPT_SOLT_ROUND || 12,
    openrouter_api_key: process.env.OPENROUTER_API_KEY,
    jwt: {
        access_secret: process.env.JWT_ACCESS_SECRET,
        refresh_secret: process.env.JWT_REFRESH_SECRET,
        access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
        refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || '365d',
    },
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    },
};