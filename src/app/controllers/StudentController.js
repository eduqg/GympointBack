import { isBefore, subDays } from 'date-fns';

import Student from '../models/Student';
import Checkin from '../models/Checkin';

import ListStudentsService from '../services/ListStudentsService';

class StudentController {
  async store(req, res) {
    // Verifica duplicação de email
    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });
    if (studentExists) {
      return res.status(400).json({ error: 'Student already exists.' });
    }

    const { id, name, email, peso, idade, altura } = await Student.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      idade,
      peso,
      altura,
    });
  }

  async index(req, res) {
    const { page } = req.query;
    const { id } = req.params;
    const name = req.query.q;

    const students = await ListStudentsService.run({
      page,
      student_id: id,
      name,
    });

    return res.json(students);
  }

  async studentSign(req, res) {
    const { name } = req.body;

    if (name) {
      const studentExists = await Student.findOne({ where: { name } });

      if (studentExists) {
        return res.json(studentExists);
      }
    }

    return res.status(400).json({ error: 'Student not found.' });
  }

  async update(req, res) {
    const { id } = req.params;
    const { email } = req.body;

    // Verifica se existe estudante com esse id
    const student = await Student.findByPk(id);

    // Se quer trocar email, checar se alguém já o usa
    if (email !== student.email) {
      const userExists = await Student.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User email already exists.' });
      }
    }

    const { name, idade, peso, altura } = await student.update(req.body);

    return res.json({
      id,
      name,
      email,
      idade,
      peso,
      altura,
    });
  }

  async checkins(req, res) {
    const { id } = req.params;

    const student = await Student.findByPk(id);

    const allCheckins = await Checkin.findAll({
      where: { student_id: student.id },
    });

    const todayMinusSeven = subDays(new Date(), 7);
    let numberCheckins = 0;

    // eslint-disable-next-line no-restricted-syntax
    for (const key in allCheckins) {
      if (isBefore(todayMinusSeven, allCheckins[key].createdAt)) {
        // eslint-disable-next-line no-plusplus
        numberCheckins++;
      }
    }

    return res.json({ allCheckins, numberCheckins });
  }

  async delete(req, res) {
    const { id } = req.headers;
    const response = await Student.destroy({ where: { id } });

    return res.json(response);
  }
}

export default new StudentController();
