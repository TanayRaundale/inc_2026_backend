import mysql from 'mysql2/promise';
import AppError from '../utils/appError.mjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.dev' });


function connectDatabase() {
    try {
        const env = process.env
        const db = mysql.createPool({
            host: env.DB_HOST,
            user: env.DB_USERNAME,
            password: env.DB_PASSWORD,
            database: env.DB_DATABASE
        })
        return db
    } catch (err) {
        throw new AppError(500, 'fail', 'Internal server error: ' + err.message || err)
    }
}

export default connectDatabase;