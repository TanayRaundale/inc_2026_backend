import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.dev' });

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    message: 'Too many request created from this IP, please try again after 15 minutes',
    handler: (_, __, next, options) => next(options.message),
    keyGenerator(req) {
        return req.headers['x-forwarded-for'] || req.clientIp
    }
})

const registrationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: process.env.REQUEST_LIMITER || 25, // Limit each IP to 10 create account requests per `window` (here, per hour)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    skipSuccessfulRequests: false,
    message: 'Too many accounts created from this IP, please try again after an hour',
    handler: (_, __, next, options) => next(options.message),
    keyGenerator(req) {
        return req.headers['x-forwarded-for'] || req.connection.remoteAddress
    }
})

const healthLimiter = rateLimit({
    windowMs: 3600 * 1000, // 1 hr
    max: 10,             // max 10 requests per minute
    message: { status: 'fail', message: 'Too many requests. Try later.' },
    standardHeaders: true,
    legacyHeaders: false
});

export {
    apiLimiter,
    registrationLimiter,
    healthLimiter
}
