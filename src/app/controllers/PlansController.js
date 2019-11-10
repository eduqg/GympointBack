import * as Yup from 'yup';

import Plan from '../models/Plan';

class PlansController {
  async index(req, res) {
    let data = [];
    const { id } = req.params;
    const { page } = req.query;

    if (id) {
      data = await Plan.findAll({
        where: { id },
      });
      return res.json(data);
    }

    if (page) {
      data = await Plan.findAll({
        limit: 5,
        offset: (page - 1) * 5,
      });
      return res.json(data);
    }

    data = await Plan.findAll();

    if (!data[0]) {
      return res.status(400).json({ error: "Plano doesn't exist." });
    }

    return res.json(data);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    // Valido schema
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const planExists = await Plan.findOne({ where: { title: req.body.title } });

    if (planExists) {
      return res.status(400).json({ error: 'Plan already exists.' });
    }

    const { id, title, duration, price } = await Plan.create(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number(),
      price: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const plan = await Plan.findByPk(req.params.id);

    // Se title no update for igual = false
    if (plan.title !== req.body.title) {
      const checkPlanTitles = await Plan.findOne({
        where: { title: req.body.title },
      });
      if (checkPlanTitles) {
        return res
          .status(400)
          .json({ error: 'Plan name already has been taken.' });
      }
    }

    const { id, title, duration, price } = await plan.update(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async delete(req, res) {
    const { id } = req.headers;
    const response = await Plan.destroy({ where: { id } });

    return res.json(response);
  }
}

export default new PlansController();
