import Jwt from 'jsonwebtoken';
import AppError from './appError.mjs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.dev' });

const env = process.env
function createToken(data) {
    try {
        const token = Jwt.sign(
            data,
            env.JWT_SECRET,
            { algorithm: 'HS256', expiresIn: env.TOKEN_EXPIRY },
        )
        return token
    } catch (err) { throw new AppError(500, 'fail', err) }
}

function verifyToken(token) {
    try {
        const decoded = Jwt.verify(
            token,
            env.JWT_SECRET,
            { algorithms: ['HS256'], maxAge: env.TOKEN_EXPIRY },
            function (err, decoded) {
                if (err) throw new AppError(500, 'fail', err)
                return decoded
            }
        )
        return decoded
    } catch (err) { throw new AppError(500, 'fail', err) }
}

function refreshToken(decoded) {
    //* token will only be issued if the old token is within 30 seconds of expiry. Otherwise, return a bad request status
    const nowUnixSeconds = Math.round(Number(new Date()) / 1000)
    if (decoded.exp - nowUnixSeconds > 30) {
        throw new AppError(400, 'fail', 'Refreshing session is denied')
    }

    return createToken(decoded.data)
}

export { createToken, verifyToken, refreshToken }