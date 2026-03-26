import adminServices from './admin/admin.database.services.mjs';
import eventsServices from './events/events.database.services.mjs';
import filesServices from './files/files.database.services.mjs';
import judgesServices from './judges/judges.database.services.mjs';
import allocationServices from './allocations/allocations.database.services.mjs';
import referralServices from './referral/referral.database.services.mjs';
import healthServices from '../../services/database/health/health.database.service.mjs';
import analyticsServices from './analytics/analytics.database.services.mjs';

function databaseService(db) {
    return {
        adminServices: adminServices(db),
        eventsServices: eventsServices(db),
        filesServices: filesServices(db),
        judgesServices: judgesServices(db),
        allocationServices: allocationServices(db),
        referralServices: referralServices(db),
        healthServices:healthServices(db),
        analyticsServices:analyticsServices(db),
        db
    }
}

export default databaseService;