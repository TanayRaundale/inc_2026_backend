import { AppError } from '../../../utils/index.js';

const DEFAULT_SLOTS = [1, 2, 3, 4, 5, 6];
const VALID_DOMAINS = new Set(['AD', 'CN', 'DS', 'ES', 'ML', 'OT']);
const MAX_PROJECT_JUDGES = Number.parseInt(process.env.MAX_PROJECT_JUDGES || '3', 10);
const EVENT_REGISTRY = [
  { key: 'impetus', label: 'Impetus', projectTable: 'impetus_projects' },
  { key: 'concepts', label: 'Concepts', projectTable: 'concepts_projects' },
];
const EVENT_CONFIG_BY_KEY = Object.fromEntries(EVENT_REGISTRY.map((event) => [event.key, event]));

function createJudgeDashboardServices(db) {
  let statusTableChecked = false;
  let statusTableExists = false;
  let statusHasEventName = false;

  function parseList(value) {
    if (value === null || value === undefined) return [];
    if (Array.isArray(value)) {
      return value.map((item) => String(item).trim()).filter(Boolean);
    }

    const raw = String(value).trim();
    if (!raw) return [];

    if (raw.startsWith('[') && raw.endsWith(']')) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => String(item).trim()).filter(Boolean);
        }
      } catch {
        // Fall back to CSV-style parsing.
      }
    }

    return raw
      .split(',')
      .map((part) => part.replace(/^"|"$/g, '').trim())
      .filter(Boolean);
  }

  function normalizeDomains(domainsRaw) {
    const normalized = [];
    for (const token of parseList(domainsRaw)) {
      const upper = token.toUpperCase();
      const mapped = upper === 'DSP' ? 'DS' : upper;
      if (VALID_DOMAINS.has(mapped) && !normalized.includes(mapped)) {
        normalized.push(mapped);
      }
    }
    if (!normalized.length) normalized.push('OT');
    return normalized;
  }

  function normalizeSlots(slotsRaw) {
    const numbers = parseList(slotsRaw)
      .map((token) => Number.parseInt(token, 10))
      .filter((value) => Number.isInteger(value) && value > 0 && value <= 12);

    const unique = [...new Set(numbers)].sort((a, b) => a - b);
    return unique.length ? unique : [...DEFAULT_SLOTS];
  }

  function parseProjectSlotList(slotValue) {
    return parseList(slotValue)
      .map((token) => Number.parseInt(token, 10))
      .filter((value) => Number.isInteger(value) && value > 0);
  }

  function eventNameOrNull(value) {
    if (!value || typeof value !== 'string') return null;
    const normalized = value.trim().toLowerCase();
    return EVENT_CONFIG_BY_KEY[normalized] ? normalized : null;
  }

  function parseJudgeRegisteredEvents(eventsRaw) {
    const events = [];
    for (const token of parseList(eventsRaw)) {
      const normalized = eventNameOrNull(token);
      if (normalized && !events.includes(normalized)) {
        events.push(normalized);
      }
    }
    return events;
  }

  function isJudgeRegisteredForEvent(judge, eventName) {
    return parseJudgeRegisteredEvents(judge?.events).includes(eventName);
  }

  async function ensureStatusTableMetadata() {
    if (statusTableChecked) return;

    const [tableRows] = await db.execute("SHOW TABLES LIKE 'judge_preference_status'");
    statusTableExists = tableRows.length > 0;

    if (statusTableExists) {
      const [columns] = await db.execute("SHOW COLUMNS FROM judge_preference_status LIKE 'event_name'");
      statusHasEventName = columns.length > 0;
    }

    statusTableChecked = true;
  }

  async function tableExists(tableName) {
    const [rows] = await db.execute('SHOW TABLES LIKE ?', [tableName]);
    return rows.length > 0;
  }

  function isJudgeCountEligible(judgeCount) {
    // Show projects with 0..(MAX-1) judges; MAX and above are considered full.
    return judgeCount >= 0 && judgeCount < MAX_PROJECT_JUDGES;
  }

  function getProjectJudgeCount(project) {
    const raw = project?.count_of_judges ?? project?.count_ofjudges ?? project?.judge_count_value ?? 0;
    const parsed = Number.parseInt(raw, 10);
    return Number.isInteger(parsed) && parsed >= 0 ? parsed : 0;
  }

  async function getProjectJudgeCountColumn(eventName) {
    const tableName = `${eventName}_projects`;
    const [columns] = await db.execute(`SHOW COLUMNS FROM ${tableName}`);

    if (columns.some((column) => column.Field === 'count_of_judges')) return 'count_of_judges';
    if (columns.some((column) => column.Field === 'count_ofjudges')) return 'count_ofjudges';
    return null;
  }

  async function getProjectTimeslotColumn(eventName) {
    const tableName = `${eventName}_projects`;
    const [columns] = await db.execute(`SHOW COLUMNS FROM ${tableName}`);

    if (columns.some((column) => column.Field === 'timeslot')) return 'timeslot';
    if (columns.some((column) => column.Field === 'slot')) return 'slot';
    return null;
  }

  async function getJudgeById(jid) {
    const [rows] = await db.execute('SELECT * FROM judges WHERE jid = ? LIMIT 1', [jid]);
    return rows[0] || null;
  }

  async function getJudgeByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM judges WHERE LOWER(email) = LOWER(?) LIMIT 1', [email]);
    return rows[0] || null;
  }

  function serializeJudge(judge) {
    return {
      jid: judge.jid,
      name: judge.name,
      email: judge.email,
      phone: judge.phone,
      residential_address: judge.residential_address,
      commercial_address: judge.commercial_address,
      company: judge.company,
      exp: judge.exp,
      events: judge.events,
      domains: judge.domains,
      slots: judge.slots,
      min_projects: judge.min_projects,
      remark: judge.remark,
      referral: judge.referral,
      isPICT: judge.isPICT,
      date: judge.date,
      sr_no: judge.sr_no,
      mode: judge.mode,
      registeredEvents: parseJudgeRegisteredEvents(judge.events),
      normalizedDomains: normalizeDomains(judge.domains),
      normalizedSlots: normalizeSlots(judge.slots),
    };
  }

  async function getStatusForJudgeEvent(jid, eventName) {
    await ensureStatusTableMetadata();

    const [countRows] = await db.execute(
      `SELECT COUNT(*) AS count, MAX(created_at) AS last_created_at
       FROM judge_project_preferences
       WHERE judge_id = ? AND event_name = ?`,
      [jid, eventName]
    );

    const preferenceCount = Number(countRows[0]?.count || 0);
    const lastCreatedAt = countRows[0]?.last_created_at || null;

    if (!statusTableExists) {
      return { submitted: preferenceCount > 0, submittedAt: lastCreatedAt, count: preferenceCount };
    }

    if (statusHasEventName) {
      const [rows] = await db.execute(
        `SELECT submitted, submitted_at
         FROM judge_preference_status
         WHERE judge_id = ? AND event_name = ?
         LIMIT 1`,
        [jid, eventName]
      );

      if (rows.length > 0) {
        return {
          submitted: Boolean(rows[0].submitted),
          submittedAt: rows[0].submitted_at || lastCreatedAt,
          count: preferenceCount,
        };
      }

      return { submitted: preferenceCount > 0, submittedAt: lastCreatedAt, count: preferenceCount };
    }

    const [rows] = await db.execute(
      `SELECT submitted, submitted_at
       FROM judge_preference_status
       WHERE judge_id = ?
       LIMIT 1`,
      [jid]
    );

    if (rows.length > 0) {
      return {
        submitted: Boolean(rows[0].submitted) || preferenceCount > 0,
        submittedAt: rows[0].submitted_at || lastCreatedAt,
        count: preferenceCount,
      };
    }

    return { submitted: preferenceCount > 0, submittedAt: lastCreatedAt, count: preferenceCount };
  }

  function isProjectEligibleForJudge(project, judgeDomains, judgeSlots) {
    const projectDomain = String(project.domain || 'OT').trim().toUpperCase();
    const normalizedDomain = projectDomain === 'DSP' ? 'DS' : projectDomain;
    if (!judgeDomains.includes(normalizedDomain)) return false;

    const projectSlots = parseProjectSlotList(project.timeslot || project.slot);
    if (!projectSlots.length) return true;

    return projectSlots.some((slot) => judgeSlots.includes(slot));
  }

  async function getDashboardEvents(jid, strictLock) {
    const judge = await getJudgeById(jid);
    if (!judge) throw new AppError(404, 'fail', 'Judge not found');

    const registeredEvents = parseJudgeRegisteredEvents(judge.events);

    const events = await Promise.all(
      EVENT_REGISTRY.map(async (event) => {
        const registered = registeredEvents.includes(event.key);
        const status = registered
          ? await getStatusForJudgeEvent(jid, event.key)
          : { submitted: false, submittedAt: null };

        return {
          key: event.key,
          label: event.label,
          registered,
          disabled: !registered,
          disabledReason: registered ? null : `Not registered for ${event.label}`,
          submitted: status.submitted,
          submittedAt: status.submittedAt,
          canEdit: registered ? (!strictLock || !status.submitted) : false,
        };
      })
    );

    const defaultEventKey = events.find((event) => event.registered)?.key || events[0]?.key || null;
    return { events, defaultEventKey };
  }

  async function getPreferenceProjects(eventName, jid, page, limit, search) {
    const config = EVENT_CONFIG_BY_KEY[eventName];
    if (!config) throw new AppError(400, 'fail', 'Invalid event_name');

    const judge = await getJudgeById(jid);
    if (!judge) throw new AppError(404, 'fail', 'Judge not found');
    if (!isJudgeRegisteredForEvent(judge, eventName)) {
      throw new AppError(403, 'fail', `Not registered for ${eventName}`);
    }

    const exists = await tableExists(config.projectTable);
    if (!exists) {
      return {
        data: [],
        totalEligible: 0,
        totalMatches: 0,
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    }

    const [rows] = await db.execute(`SELECT * FROM ${config.projectTable} ORDER BY pid ASC`);

    const judgeDomains = normalizeDomains(judge.domains);
    const judgeSlots = normalizeSlots(judge.slots);

    const eligibleByDomainSlot = rows.filter((project) => isProjectEligibleForJudge(project, judgeDomains, judgeSlots));
    const eligibleRows = eligibleByDomainSlot.filter((project) => {
      const judgeCount = getProjectJudgeCount(project);
      return isJudgeCountEligible(judgeCount);
    });
    const totalEligible = eligibleRows.length;

    let matchingRows = eligibleRows;
    if (search) {
      const lowSearch = search.toLowerCase();
      matchingRows = eligibleRows.filter((project) => {
        const pid = String(project.pid || '').toLowerCase();
        const title = String(project.title || '').toLowerCase();
        const abstract = String(project.abstract || '').toLowerCase();
        const domain = String(project.domain || '').toLowerCase();
        return pid.includes(lowSearch) || title.includes(lowSearch) || abstract.includes(lowSearch) || domain.includes(lowSearch);
      });
    }

    const totalMatches = matchingRows.length;
    const totalPages = Math.max(1, Math.ceil(totalMatches / limit));
    const offset = (page - 1) * limit;

    const pageRows = matchingRows.slice(offset, offset + limit).map((project) => ({
      ...project,
      pid: project.pid,
      title: project.title || 'Untitled Project',
      abstract: project.abstract || '',
      domain: String(project.domain || 'OT').toUpperCase() === 'DSP' ? 'DS' : String(project.domain || 'OT').toUpperCase(),
      timeslot: project.timeslot || project.slot || null,
      slot: project.slot || project.timeslot || null,
      judge_count: getProjectJudgeCount(project),
      event_name: eventName,
    }));

    return {
      data: pageRows,
      totalEligible,
      totalMatches,
      total: totalMatches,
      page,
      limit,
      totalPages,
    };
  }

  async function getPreferenceStatus(eventName, jid, strictLock, preferencePolicy) {
    if (!EVENT_CONFIG_BY_KEY[eventName]) throw new AppError(400, 'fail', 'Invalid event_name');

    const judge = await getJudgeById(jid);
    if (!judge) throw new AppError(404, 'fail', 'Judge not found');
    if (!isJudgeRegisteredForEvent(judge, eventName)) {
      throw new AppError(403, 'fail', `Not registered for ${eventName}`);
    }

    const status = await getStatusForJudgeEvent(jid, eventName);

    const [prefRows] = await db.execute(
      `SELECT project_id AS pid, preference_rank AS \`rank\`, timeslot
       FROM judge_project_preferences
       WHERE judge_id = ? AND event_name = ?
       ORDER BY preference_rank ASC`,
      [jid, eventName]
    );

    let preferences = [];
    if (prefRows.length > 0) {
      const tableName = EVENT_CONFIG_BY_KEY[eventName].projectTable;
      const [projectRows] = await db.execute(`SELECT pid, title FROM ${tableName}`);
      const byPid = new Map(projectRows.map((row) => [String(row.pid), row.title]));
      preferences = prefRows.map((row) => ({ ...row, title: byPid.get(String(row.pid)) || 'Unknown Project' }));
    }

    return {
      submitted: status.submitted,
      submittedAt: status.submittedAt,
      canEdit: !strictLock || !status.submitted,
      policy: preferencePolicy,
      preferences,
    };
  }

  async function submitPreferences(eventName, jid, preferences, strictLock, preferencePolicy) {
    if (!EVENT_CONFIG_BY_KEY[eventName]) throw new AppError(400, 'fail', 'Invalid event_name');

    const judge = await getJudgeById(jid);
    if (!judge) throw new AppError(404, 'fail', 'Judge not found');
    if (!isJudgeRegisteredForEvent(judge, eventName)) {
      throw new AppError(403, 'fail', `Not registered for ${eventName}`);
    }

    if (!Array.isArray(preferences)) {
      throw new AppError(400, 'fail', 'Preferences must be an array');
    }

    const parsedPreferences = preferences.map((preference) => ({
      pid: String(preference.pid || '').trim(),
      rank: Number.parseInt(preference.rank, 10),
    }));

    const seenProjects = new Set();
    const seenRanks = new Set();
    for (const preference of parsedPreferences) {
      if (!preference.pid || !Number.isInteger(preference.rank) || preference.rank <= 0) {
        throw new AppError(400, 'fail', 'Invalid preference payload');
      }
      if (seenProjects.has(preference.pid)) {
        throw new AppError(400, 'fail', `Duplicate project selected: ${preference.pid}`);
      }
      if (seenRanks.has(preference.rank)) {
        throw new AppError(400, 'fail', `Duplicate rank selected: ${preference.rank}`);
      }
      seenProjects.add(preference.pid);
      seenRanks.add(preference.rank);
    }

    const sortedRanks = [...seenRanks].sort((a, b) => a - b);
    const hasSequentialRanks = sortedRanks.every((rank, index) => rank === index + 1);
    if (!hasSequentialRanks) {
      throw new AppError(400, 'fail', 'Ranks must be sequential (1..N)');
    }

    const tableName = EVENT_CONFIG_BY_KEY[eventName].projectTable;
    const projectIds = parsedPreferences.map((preference) => preference.pid);
    const placeholders = projectIds.map(() => '?').join(',');
    const timeslotColumn = await getProjectTimeslotColumn(eventName);
    const judgeCountColumn = await getProjectJudgeCountColumn(eventName);
    const timeslotSelect = timeslotColumn ? `${timeslotColumn} AS timeslot_value` : 'NULL AS timeslot_value';
    const judgeCountSelect = judgeCountColumn ? `${judgeCountColumn} AS judge_count_value` : '0 AS judge_count_value';

    const [projectRows] = await db.execute(
      `SELECT pid, domain, ${timeslotSelect}, ${judgeCountSelect} FROM ${tableName} WHERE pid IN (${placeholders})`,
      projectIds
    );

    if (projectRows.length !== parsedPreferences.length) {
      const found = new Set(projectRows.map((project) => String(project.pid)));
      const missing = projectIds.filter((pid) => !found.has(String(pid)));
      throw new AppError(400, 'fail', `Unknown project ids: ${missing.join(', ')}`);
    }

    const judgeDomains = normalizeDomains(judge.domains);
    const judgeSlots = normalizeSlots(judge.slots);
    const byPid = new Map(projectRows.map((project) => [String(project.pid), project]));

    for (const preference of parsedPreferences) {
      const project = byPid.get(preference.pid);
      const eligible = isProjectEligibleForJudge(
        { ...project, timeslot: project.timeslot_value, slot: project.timeslot_value },
        judgeDomains,
        judgeSlots
      );

      if (!eligible) {
        throw new AppError(400, 'fail', `Project ${preference.pid} is not eligible for your domain/slot constraints`);
      }

      const judgeCount = getProjectJudgeCount(project);
      if (!isJudgeCountEligible(judgeCount)) {
        throw new AppError(
          400,
          'fail',
          `Project ${preference.pid} is full (current judges must be less than ${MAX_PROJECT_JUDGES})`
        );
      }
    }

    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const status = await getStatusForJudgeEvent(jid, eventName);
      if (strictLock && status.submitted) {
        throw new AppError(409, 'fail', 'Preferences already submitted and locked for this event');
      }

      await connection.execute(
        'DELETE FROM judge_project_preferences WHERE judge_id = ? AND event_name = ?',
        [jid, eventName]
      );

      const ordered = [...parsedPreferences].sort((a, b) => a.rank - b.rank);
      const values = ordered.map((preference) => [
        jid,
        preference.pid,
        eventName,
        preference.rank,
        byPid.get(preference.pid).timeslot_value || null,
      ]);

      if (values.length > 0) {
        await connection.query(
          'INSERT INTO judge_project_preferences (judge_id, project_id, event_name, preference_rank, timeslot) VALUES ?',
          [values]
        );
      }

      await ensureStatusTableMetadata();
      if (statusTableExists) {
        if (statusHasEventName) {
          await connection.execute(
            `INSERT INTO judge_preference_status (judge_id, event_name, submitted, submitted_at)
             VALUES (?, ?, 1, NOW())
             ON DUPLICATE KEY UPDATE submitted = VALUES(submitted), submitted_at = VALUES(submitted_at)`,
            [jid, eventName]
          );
        } else {
          await connection.execute(
            `INSERT INTO judge_preference_status (judge_id, submitted, submitted_at)
             VALUES (?, 1, NOW())
             ON DUPLICATE KEY UPDATE submitted = VALUES(submitted), submitted_at = VALUES(submitted_at)`,
            [jid]
          );
        }
      }

      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }

    return {
      submitted: true,
      canEdit: !strictLock,
      message: strictLock
        ? 'Preferences submitted successfully and locked'
        : 'Preferences submitted successfully and can be edited later',
      policy: preferencePolicy,
    };
  }

  return {
    eventNameOrNull,
    getJudgeById,
    getJudgeByEmail,
    serializeJudge,
    getDashboardEvents,
    getPreferenceProjects,
    getPreferenceStatus,
    submitPreferences,
  };
}

export default createJudgeDashboardServices;
