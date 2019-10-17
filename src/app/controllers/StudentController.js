import * as Yup from 'yup';

import User from '../models/Student';

class StudentController {
  async store(req, res) {

    // Verifica duplicação de email
    const studentExists = await User.findOne({
      where: { email: req.body.email },
    });
    if (studentExists) {
      return res.status(400).json({ error: 'Student already exists.' });
    }

    const { id, name, email, peso, idade, altura } = await User.create(req.body);


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
