import { format } from 'date-fns-tz';

import pt from 'date-fns/locale/pt-BR';
import Student from '../models/Student';
import HelpOrder from '../models/HelpOrder';

import Mail from '../../lib/Mail';

const includeStudent = {
  model: Student,
  as: 'student',
  attributes: ['name', 'email', 'peso', 'idade', 'altura'],
};

class HelpOrdersController {
  // POST https://gympoint.com/students/3/help-orders
  async store_question(req, res) {
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

    const student = await Student.findByPk(helpOrder.student_id);

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Pergunta respondida!',
      template: 'helporderanswer',
      context: {
        provider: student.name,
        question: helpOrder.question,
        answer: helpOrder.answer,
        answer_at: format(
          helpOrder.answer_at,
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          { locale: pt }
        ),
      },
    });

    return res.json(response.data);
  }

  async index(req, res) {
    let help = [];
    const { id } = req.params;
    const { page } = req.query;

    if (id) {
      help = await HelpOrder.findAll({
        where: { id },
        include: [includeStudent],
      });
    } else if (page) {
      help = await HelpOrder.findAll({
        limit: 2,
        offset: (page - 1) * 2,
        include: [includeStudent],
      });
    } else {
      help = await HelpOrder.findAll({
        include: [includeStudent],
      });
    }

    if (!help[0]) {
      return res.status(400).json({ error: "Help order doesn't exist." });
    }

    return res.json(help);
  }

  async index_not_answered(req, res) {
    const help = await HelpOrder.findAll({ where: { answer: null } });
    return res.json(help);
  }

  async questions_student(req, res) {
    const help = await HelpOrder.findAll({
      where: { student_id: req.params.id },
    });
    return res.json(help);
  }
}

export default new HelpOrdersController();
