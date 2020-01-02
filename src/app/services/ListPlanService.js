import Plan from '../models/Plan';

class ListPlanService {
  async run({ plan_id, page }) {
    let data = [];

    if (plan_id) {
      data = await Plan.findByPk(plan_id);
    } else if (page) {
      data = await Plan.findAll({
        limit: 5,
        offset: (page - 1) * 5,
        order: [['updatedAt', 'DESC']],
      });
    } else {
      data = await Plan.findAll({ order: [['updatedAt', 'DESC']] });
    }

    if (!data) {
      throw new Error("Plan(s) don't exist.");
    }

    return data;
  }
}

export default new ListPlanService();
