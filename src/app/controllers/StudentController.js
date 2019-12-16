import Sequelize from 'sequelize';
import * as Yup from 'yup';
import { isBefore, subDays } from 'date-fns';

import Student from '../models/Student';
import Checkin from '../models/Checkin';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      idade: Yup.number()
        .integer()
        .positive()
        .required(),
      peso: Yup.number()
        .positive()
        .required(),
      altura: Yup.number()
        .positive()
        .required(),
    });

    // Valido schema
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation of student fails.' });
    }

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
    let students = [];

    if (id) {
      const data = await Student.findByPk(id);
      return res.json(data);
    }

    if (page) {
      students = await Student.findAll({
        where: {},
        limit: 5,
        offset: (page - 1) * 5,
        order: [['updatedAt', 'DESC']],
      });
    } else if (name) {
      students = await Student.findAll({
        where: { name: { [Sequelize.Op.iLike]: name } },
      });
    } else {
      students = await Student.findAll({
        order: [['updatedAt', 'DESC']],
      });
    }

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
