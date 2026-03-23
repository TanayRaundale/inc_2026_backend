import mysql from 'mysql2/promise';
import AppError from '../utils/appError.mjs';

function connectDatabase() {
    try {
        const env = process.env
        const db = mysql.createPool({
            host: env.DB_HOST,
            port: Number(env.DB_PORT) || 3306,
            user: env.DB_USERNAME,
            password: env.DB_PASSWORD,
            database: env.DB_DATABASE,
            ssl: {
                minVersion: 'TLSv1.2',
                rejectUnauthorized: env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
            },
        })
        return db
    } catch (err) {
        throw new AppError(500, 'fail', 'Internal server error: ' + err.message || err)
    }
}

export default connectDatabase;
