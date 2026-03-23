import crypto from 'crypto';
import { AppError } from '../../utils/index.js';

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME || 'judge_session';
const SESSION_TTL_MS = Number(process.env.SESSION_TTL_MS || 12 * 60 * 60 * 1000);
const PREFERENCE_POLICY = process.env.PREFERENCE_POLICY || 'strict_lock';
const STRICT_LOCK = PREFERENCE_POLICY === 'strict_lock';

const sessions = new Map();

function createJudgeDashboardController(judgeDashboardServices) {
  function createSessionForJudge(judge) {
    const token = crypto.randomUUID();
    const expiresAt = Date.now() + SESSION_TTL_MS;
    sessions.set(token, {
      jid: judge.jid,
      email: judge.email,
      name: judge.name,
      expiresAt,
    });
    return { token, expiresAt };
  }

  function setSessionCookie(res, token, expiresAt) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: Math.max(0, expiresAt - Date.now()),
    });
  }

  function clearSessionCookie(req, res) {
    const token = req.cookies?.[SESSION_COOKIE];
    if (token) sessions.delete(token);

    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie(SESSION_COOKIE, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    });
  }

  function readSession(req) {
    const token = req.cookies?.[SESSION_COOKIE];
    if (!token) return null;

    const session = sessions.get(token);
    if (!session) return null;

    if (session.expiresAt < Date.now()) {
      sessions.delete(token);
      return null;
    }

    return session;
  }

  function extractJudgeId(req, explicitJid) {
    if (explicitJid) return String(explicitJid).trim();
    const session = readSession(req);
    return session?.jid || null;
  }

  async function login(req, res, next) {
    try {
      const email = String(req.body?.email || '').trim();
      if (!email) throw new AppError(400, 'fail', 'Email required');

      const judge = await judgeDashboardServices.getJudgeByEmail(email);
      if (!judge) throw new AppError(401, 'fail', 'Judge not found');

      const { token, expiresAt } = createSessionForJudge(judge);
      setSessionCookie(res, token, expiresAt);

      res.status(200).json({
        success: true,
        ...judgeDashboardServices.serializeJudge(judge),
        sessionExpiresAt: new Date(expiresAt).toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  async function logout(req, res, next) {
    try {
      clearSessionCookie(req, res);
      res.status(200).json({ success: true });
    } catch (err) {
      next(err);
    }
  }

  async function getCurrentJudge(req, res, next) {
    try {
      const session = readSession(req);
      if (!session) throw new AppError(401, 'fail', 'Not authenticated');

      const judge = await judgeDashboardServices.getJudgeById(session.jid);
      if (!judge) {
        clearSessionCookie(req, res);
        throw new AppError(401, 'fail', 'Not authenticated');
      }

      res.status(200).json({ success: true, ...judgeDashboardServices.serializeJudge(judge) });
    } catch (err) {
      next(err);
    }
  }

  async function getJudgeById(req, res, next) {
    try {
      const judge = await judgeDashboardServices.getJudgeById(req.params.jid);
      if (!judge) throw new AppError(404, 'fail', 'Judge not found');
      res.status(200).json(judgeDashboardServices.serializeJudge(judge));
    } catch (err) {
      next(err);
    }
  }

  async function getDashboardEvents(req, res, next) {
    try {
      const jid = extractJudgeId(req, req.query.jid);
      if (!jid) throw new AppError(401, 'fail', 'Authentication required');

      const response = await judgeDashboardServices.getDashboardEvents(jid, STRICT_LOCK);
      res.status(200).json({ success: true, ...response });
    } catch (err) {
      next(err);
    }
  }

  async function getPreferenceProjects(req, res, next) {
    try {
      const eventName = judgeDashboardServices.eventNameOrNull(req.params.event_name);
      if (!eventName) throw new AppError(400, 'fail', 'Invalid event_name');

      const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
      const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 20));
      const search = String(req.query.search || '').trim();

      const jid = extractJudgeId(req, req.query.jid);
      if (!jid) throw new AppError(401, 'fail', 'Authentication required');

      const response = await judgeDashboardServices.getPreferenceProjects(eventName, jid, page, limit, search);

      res.status(200).json({
        success: true,
        ...response,
        policy: PREFERENCE_POLICY,
      });
    } catch (err) {
      next(err);
    }
  }

  async function getPreferenceStatus(req, res, next) {
    try {
      const eventName = judgeDashboardServices.eventNameOrNull(req.params.event_name);
      if (!eventName) throw new AppError(400, 'fail', 'Invalid event_name');

      const jid = extractJudgeId(req, req.query.jid);
      if (!jid) throw new AppError(401, 'fail', 'Authentication required');

      const response = await judgeDashboardServices.getPreferenceStatus(eventName, jid, STRICT_LOCK, PREFERENCE_POLICY);
      res.status(200).json({ success: true, ...response });
    } catch (err) {
      next(err);
    }
  }

  async function submitPreferences(req, res, next) {
    try {
      const eventName = judgeDashboardServices.eventNameOrNull(req.params.event_name);
      if (!eventName) throw new AppError(400, 'fail', 'Invalid event_name');

      const jid = extractJudgeId(req, req.body?.jid || req.query.jid);
      if (!jid) throw new AppError(401, 'fail', 'Authentication required');

      const response = await judgeDashboardServices.submitPreferences(
        eventName,
        jid,
        req.body?.preferences,
        STRICT_LOCK,
        PREFERENCE_POLICY
      );

      res.status(200).json({ success: true, ...response });
    } catch (err) {
      next(err);
    }
  }

  async function health(req, res, next) {
    try {
      res.status(200).json({
        success: true,
        policy: PREFERENCE_POLICY,
        now: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  return {
    login,
    logout,
    getCurrentJudge,
    getJudgeById,
    getDashboardEvents,
    getPreferenceProjects,
    getPreferenceStatus,
    submitPreferences,
    health,
  };
}

export default createJudgeDashboardController;
