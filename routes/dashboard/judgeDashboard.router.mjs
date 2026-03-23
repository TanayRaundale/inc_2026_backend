import { Router } from 'express';
import createJudgeDashboardController from '../../controllers/dashboard/judgeDashboard.controller.mjs';

function createJudgeDashboardApiRouter(judgeDashboardServices) {
  const router = Router();
  const controller = createJudgeDashboardController(judgeDashboardServices);

  router.post('/judge/login', controller.login);
  router.post('/judge/logout', controller.logout);
  router.get('/auth/me', controller.getCurrentJudge);
  router.get('/judge/dashboard/events', controller.getDashboardEvents);

  router.get('/judge/:event_name/preferences/projects', controller.getPreferenceProjects);
  router.get('/judge/:event_name/preferences/status', controller.getPreferenceStatus);
  router.post('/judge/:event_name/preferences/submit', controller.submitPreferences);

  router.get('/judge/:jid', controller.getJudgeById);
  router.get('/health', controller.health);

  return router;
}

export default createJudgeDashboardApiRouter;
