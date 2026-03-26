import { analyticsQueries } from '../../../models/index.js';
import { AppError } from '../../../utils/index.js';

function analyticsServices(db) {
  async function getDashboard(event_name) {
    try {
      const safeEvent = event_name === 'impetus' || event_name === 'concepts' ? event_name : null;
      if (!safeEvent) throw new AppError(400, 'fail', 'Invalid event name');

      const [kpis] = await db.execute(analyticsQueries.getDashboardKpis(safeEvent)).catch((err) => {
        throw new AppError(400, 'fail', err.sqlMessage);
      });

      const [dailyTrend] = await db.execute(analyticsQueries.getDailyAllocationTrend(safeEvent)).catch((err) => {
        throw new AppError(400, 'fail', err.sqlMessage);
      });

      const [evaluationSummary] = await db
        .execute(analyticsQueries.getEvaluationSummaryByDomain(safeEvent))
        .catch((err) => {
          throw new AppError(400, 'fail', err.sqlMessage);
        });

      const [geographicRows] = await db.execute(analyticsQueries.getGeographicBreakdown(safeEvent)).catch((err) => {
        throw new AppError(400, 'fail', err.sqlMessage);
      });

      const [judgesByDomain] = await db.execute(analyticsQueries.getJudgeCountByDomain(safeEvent)).catch((err) => {
        throw new AppError(400, 'fail', err.sqlMessage);
      });

      return {
        event_name: safeEvent,
        kpis: kpis?.[0] || {},
        dailyTrend,
        evaluationSummary,
        geographic: geographicRows?.[0] || {},
        judgesByDomain,
      };
    } catch (err) {
      throw err;
    }
  }

  return {
    getDashboard,
  };
}

export default analyticsServices;