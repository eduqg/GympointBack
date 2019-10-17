import * as Yup from 'yup';

import User from '../models/Student';

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
    const studentExists = await User.findOne({
      where: { email: req.body.email },
    });
    if (studentExists) {
      return res.status(400).json({ error: 'Student already exists.' });
    }

    const { id, name, email, peso, idade, altura } = await User.create(
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
}

export default new StudentController();
