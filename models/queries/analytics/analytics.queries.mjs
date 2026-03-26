function analyticsQueries() {
  const getEventTables = (event_name) => {
    const safeEvent = event_name === 'impetus' || event_name === 'concepts' ? event_name : 'concepts';
    return {
      projectsTable: `${safeEvent}_projects`,
      evaluationTable: `${safeEvent}_evaluation`,
      groupInfoTable: `${safeEvent}_group_info`,
    };
  };

  const getDashboardKpis = (event_name) => {
    const { projectsTable, evaluationTable } = getEventTables(event_name);
    return `SELECT
      COUNT(*) AS total_allocated_projects,
      SUM(CASE WHEN COALESCE(e.received, 0) > 0 THEN 1 ELSE 0 END) AS evaluated_projects,
      SUM(
        CASE
          WHEN COALESCE(e.received, 0) > 0
               AND COALESCE(e.received, 0) < COALESCE(p.count_of_judges, 0) THEN 1
          ELSE 0
        END
      ) AS partially_evaluated_projects,
      SUM(
        CASE
          WHEN COALESCE(p.count_of_judges, 0) > 0
               AND COALESCE(e.received, 0) >= COALESCE(p.count_of_judges, 0) THEN 1
          ELSE 0
        END
      ) AS completely_evaluated_projects,
      (SELECT COUNT(*) FROM judges) AS total_judges
    FROM ${projectsTable} p
    LEFT JOIN (
      SELECT pid, COUNT(DISTINCT jid) AS received
      FROM ${evaluationTable}
      GROUP BY pid
    ) e ON e.pid = p.pid;`;
  };

  const getDailyAllocationTrend = (event_name) => {
    const { projectsTable, groupInfoTable } = getEventTables(event_name);
    return `SELECT
      p.domain,
      DATE(g.date) AS allocation_date,
      COUNT(*) AS allocated_projects
    FROM ${projectsTable} p
    INNER JOIN ${groupInfoTable} g ON g.pid = p.pid
    WHERE g.date >= CURDATE() - INTERVAL 6 DAY
    GROUP BY p.domain, DATE(g.date)
    ORDER BY allocation_date ASC, p.domain ASC;`;
  };

  const getEvaluationSummaryByDomain = (event_name) => {
    const { projectsTable, evaluationTable, groupInfoTable } = getEventTables(event_name);
    return `SELECT
      pe.domain,
      COUNT(DISTINCT CASE WHEN pe.received > 0 THEN pe.pid END) AS evaluated_projects,
      COUNT(DISTINCT CASE WHEN pe.received > 0 AND pe.received < pe.expected THEN pe.pid END) AS partially_evaluated_projects,
      COUNT(DISTINCT CASE WHEN pe.expected > 0 AND pe.received >= pe.expected THEN pe.pid END) AS completely_evaluated_projects
    FROM (
      SELECT
        p.pid,
        p.domain,
        COALESCE(p.count_of_judges, 0) AS expected,
        COALESCE(e.received, 0) AS received
      FROM ${projectsTable} p
      INNER JOIN ${groupInfoTable} g ON g.pid = p.pid
      LEFT JOIN (
        SELECT pid, COUNT(DISTINCT jid) AS received
        FROM ${evaluationTable}
        GROUP BY pid
      ) e ON e.pid = p.pid
    ) pe
    GROUP BY pe.domain
    ORDER BY pe.domain;`;
  };

  const getGeographicBreakdown = (event_name) => {
    const { groupInfoTable } = getEventTables(event_name);
    return `SELECT
      SUM(CASE WHEN LOWER(COALESCE(state, '')) = 'maharashtra' THEN 1 ELSE 0 END) AS from_maharashtra,
      SUM(CASE WHEN LOWER(COALESCE(state, '')) <> 'maharashtra' THEN 1 ELSE 0 END) AS outside_maharashtra,
      SUM(CASE WHEN LOWER(COALESCE(country, 'india')) = 'india' THEN 1 ELSE 0 END) AS national,
      SUM(CASE WHEN LOWER(COALESCE(country, 'india')) <> 'india' THEN 1 ELSE 0 END) AS international,
      SUM(CASE WHEN LOWER(COALESCE(city, '')) = 'pune' THEN 1 ELSE 0 END) AS within_pune,
      SUM(CASE WHEN LOWER(COALESCE(city, '')) <> 'pune' THEN 1 ELSE 0 END) AS outside_pune
    FROM ${groupInfoTable};`;
  };

  const getJudgeCountByDomain = (event_name) => {
    const { projectsTable } = getEventTables(event_name);
    return `SELECT
      p.domain,
      COUNT(DISTINCT ja.jid) AS judges_count
    FROM judge_allocations ja
    INNER JOIN ${projectsTable} p
      ON FIND_IN_SET(
        p.pid,
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(COALESCE(ja.allocated_projects, ''), '[', ''),
              ']',
              ''
            ),
            '"',
            ''
          ),
          ' ',
          ''
        )
      ) > 0
    GROUP BY p.domain
    ORDER BY p.domain;`;
  };

  const getDashboardKpisImpetus = () => getDashboardKpis('impetus');
  const getDashboardKpisConcepts = () => getDashboardKpis('concepts');

  const getDailyAllocationTrendImpetus = () => getDailyAllocationTrend('impetus');
  const getDailyAllocationTrendConcepts = () => getDailyAllocationTrend('concepts');

  const getEvaluationSummaryByDomainImpetus = () => getEvaluationSummaryByDomain('impetus');
  const getEvaluationSummaryByDomainConcepts = () => getEvaluationSummaryByDomain('concepts');

  const getGeographicBreakdownImpetus = () => getGeographicBreakdown('impetus');
  const getGeographicBreakdownConcepts = () => getGeographicBreakdown('concepts');

  const getJudgeCountByDomainImpetus = () => getJudgeCountByDomain('impetus');
  const getJudgeCountByDomainConcepts = () => getJudgeCountByDomain('concepts');

  return {
    getDashboardKpis,
    getDailyAllocationTrend,
    getEvaluationSummaryByDomain,
    getGeographicBreakdown,
    getJudgeCountByDomain,
    getDashboardKpisImpetus,
    getDashboardKpisConcepts,
    getDailyAllocationTrendImpetus,
    getDailyAllocationTrendConcepts,
    getEvaluationSummaryByDomainImpetus,
    getEvaluationSummaryByDomainConcepts,
    getGeographicBreakdownImpetus,
    getGeographicBreakdownConcepts,
    getJudgeCountByDomainImpetus,
    getJudgeCountByDomainConcepts,
  };
}

export { analyticsQueries };