// import express from 'express';
// import connectDatabase from '../config/database.js';

// const router = express.Router();
// const db = connectDatabase();

// router.get('/allocations', async (req, res) => {
//   const { event = 'impetus' } = req.query;

//   try {


//     const [judgesRows] = await db.query(`
//   SELECT jid, name, mode
//   FROM judges
//   WHERE JSON_CONTAINS(events, JSON_QUOTE(?))
//   ORDER BY name;
// `, [event]);

//     // 🔥 2. Get allocations (SOURCE OF TRUTH)
//     const [allocRows] = await db.query(`
//       SELECT jid, pid
//       FROM allocations
//       WHERE event_name = ?
//     `, [event]);

//     // 👉 group allocations by judge
//     const allocationMap = new Map();

//     allocRows.forEach(row => {
//       if (!allocationMap.has(row.jid)) {
//         allocationMap.set(row.jid, []);
//       }
//       allocationMap.get(row.jid).push(row.pid);
//     });

//     // 🔥 3. Get projects (only needed columns)
//     const [projectsRows] = await db.query(`
//       SELECT pid, title
//       FROM ${event === 'impetus' ? 'impetus_projects' : 'concepts_projects'}
//     `);

//     const projectMap = new Map(
//       projectsRows.map(p => [p.pid, p.title])
//     );

//     // 🔥 4. Get evaluations
//     const [evalRows] = await db.query(`
//       SELECT pid, jid, total
//       FROM ${event === 'impetus' ? 'impetus_evaluation' : 'concepts_evaluation'}
//     `);

//     const evalMap = new Map();
//     evalRows.forEach(row => {
//       const key = `${row.pid}|${row.jid}`;
//       evalMap.set(key, row.total != null && Number(row.total) > 0);
//     });

//     // 🔥 5. Final mapping (MAIN LOGIC)
//     const judges = judgesRows.map(judge => {

//       const allocatedPids = allocationMap.get(judge.jid) || [];

//       const projects = allocatedPids.map(pid => ({
//         pid,
//         title: projectMap.get(pid) || 'Unknown',
//         evaluated: evalMap.get(`${pid}|${judge.jid}`) || false
//       }));

//       const totalAllocated = projects.length;
//       const evaluatedCount = projects.filter(p => p.evaluated).length;
//       const remaining = totalAllocated - evaluatedCount;

//       // ✅ FIXED STATUS LOGIC
//       let evaluationStatus = null;

//       if (totalAllocated === 0) {
//         evaluationStatus = null; // 👈 no category
//       } 
//       else if (evaluatedCount === 0) {
//         evaluationStatus = 'incomplete';
//       } 
//       else if (evaluatedCount === totalAllocated) {
//         evaluationStatus = 'completed';
//       } 
//       else {
//         evaluationStatus = 'partial';
//       }

//       return {
//         jid: judge.jid,
//         name: judge.name,
//         mode: judge.mode || 'Offline',
//         is_online: judge.mode?.toLowerCase() === 'online',

//         allocated_projects: allocatedPids.join(','), // for your frontend
//         projects,

//         totalAllocated,
//         evaluatedCount,
//         remaining,
//         evaluationStatus
//       };
//     });

//     res.json({
//       success: true,
//       event,
//       totalJudges: judges.length,
//       judges
//     });

//   } catch (error) {
//     console.error('❌ Error fetching allocations:', error);

//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch allocations',
//       error: error.message
//     });
//   }
// });

// router.get('/project-allocations', async (req, res) => {
//   console.log("HELLO");
//   const { event = 'impetus' } = req.query;

//   try {

//     const groupTable = event === 'impetus'
//   ? 'impetus_group_info'
//   : 'concepts_group_info';

