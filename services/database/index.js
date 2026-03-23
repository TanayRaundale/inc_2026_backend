import adminServices from './admin/admin.database.services.mjs';
import eventsServices from './events/events.database.services.mjs';
import filesServices from './files/files.database.services.mjs';
import judgesServices from './judges/judges.database.services.mjs';
import allocationServices from './allocations/allocations.database.services.mjs';
import referralServices from './referral/referral.database.services.mjs';
import dashboardServices from './dashboard/judgeDashboard.database.services.mjs';

function databaseService(db) {
    return {
        adminServices: adminServices(db),
        eventsServices: eventsServices(db),
        filesServices: filesServices(db),
        judgesServices: judgesServices(db),
        allocationServices: allocationServices(db),
        referralServices: referralServices(db),
        dashboardServices: dashboardServices(db),
    }
}

export default databaseService;
