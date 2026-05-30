import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import app from './app';
import config from './app/config';

async function main() {
    try {

        const dbUrl = config.database_url || process.env.DATABASE_URL;

        if (!dbUrl) {
            throw new Error("DATABASE_URL is missing in .env file!");
        }


        await mongoose.connect(dbUrl as string);
        console.log('📦 Database connected successfully!');

        const port = config.port || process.env.PORT || 5000;
        app.listen(port, () => {
            console.log(`🚀 Server is running smoothly on port ${port}`);
        });
    } catch (error) {
        console.error('❌ Database connection failed:', error);
    }
}

main();