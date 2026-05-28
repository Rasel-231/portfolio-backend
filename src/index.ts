import dotenv from 'dotenv'; // সবার ওপরে dotenv ইম্পোর্ট
dotenv.config();           // এবং কনফিগার নিশ্চিত করুন

import mongoose from 'mongoose';
import app from './app';
import config from './app/config';

async function main() {
    try {
        // এখানে আমরা সেফটি চ্যাকিং করছি
        const dbUrl = config.database_url || process.env.DATABASE_URL;

        if (!dbUrl) {
            throw new Error("DATABASE_URL is missing in .env file!");
        }

        // ফিক্স: config.database_url এর জায়গায় আমাদের তৈরি করা নিশ্চিত 'dbUrl' ভেরিয়েবলটি ব্যবহার করতে হবে
        await mongoose.connect(dbUrl as string);
        console.log('📦 Database connected successfully!');

        // পোর্টের জন্যও একটি সেফ ফলব্যাক (৫০০০) রাখা ভালো
        const port = config.port || process.env.PORT || 5000;
        app.listen(port, () => {
            console.log(`🚀 Server is running smoothly on port ${port}`);
        });
    } catch (error) {
        console.error('❌ Database connection failed:', error);
    }
}

main();