// const [projectsRows] = await db.query(`
//   SELECT DISTINCT p.pid, p.title, p.lab, g.mode
//   FROM ${event === 'impetus' ? 'impetus_projects' : 'concepts_projects'} p
//   JOIN tickets t ON p.pid = t.pid
//   LEFT JOIN ${groupTable} g ON p.pid = g.pid
//   WHERE t.step_no = 5
//   AND t.is_deleted = 0
// `);

//     // 🔥 2. Get allocations (pid ↔ jid)
//     const [allocRows] = await db.query(`
//       SELECT pid, jid
//       FROM allocations
//       WHERE event_name = ?
//     `, [event]);

//     // 🔥 3. Get judges
//     const [judgesRows] = await db.query(`
//       SELECT jid, name
//       FROM judges
//     `);

//     const judgeMap = new Map(
//       judgesRows.map(j => [j.jid, j.name])
//     );

//     // 🔥 4. Get evaluations
//     const [evalRows] = await db.query(`
//       SELECT pid, jid, total
//       FROM ${event === 'impetus' ? 'impetus_evaluation' : 'concepts_evaluation'}
//     `);

//     const evalMap = new Map();
//     evalRows.forEach(row => {
//       const key = `${row.pid}|${row.jid}`;
//       evalMap.set(key, row.total != null && Number(row.total) > 0);
//     });

//     // 🔥 5. Group allocations by project
//     const projectAllocMap = new Map();

//     allocRows.forEach(row => {
//       if (!projectAllocMap.has(row.pid)) {
//         projectAllocMap.set(row.pid, []);
//       }
//       projectAllocMap.get(row.pid).push(row.jid);
//     });

//     // 🔥 6. Final structure
//     const projects = projectsRows.map(project => {
//       const judgeIds = projectAllocMap.get(project.pid) || [];

//       const judges = judgeIds.map(jid => ({
//         jid,
//         name: judgeMap.get(jid) || 'Unknown Judge',
//         evaluated: evalMap.get(`${project.pid}|${jid}`) || false
//       }));

//       return {
//         pid: project.pid,
//         title: project.title,
//         session: project.lab || 'N/A',

//         // ✅ Mode mapping
//         mode: project.mode === '1'
//           ? 'Offline'
//           : project.mode === '0'
//           ? 'Online'
//           : 'Unknown',

//         date: null,
//         judges
//       };
//     });

//     res.json({
//       success: true,
//       event,
//       projects
//     });

//   } catch (error) {
//     console.error('❌ Error fetching project allocations:', error);

//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch project allocations',
//       error: error.message
//     });
//   }
// });

// router.get('/project-reallocation/:pid', async (req, res) => {
//   const { pid } = req.params;

//   // 🔥 Slot mapping function
//   const getJudgingSlots = (event_name) => {
//     const judgingSlotsImpetus = {
//       "1": "Friday, 27th March (11:00 AM - 2:00 PM)",
//       "2": "Friday, 27th March (2:00 PM - 5:00 PM)",
//       "3": "Friday, 27th March (5:00 PM - 7:00 PM)",
//       "4": "Saturday, 28th March (9:00 AM - 12:00 PM)",
//       "5": "Saturday, 28th March (1:00 PM - 3:00 PM)",
//       "6": "Saturday, 28th March (4:00 PM - 6:00 PM)"
//     };

//     const judgingSlotsConcepts = {
//       "1": "Friday, 27th March (11:00 AM - 2:00 PM)",
//       "2": "Friday, 27th March (2:00 PM - 4:00 PM)",
//       "3": "Friday, 27th March (4:00 PM - 7:00 PM)",
//       "4": "Saturday, 28th March (10:00 AM - 1:00 PM)",
//       "5": "Saturday, 28th March (1:00 PM - 4:00 PM)",
//       "6": "Saturday, 28th March (4:00 PM - 7:00 PM)"
//     };

//     return event_name === 'impetus'
//       ? judgingSlotsImpetus
//       : judgingSlotsConcepts;
//   };

