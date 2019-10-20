import * as Yup from 'yup';

import Student from '../models/Student';

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
    const students = await Student.findAll();
    return res.json(students);
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
}

export default new StudentController();
