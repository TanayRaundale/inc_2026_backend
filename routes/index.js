import fs from 'fs';
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import { healthCheck, undefinedRoute, globalError } from '../controllers/index.js';
import { adminValidations, eventsValidations, judgesValidations } from '../models/index.js';
import createAdminRouter from './admin/admin.router.mjs';
import createEventsRouter from './events/events.router.mjs';
import createJudgesRouter from './judges/judges.router.mjs';
import createAllocationsRouter from './allocations/allocations.router.mjs';
import createReferralRouter from './referral/referral.router.mjs';
import createBackupRouter from './backup/backup.router.mjs';
import createJudgeDashboardApiRouter from './dashboard/judgeDashboard.router.mjs';

function connectRouter(server, databaseService, emailService, docServices, middlewares) {
    const {
        adminServices,
        eventsServices,
        filesServices,
        judgesServices,
        allocationServices,
        referralServices,
        dashboardServices,
    } = databaseService
    server.get('/', healthCheck)
    // server.use(middlewares.apiLimiter)
    server.use('/api', createJudgeDashboardApiRouter(dashboardServices))
    server.use('/admin', createAdminRouter(adminServices, docServices, middlewares, adminValidations, judgesServices))
    server.use('/events', createEventsRouter(eventsServices, filesServices, emailService, middlewares, eventsValidations, adminValidations, docServices))
    server.use('/judge', createJudgesRouter(judgesServices, eventsServices, emailService, middlewares, judgesValidations, adminValidations, eventsValidations))
    server.use('/allocations', createAllocationsRouter(emailService, allocationServices, eventsServices, judgesServices, middlewares, adminValidations))
    server.use('/referral', createReferralRouter(referralServices))
    server.use('/backup', createBackupRouter(eventsServices, adminServices));

    const routesDir = path.dirname(fileURLToPath(import.meta.url));
    const judgeDashboardDist = path.resolve(routesDir, '../../dashboard_ui/judge-dashboard-ui/dist');
    const judgeDashboardIndex = path.join(judgeDashboardDist, 'index.html');
    if (fs.existsSync(judgeDashboardIndex)) {
        const frameAllowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
        const judgeDashboardFrameHeaders = (req, res, next) => {
            res.removeHeader('X-Frame-Options');
            res.setHeader('Content-Security-Policy', `frame-ancestors 'self' ${frameAllowedOrigin}`);
            next();
        };

        server.use('/judge-dashboard', judgeDashboardFrameHeaders);
        server.use('/judge-dashboard', express.static(judgeDashboardDist));
        server.get('/judge-dashboard', (req, res) => {
            res.sendFile(judgeDashboardIndex);
        });

        server.get('/judge-dashboard/*', (req, res) => {
            res.sendFile(judgeDashboardIndex);
        });
    }

    server.use('*', undefinedRoute)
    server.use(globalError)
    return server
}

export {
    connectRouter,
}