//   try {
//     // 🔥 Detect event
//     const event = pid.startsWith('IM') ? 'impetus' : 'concepts';

//     const projectTable = event === 'impetus' ? 'impetus_projects' : 'concepts_projects';
//     const evalTable = event === 'impetus' ? 'impetus_evaluation' : 'concepts_evaluation';
//     const groupTable = event === 'impetus' ? 'impetus_group_info' : 'concepts_group_info';

//     // 🔥 Project
//     const [[project]] = await db.query(`
//       SELECT p.*, g.mode
//       FROM ${projectTable} p
//       LEFT JOIN ${groupTable} g ON p.pid = g.pid
//       WHERE p.pid = ?
//     `, [pid]);

//     if (!project) {
//       return res.status(404).json({ success: false, message: 'Project not found' });
//     }

//     // 🔥 Allocated judges (WITH SLOTS)
//     const [allocRows] = await db.query(`
//       SELECT a.jid, j.name, j.domains, a.slot_id as slots
//       FROM allocations a
//       JOIN judges j ON a.jid = j.jid
//       WHERE a.pid = ?
//     `, [pid]);

//     // 🔥 Evaluations
//     const [evalRows] = await db.query(`
//       SELECT jid, total
//       FROM ${evalTable}
//       WHERE pid = ?
//     `, [pid]);

//     const evalMap = new Map();
//     evalRows.forEach(e => {
//       evalMap.set(e.jid, e.total != null && Number(e.total) > 0);
//     });

//     // 🔥 Slot mapping
//     const slotMap = getJudgingSlots(event);

//     const allocatedJudges = allocRows.map(j => {
//       let parsedSlots = [];

//       try {
//         parsedSlots = JSON.parse(j.slots || "[]");
//       } catch (e) {
//         parsedSlots = [];
//       }

//       const slotDetails = parsedSlots.map(s => slotMap[s] || s);

//       return {
//         id: j.jid,
//         name: j.name,
//         expertise: j.domains || 'N/A',
//         evaluated: evalMap.get(j.jid) || false,
//         slots: slotDetails,                         // 🔥 date + time
//         schedule: slotDetails.map(s => `${project.lab} | ${s}`) // 🔥 lab + slot combo
//       };
//     });

//     // 🔥 Available judges
//     const [availableRows] = await db.query(`
//       SELECT jid, name, domains
//       FROM judges
//       WHERE JSON_CONTAINS(events, JSON_QUOTE(?))
//       AND jid NOT IN (
//         SELECT jid FROM allocations WHERE pid = ?
//       )
//     `, [event, pid]);

//     const availableJudges = availableRows.map(j => ({
//       id: j.jid,
//       name: j.name,
//       expertise: j.domains || 'N/A'
//     }));

//     res.json({
//       success: true,
//       event,
//       project: {
//         pid: project.pid,
//         title: project.title,
//         domain: project.domain,
//         description: project.abstract,
//         lab: project.lab,
//         mode: project.mode === '1' ? 'Offline' : 'Online'
//       },
//       allocatedJudges,
//       availableJudges
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// router.post('/reallocate-judge', async (req, res) => {
//   const { pid, oldJid, newJid } = req.body;

//   if (!pid || !oldJid || !newJid) {
//     return res.status(400).json({ success: false, message: 'Missing fields' });
//   }

//   const conn = await db.getConnection();

//   try {
//     await conn.beginTransaction();

//     // 🔥 Update judge while keeping slot_id and event_name intact
//     const [result] = await conn.query(`
//       UPDATE allocations
//       SET jid = ?
//       WHERE pid = ? AND jid = ?
//     `, [newJid, pid, oldJid]);

//     if (result.affectedRows === 0) {
//       // No allocation found to update
//       await conn.rollback();
//       return res.status(404).json({
//         success: false,
//         message: 'Old judge allocation not found'
//       });
//     }

//     await conn.commit();

