import { adminQueries } from '../../../models/index.js';
import { AppError } from "../../../utils/index.js";

function adminServices(db) {
  function normalizeRoles(rawRoles) {
    if (Array.isArray(rawRoles)) return rawRoles;
    if (typeof rawRoles === 'string') {
      const trimmed = rawRoles.trim();
      if (!trimmed) return [];
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed;
      } catch (_) {
        // Fall through to CSV parsing.
      }
      return trimmed.split(',').map((role) => role.trim()).filter(Boolean);
    }
    return [];
  }

  async function findAdmin(username) {
    try {
      const [rows] = await db.execute(adminQueries.findAdmin, [username]);
      const user = rows?.[0] || null;
      if (!user) return null;
      return {
        ...user,
        roles: normalizeRoles(user.roles),
      };
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(500, 'fail', err?.sqlMessage || err?.message || String(err));
    }
  }

  async function findJudgeByUsername(username) {
    try {
      const [rows] = await db.execute(
        'SELECT jid FROM judges WHERE LOWER(email) = LOWER(?) LIMIT 1',
        [username]
      );
      return rows?.[0] || null;
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(500, 'fail', err?.sqlMessage || err?.message || String(err));
    }
  }

  return {
    findAdmin,
    findJudgeByUsername,
  }
}

export default adminServices;
