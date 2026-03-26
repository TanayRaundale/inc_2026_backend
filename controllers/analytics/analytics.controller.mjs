function analyticsController(analyticsServices) {
  async function getDashboard(req, res, next) {
    try {
      const { event_name } = req.params;
      const result = await analyticsServices.getDashboard(event_name);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  return {
    getDashboard,
  };
}

export default analyticsController;