//     res.json({
//       success: true,
//       message: 'Judge reallocated successfully, slots unchanged'
//     });

//   } catch (err) {
//     await conn.rollback();
//     console.error(err);

//     res.status(500).json({
//       success: false,
//       message: 'Reallocation failed',
//       error: err.message
//     });
//   } finally {
//     conn.release();
//   }
// });

// router.get('/project-schedule/:pid', async (req, res) => {
//   const { pid } = req.params;

//   if (!pid) {
//     return res.status(400).json({ success: false, message: 'PID is required' });
//   }

//   // 🔥 Determine event and tables
//   const event = pid.startsWith('IM') ? 'impetus' : 'concepts';
//   const projectTable = event === 'impetus' ? 'impetus_projects' : 'concepts_projects';

//   // 🔥 Slot time mapping
//   const getJudgingSlots = (event_name) => {
//     const impetusSlots = {
//       1: "Friday, 27th March (11:00 AM - 2:00 PM)",
//       2: "Friday, 27th March (2:00 PM - 5:00 PM)",
//       3: "Friday, 27th March (5:00 PM - 7:00 PM)",
//       4: "Saturday, 28th March (9:00 AM - 12:00 PM)",
//       5: "Saturday, 28th March (1:00 PM - 3:00 PM)",
//       6: "Saturday, 28th March (4:00 PM - 6:00 PM)",
//     };
//     const conceptsSlots = {
//       1: "Friday, 27th March (11:00 AM - 2:00 PM)",
//       2: "Friday, 27th March (2:00 PM - 4:00 PM)",
//       3: "Friday, 27th March (4:00 PM - 7:00 PM)",
//       4: "Saturday, 28th March (10:00 AM - 1:00 PM)",
//       5: "Saturday, 28th March (1:00 PM - 4:00 PM)",
//       6: "Saturday, 28th March (4:00 PM - 7:00 PM)",
//     };
//     return event_name === 'impetus' ? impetusSlots : conceptsSlots;
//   };

//   try {
//     // 🔥 Fetch project with lab & coordinator
//     const [[project]] = await db.query(`
//       SELECT title, domain, abstract, lab, coord, pid
//       FROM ${projectTable}
//       WHERE pid = ?
//     `, [pid]);

//     if (!project) {
//       return res.status(404).json({ success: false, message: 'Project not found' });
//     }

//     // 🔥 Fetch all allocations for this project
//     const [allocRows] = await db.query(`
//       SELECT slots
//       FROM allocations
//       WHERE pid = ?
//     `, [pid]);

//     // 🔥 Collect all unique slots
//     const uniqueSlots = new Set();
//     allocRows.forEach(row => {
//       if (row.slots) {
//         let slots = [];
//         try {
//           slots = JSON.parse(row.slots); // slots stored as JSON array
//         } catch (e) {
//           slots = [];
//         }
//         slots.forEach(s => uniqueSlots.add(s));
//       }
//     });

//     const assignedSlots = Array.from(uniqueSlots).sort((a, b) => Number(a) - Number(b));

//     res.json({
//       success: true,
//       event,
//       project: {
//         pid: project.pid,
//         title: project.title,
//         domain: project.domain,
//         description: project.abstract,
//         lab: project.lab,
//         coordinator: project.coord,
//         // mode: project.mode === '1' ? 'Offline' : 'Online',
//       },
//       assignedSlots,                  // unique slots for this project
//       judgingSlots: getJudgingSlots(event), // slotId => time mapping
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// export default router;




import express from 'express';

