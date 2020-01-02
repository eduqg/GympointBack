import { isBefore } from 'date-fns';

import Registration from '../models/Registration';
import Plan from '../models/Plan';
import Student from '../models/Student';

import CreateRegistrationService from '../services/CreateRegistrationService';
import UpdateRegistrationService from '../services/UpdateRegistrationService';

const includePlan = {
  model: Plan,
  as: 'plan',
  attributes: ['id', 'title', 'duration', 'price'],
};

const includeStudent = {
  model: Student,
  as: 'student',
  attributes: ['id', 'name', 'email', 'peso', 'idade', 'altura'],
};

class RegistrationsController {
  async store(req, res) {
    try {
      const { start_date, student_id, plan_id } = req.body;

      const registration = await CreateRegistrationService.run({
        start_date,
        student_id,
        plan_id,
      });

      return res.json(registration);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { start_date, student_id, plan_id } = req.body;

      const registration = await UpdateRegistrationService.run({
        start_date,
        student_id,
        plan_id,
        registration_id: req.params.id,
      });

      return res.json(registration);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async index(req, res) {
    const { page } = req.query;
    let allRegistrations = [];

    if (page) {
      allRegistrations = await Registration.findAll({
        limit: 5,
        offset: (page - 1) * 5,
        order: [['updatedAt', 'DESC']],
        include: [includePlan, includeStudent],
      });
    } else {
      allRegistrations = await Registration.findAll({
        order: [['updatedAt', 'DESC']],
        include: [includePlan, includeStudent],
      });
    }

    const registrations = allRegistrations.map(registration => {
      registration.active = !isBefore(registration.end_date, new Date());

      return registration;
    });

    return res.json(registrations);
  }

  async getone(req, res) {
    const allRegistrations = await Registration.findAll({
      where: { id: req.params.id },
      include: [includePlan, includeStudent],
    });

    const registrations = allRegistrations.map(registration => {
      registration.active = !isBefore(registration.end_date, new Date());

      return registration;
    });

    return res.json(registrations);
  }

  async delete(req, res) {
    const { id } = req.params;
    const response = await Registration.destroy({ where: { id } });

    return res.json(response);
  }
}

export default new RegistrationsController();
