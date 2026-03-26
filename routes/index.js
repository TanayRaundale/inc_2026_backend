import { healthCheck, undefinedRoute, globalError } from '../controllers/index.js';
import { adminValidations, eventsValidations, judgesValidations } from '../models/index.js';
import createAdminRouter from './admin/admin.router.mjs';
import createEventsRouter from './events/events.router.mjs';
import createJudgesRouter from './judges/judges.router.mjs';
import createAllocationsRouter from './allocations/allocations.router.mjs';
import createReferralRouter from './referral/referral.router.mjs';
import createBackupRouter from './backup/backup.router.mjs';
import createAdminViewRouter from './admin-view/AdminView.js';
import {healthLimiter} from '../middlewares/rateLimiter.mjs';
//
function connectRouter(server, databaseService, emailService, docServices, middlewares) {
    const { adminServices, eventsServices, filesServices, judgesServices, allocationServices, referralServices } = databaseService
    server.get('/',healthLimiter, healthCheck)
    server.get('/health',healthLimiter, databaseService.healthServices);
    // server.use(middlewares.apiLimiter)
    server.use('/admin', createAdminRouter(adminServices, docServices, middlewares, adminValidations, judgesServices))
    server.use('/view/admin', createAdminViewRouter(databaseService,middlewares, adminValidations))
    server.use('/events', createEventsRouter(eventsServices, filesServices, emailService, middlewares, eventsValidations, adminValidations, docServices))
    server.use('/judge', createJudgesRouter(judgesServices, eventsServices, emailService, middlewares, judgesValidations, adminValidations, eventsValidations))
    server.use('/allocations', createAllocationsRouter(emailService, allocationServices, eventsServices, judgesServices, middlewares, adminValidations))
    server.use('/referral', createReferralRouter(referralServices))
    server.use('/backup', createBackupRouter(eventsServices, adminServices));

    server.use('*', undefinedRoute)
    server.use(globalError)
    return server
}

export {
    connectRouter,
}