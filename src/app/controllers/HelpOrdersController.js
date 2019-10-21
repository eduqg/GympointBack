import * as Yup from 'yup';

import Student from '../models/Student';
import HelpOrder from '../models/HelpOrder';

class HelpOrdersController {

  // POST https://gympoint.com/students/3/help-orders
  async store_question(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { question } = req.body;
    const { id } = req.params;

    const checkStudent = await Student.findByPk(id);
    if (!checkStudent) {
      return res.status(400).json({ error: 'Student not found to checkin.' });
    }

    const helporder = await HelpOrder.create({
      question,
      student_id: id,
    });

    return res.json(helporder);
  }

  // POST https://gympoint.com/help-orders/1/answer
  async store_answer(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { answer } = req.body;
    const { id } = req.params;

    const helpOrder = await HelpOrder.findByPk(id);
    if (!helpOrder) {
      return res.status(400).json({ error: 'Help Order not found.' });
    }

    const response = await helpOrder.update({
      answer,
      answer_at: new Date(),
    });

    await helpOrder.save();

    return res.json(response);
  }

  async index(req, res) {
    const help = await HelpOrder.findAll();
    return res.json(help);
  }

  async index_not_answered(req, res) {
    const help = await HelpOrder.findAll({ where: { answer: null } });
    return res.json(help);
  }

  async questions_student(req, res) {
    const help = await HelpOrder.findAll({ where: { student_id: req.params.id } });
    return res.json(help);
  }

}

export default new HelpOrdersController();