function createAdminViewRouter(dbService, middlewares, adminValidations) {
  const router = express.Router();

  // ---------------------- /project-schedule/:pid ----------------------
  router.get('/project-schedule/:pid', async (req, res) => {
    const db = dbService.db;
    const { pid } = req.params;
    if (!pid) return res.status(400).json({ success: false, message: 'PID is required' });

    const event = pid.startsWith('IM') ? 'impetus' : 'concepts';
    const projectTable = event === 'impetus' ? 'impetus_projects' : 'concepts_projects';

    const getJudgingSlots = (event_name) => {
      const impetusSlots = {
        1: "Friday, 27th March (11:00 AM - 2:00 PM)",
        2: "Friday, 27th March (2:00 PM - 5:00 PM)",
        3: "Friday, 27th March (5:00 PM - 7:00 PM)",
        4: "Saturday, 28th March (9:00 AM - 12:00 PM)",
        5: "Saturday, 28th March (1:00 PM - 3:00 PM)",
        6: "Saturday, 28th March (4:00 PM - 6:00 PM)"
      };
      const conceptsSlots = {
        1: "Friday, 27th March (11:00 AM - 2:00 PM)",
        2: "Friday, 27th March (2:00 PM - 4:00 PM)",
        3: "Friday, 27th March (4:00 PM - 7:00 PM)",
        4: "Saturday, 28th March (10:00 AM - 1:00 PM)",
        5: "Saturday, 28th March (1:00 PM - 4:00 PM)",
        6: "Saturday, 28th March (4:00 PM - 7:00 PM)"
      };
      return event_name === 'impetus' ? impetusSlots : conceptsSlots;
    };

    try {
      const [[project]] = await db.query(`
        SELECT title, domain, abstract, lab, coord, pid
        FROM ${projectTable}
        WHERE pid = ?
      `, [pid]);

      if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

      const [allocRows] = await db.query(`SELECT slots FROM allocations WHERE pid = ?`, [pid]);

      const uniqueSlots = new Set();
      allocRows.forEach(row => {
        let slots = [];
        try { slots = JSON.parse(row.slots); } catch (e) { slots = []; }
        slots.forEach(s => uniqueSlots.add(s));
      });

      const assignedSlots = Array.from(uniqueSlots).sort((a, b) => Number(a) - Number(b));

      res.json({
        success: true,
        event,
        project: {
          pid: project.pid,
          title: project.title,
          domain: project.domain,
          description: project.abstract,
          lab: project.lab,
          coordinator: project.coord
        },
        assignedSlots,
        judgingSlots: getJudgingSlots(event)
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // ✅ Protect all routes with admin login
  router.use((req, res, next) => {
    try {
      middlewares.verifyAdminLogin(req, res, next);
    } catch (err) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
  });

  // ---------------------- /allocations ----------------------
  // router.get('/allocations', async (req, res) => {
  //   const db = dbService.db;
  //   const { event = 'impetus' } = req.query;

  //   try {
  //     const [judgesRows] = await db.query(`
  //       SELECT jid, name, mode
  //       FROM judges
  //       WHERE JSON_CONTAINS(events, JSON_QUOTE(?))
  //       ORDER BY name;
  //     `, [event]);

  //     const [allocRows] = await db.query(`
  //       SELECT jid, pid
  //       FROM allocations
  //       WHERE event_name = ?
  //     `, [event]);

  //     const allocationMap = new Map();
  //     allocRows.forEach(row => {
  //       if (!allocationMap.has(row.jid)) allocationMap.set(row.jid, []);
  //       allocationMap.get(row.jid).push(row.pid);
  //     });

  //     const [projectsRows] = await db.query(`
  //       SELECT pid, title
  //       FROM ${event === 'impetus' ? 'impetus_projects' : 'concepts_projects'}
  //     `);

  //     const projectMap = new Map(projectsRows.map(p => [p.pid, p.title]));

  //     const [evalRows] = await db.query(`
  //       SELECT pid, jid, total
  //       FROM ${event === 'impetus' ? 'impetus_evaluation' : 'concepts_evaluation'}
  //     `);

  //     const evalMap = new Map();
  //     evalRows.forEach(row => {
  //       evalMap.set(`${row.pid}|${row.jid}`, row.total != null && Number(row.total) > 0);
  //     });

  //     const judges = judgesRows.map(judge => {
  //       const allocatedPids = allocationMap.get(judge.jid) || [];
  //       const projects = allocatedPids.map(pid => ({
  //         pid,
  //         title: projectMap.get(pid) || 'Unknown',
  //         evaluated: evalMap.get(`${pid}|${judge.jid}`) || false
  //       }));

  //       const totalAllocated = projects.length;
  //       const evaluatedCount = projects.filter(p => p.evaluated).length;
  //       const remaining = totalAllocated - evaluatedCount;

  //       let evaluationStatus = null;
  //       if (totalAllocated === 0) evaluationStatus = null;
  //       else if (evaluatedCount === 0) evaluationStatus = 'incomplete';
  //       else if (evaluatedCount === totalAllocated) evaluationStatus = 'completed';
  //       else evaluationStatus = 'partial';

  //       return {
  //         jid: judge.jid,
  //         name: judge.name,
  //         mode: judge.mode || 'Offline',
  //         is_online: judge.mode?.toLowerCase() === 'online',
  //         allocated_projects: allocatedPids.join(','),
  //         projects,
  //         totalAllocated,
  //         evaluatedCount,
  //         remaining,
  //         evaluationStatus
  //       };
  //     });

  //     res.json({ success: true, event, totalJudges: judges.length, judges });
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json({ success: false, message: err.message });
  //   }
  // });

router.get('/allocations', async (req, res) => {
  const db = dbService.db;
  const { event = 'impetus' } = req.query;

  try {
    const [judgesRows] = await db.query(`
      SELECT jid, name, mode, domains, email, phone,slots
      FROM judges
      WHERE JSON_CONTAINS(events, JSON_QUOTE(?))
      ORDER BY name;
    `, [event]);

    const [allocRows] = await db.query(`
      SELECT jid, pid
      FROM allocations
      WHERE event_name = ?
    `, [event]);

    const allocationMap = new Map();
    allocRows.forEach(row => {
      if (!allocationMap.has(row.jid)) allocationMap.set(row.jid, []);
      allocationMap.get(row.jid).push(row.pid);
    });

    const [projectsRows] = await db.query(`
      SELECT pid, title
      FROM ${event === 'impetus' ? 'impetus_projects' : 'concepts_projects'}
    `);

    const projectMap = new Map(projectsRows.map(p => [p.pid, p.title]));

    const [evalRows] = await db.query(`
      SELECT pid, jid, total
      FROM ${event === 'impetus' ? 'impetus_evaluation' : 'concepts_evaluation'}
    `);

    const evalMap = new Map();
    evalRows.forEach(row => {
      evalMap.set(`${row.pid}|${row.jid}`, row.total != null && Number(row.total) > 0);
    });

    const judges = judgesRows.map(judge => {
      const allocatedPids = allocationMap.get(judge.jid) || [];

      const projects = allocatedPids.map(pid => ({
        pid,
        title: projectMap.get(pid) || 'Unknown',
        evaluated: evalMap.get(`${pid}|${judge.jid}`) || false
      }));

      const totalAllocated = projects.length;
      const evaluatedCount = projects.filter(p => p.evaluated).length;
      const remaining = totalAllocated - evaluatedCount;

      let evaluationStatus = 'incomplete';
      if (totalAllocated === 0) evaluationStatus = null;
      else if (evaluatedCount === totalAllocated) evaluationStatus = 'completed';
      else if (evaluatedCount > 0) evaluationStatus = 'partial';

      // Fixed Online/Offline logic as per your clarification
      const modeValue = judge.mode !== null && judge.mode !== undefined 
        ? Number(judge.mode) 
        : 1; // default to offline if null/undefined

      const isOnline = modeValue === 0;   // 0 = Online, 1 = Offline

      return {
        jid: judge.jid,
        name: judge.name,
        email: judge.email || '',
        phone: judge.phone || '',
        mode: judge.mode || '1',           // keep original for reference
        is_online: isOnline,               // true = Online, false = Offline
        domains: Array.isArray(judge.domains)
          ? judge.domains
          : (judge.domains ? JSON.parse(judge.domains) : []),
           slots: Array.isArray(judge.slots)
    ? judge.slots
    : (judge.slots ? JSON.parse(judge.slots) : []),
        allocated_projects: allocatedPids.join(','),
        projects,
        totalAllocated,
        evaluatedCount,
        remaining,
        evaluationStatus
      };
    });

    res.json({
      success: true,
      event,
      totalJudges: judges.length,
      judges
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


  // ---------------------- /project-allocations ----------------------
  router.get('/project-allocations', async (req, res) => {
    const db = dbService.db;
    const { event = 'impetus' } = req.query;

    try {
      const groupTable = event === 'impetus' ? 'impetus_group_info' : 'concepts_group_info';

      const [projectsRows] = await db.query(`
        SELECT DISTINCT p.pid, p.title, p.lab, g.mode
        FROM ${event === 'impetus' ? 'impetus_projects' : 'concepts_projects'} p
        JOIN tickets t ON p.pid = t.pid
        LEFT JOIN ${groupTable} g ON p.pid = g.pid
        WHERE t.step_no = 5
        AND t.is_deleted = 0
      `);

      const [allocRows] = await db.query(`
        SELECT pid, jid
        FROM allocations
        WHERE event_name = ?
      `, [event]);

      const [judgesRows] = await db.query(`
        SELECT jid, name
        FROM judges
      `);

      const judgeMap = new Map(judgesRows.map(j => [j.jid, j.name]));

      const [evalRows] = await db.query(`
        SELECT pid, jid, total
        FROM ${event === 'impetus' ? 'impetus_evaluation' : 'concepts_evaluation'}
      `);

      const evalMap = new Map();
      evalRows.forEach(row => {
        evalMap.set(`${row.pid}|${row.jid}`, row.total != null && Number(row.total) > 0);
      });

      const projectAllocMap = new Map();
      allocRows.forEach(row => {
        if (!projectAllocMap.has(row.pid)) projectAllocMap.set(row.pid, []);
        projectAllocMap.get(row.pid).push(row.jid);
      });

      const projects = projectsRows.map(project => {
        const judgeIds = projectAllocMap.get(project.pid) || [];
        const judges = judgeIds.map(jid => ({
          jid,
          name: judgeMap.get(jid) || 'Unknown Judge',
          evaluated: evalMap.get(`${project.pid}|${jid}`) || false
        }));

        return {
          pid: project.pid,
          title: project.title,
          session: project.lab || 'N/A',
          mode: project.mode === '1' ? 'Offline' : project.mode === '0' ? 'Online' : 'Unknown',
          date: null,
          judges
        };
      });

      res.json({ success: true, event, projects });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // ---------------------- /project-reallocation/:pid ----------------------
  router.get('/project-reallocation/:pid', async (req, res) => {
    const db = dbService.db;
    const { pid } = req.params;

    const getJudgingSlots = (event_name) => {
      const impetusSlots = {
        "1": "Friday, 27th March (11:00 AM - 2:00 PM)",
        "2": "Friday, 27th March (2:00 PM - 5:00 PM)",
        "3": "Friday, 27th March (5:00 PM - 7:00 PM)",
        "4": "Saturday, 28th March (9:00 AM - 12:00 PM)",
        "5": "Saturday, 28th March (1:00 PM - 3:00 PM)",
        "6": "Saturday, 28th March (4:00 PM - 6:00 PM)"
      };
      const conceptsSlots = {
        "1": "Friday, 27th March (11:00 AM - 2:00 PM)",
        "2": "Friday, 27th March (2:00 PM - 4:00 PM)",
        "3": "Friday, 27th March (4:00 PM - 7:00 PM)",
        "4": "Saturday, 28th March (10:00 AM - 1:00 PM)",
        "5": "Saturday, 28th March (1:00 PM - 4:00 PM)",
        "6": "Saturday, 28th March (4:00 PM - 7:00 PM)"
      };
      return event_name === 'impetus' ? impetusSlots : conceptsSlots;
    };

    try {
      const event = pid.startsWith('IM') ? 'impetus' : 'concepts';
      const projectTable = event === 'impetus' ? 'impetus_projects' : 'concepts_projects';
      const evalTable = event === 'impetus' ? 'impetus_evaluation' : 'concepts_evaluation';
      const groupTable = event === 'impetus' ? 'impetus_group_info' : 'concepts_group_info';

      const [[project]] = await db.query(`
        SELECT p.*, g.mode
        FROM ${projectTable} p
        LEFT JOIN ${groupTable} g ON p.pid = g.pid
        WHERE p.pid = ?
      `, [pid]);

      if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

      const [allocRows] = await db.query(`
        SELECT a.jid, j.name, j.domains, a.slots
        FROM allocations a
        JOIN judges j ON a.jid = j.jid
        WHERE a.pid = ?
      `, [pid]);

      const [evalRows] = await db.query(`
        SELECT jid, total
        FROM ${evalTable}
        WHERE pid = ?
      `, [pid]);

      const evalMap = new Map();
      evalRows.forEach(e => evalMap.set(e.jid, e.total != null && Number(e.total) > 0));

      const slotMap = getJudgingSlots(event);

      const allocatedJudges = allocRows.map(j => {
        let parsedSlots = [];
        try { parsedSlots = JSON.parse(j.slots || "[]"); } catch (e) { parsedSlots = []; }

        const slotDetails = parsedSlots.map(s => slotMap[s] || s);
        return {
          id: j.jid,
          name: j.name,
          expertise: j.domains || 'N/A',
          evaluated: evalMap.get(j.jid) || false,
          slots: slotDetails,
          schedule: slotDetails.map(s => `${project.lab} | ${s}`)
        };
      });

      const [availableRows] = await db.query(`
        SELECT jid, name, domains
        FROM judges
        WHERE JSON_CONTAINS(events, JSON_QUOTE(?))
        AND jid NOT IN (SELECT jid FROM allocations WHERE pid = ?)
      `, [event, pid]);

      const availableJudges = availableRows.map(j => ({
        id: j.jid,
        name: j.name,
        expertise: j.domains || 'N/A'
      }));

      res.json({
        success: true,
        event,
        project: {
          pid: project.pid,
          title: project.title,
          domain: project.domain,
          description: project.abstract,
          lab: project.lab,
          mode: project.mode === '1' ? 'Offline' : 'Online'
        },
        allocatedJudges,
        availableJudges
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // ---------------------- /reallocate-judge ----------------------
  router.post('/reallocate-judge', async (req, res) => {
    const db = dbService.db;
    const { pid, oldJid, newJid } = req.body;

    if (!pid || !oldJid || !newJid)
      return res.status(400).json({ success: false, message: 'Missing fields' });

    const conn = await db.getConnection();

    try {
      await conn.beginTransaction();

      const [result] = await conn.query(`
        UPDATE allocations
        SET jid = ?
        WHERE pid = ? AND jid = ?
      `, [newJid, pid, oldJid]);

      if (result.affectedRows === 0) {
        await conn.rollback();
        return res.status(404).json({ success: false, message: 'Old judge allocation not found' });
      }

      await conn.commit();
      res.json({ success: true, message: 'Judge reallocated successfully, slots unchanged' });
    } catch (err) {
      await conn.rollback();
      console.error(err);
      res.status(500).json({ success: false, message: 'Reallocation failed', error: err.message });
    } finally {
      conn.release();
    }
  });

  

  return router;
}

export default createAdminViewRouter;