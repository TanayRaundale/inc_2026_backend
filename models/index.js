import {
    adminValidations as _adminValidations,
    conceptsValidations as _conceptsValidations,
    ticketValidations as _ticketValidations,
    eventsValidations as _eventsValidations,
    judgesValidations as _judgesValidations
} from './validations/index.js';
import { adminQueries as _adminQueries } from './queries/admin/admin.queries.mjs';
import { eventsQueries as _eventsQueries } from './queries/events/events.queries.mjs';
import { conceptsQueries as _conceptsQueries } from './queries/events/concepts/concepts.queries.mjs';
import { ticketQueries as _ticketQueries } from './queries/events/tickets/tickets.queries.mjs';
import { filesQueries as _filesQueries } from './queries/files/files.queries.mjs';
import { judgesQueries as _judgesQueries } from './queries/judges/judges.queries.mjs';
import { analyticsQueries as _analyticsQueries } from './queries/analytics/analytics.queries.mjs';
import { allocationQueries as _allocationQueries } from './queries/allocation/allocation.queries.mjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.dev' });

const env = process.env

const tables = {
    adminTableName: env.ADMIN_TABLE_NAME,
    conceptsUsersTable: env.CONCEPTS_USERS_TABLE,
    impetusUsersTable: env.IMPETUS_USERS_TABLE,
    pradnyaUsersTable: env.PRADNYA_USERS_TABLE,
    novaUsersTable: env.NOVA_USERS_TABLE,
    ticketTable: env.TICKET_TABLE,
    filesTable: env.FILES_TABLE,
    judgesTable: env.JUDGES_TABLE,
}

export const adminValidations = { ..._adminValidations }
export const eventsValidations = { ..._conceptsValidations, ..._ticketValidations, ..._eventsValidations }
export const judgesValidations = { ..._judgesValidations }
export const adminQueries = _adminQueries(tables.adminTableName)
export const eventsQueries = _eventsQueries(tables)
export const conceptsQueries = _conceptsQueries(tables.conceptsUsersTable)
export const ticketQueries = _ticketQueries(tables.ticketTable)
export const filesQueries = _filesQueries(tables.filesTable)
export const judgesQueries = _judgesQueries(tables.judgesTable)
export const allocationQueries = _allocationQueries()
export const analyticsQueries=_analyticsQueries()