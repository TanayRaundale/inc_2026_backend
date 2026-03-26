import { Router } from 'express';
import analyticsController from '../../controllers/analytics/analytics.controller.mjs';
// import { analyticsController } from '../../controllers/analytics/analytics.controller.mjs';

const analyticsRouter = Router();

function createAnalyticsRouter(analyticsServices, middlewares) {
  const { getDashboard } = analyticsController(analyticsServices);

  analyticsRouter.get('/:event_name/dashboard', getDashboard);

  return analyticsRouter;
}

export default createAnalyticsRouter;