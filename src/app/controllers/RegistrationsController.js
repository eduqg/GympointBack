import * as Yup from 'yup';
import { parseISO, isBefore, addMonths, setHours, setMinutes } from 'date-fns';
import { format } from 'date-fns-tz';
import pt from 'date-fns/locale/pt-BR';
import Registration from '../models/Registration';
import Plan from '../models/Plan';
import Student from '../models/Student';
import Mail from '../../lib/Mail';

class RegistrationsController {
  async store(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      end_date: Yup.date(),
      price: Yup.number(),
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation schema fails.' });
    }

    const { start_date, student_id, plan_id } = req.body;

    const planRegistered = await Registration.findOne({
      where: { student_id },
    });

    // Verifica se plano foi criado para começar numa data passada
    if (
      isBefore(parseISO(start_date), setMinutes(setHours(new Date(), 0), 0))
    ) {
      return res.status(400).json({
        error: 'Cannot create one registration to start in the past.',
      });
    }

    // Verifica se usuário já possui algum registro
    if (planRegistered) {
      // Verifica se plano está ativo
      if (isBefore(new Date(), planRegistered.end_date)) {
        return res
          .status(400)
          .json({ error: 'Student already registrated in an active plan.' });
      }
      // eslint-disable-next-line no-console
      console.log(
        'Plano ja passou a data de termino, pode ser criado um novo plano.'
      );
    }

    const plan = await Plan.findByPk(plan_id);
    const price_calculated = plan.duration * plan.price;

    let end_date_calculated = addMonths(parseISO(start_date), plan.duration);
    end_date_calculated = format(end_date_calculated, "yyyy-MM-dd'T'hh:mm:ss", {
      timeZone: 'America/Sao_Paulo',
    });

    const registration = await Registration.create({
      start_date,
      end_date: end_date_calculated,
      price: price_calculated,
      student_id,
      plan_id,
    });

    const student = await Student.findByPk(student_id);

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Registro na Gympoint!',
      template: 'registration',
      context: {
        provider: student.name,
        plan_name: plan.title,
        end_date: format(
          registration.end_date,
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          { locale: pt }
        ),
        price: registration.price,
      },
    });

    return res.json(registration);
  }

  async index(req, res) {
    const { page } = req.query;
    let allRegistrations = [];

    if (page) {
      allRegistrations = await Registration.findAll({
        limit: 5,
        offset: (page - 1) * 5,
        order: [['updatedAt', 'DESC']],
        include: [
          {
            model: Plan,
            as: 'plan',
            attributes: ['id', 'title', 'duration', 'price'],
          },
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'name', 'email', 'peso', 'idade', 'altura'],
          },
        ],
      });
    } else {
      allRegistrations = await Registration.findAll({
        order: [['updatedAt', 'DESC']],
        include: [
          {
            model: Plan,
            as: 'plan',
            attributes: ['id', 'title', 'duration', 'price'],
          },
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'name', 'email', 'peso', 'idade', 'altura'],
          },
        ],
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
      include: [
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email', 'peso', 'idade', 'altura'],
        },
      ],
    });

    const registrations = allRegistrations.map(registration => {
      registration.active = !isBefore(registration.end_date, new Date());

      return registration;
    });

    return res.json(registrations);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      end_date: Yup.date(),
      price: Yup.number(),
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation schema fails.' });
    }

    const { start_date, student_id, plan_id } = req.body;

    const register = await Registration.findByPk(req.params.id);
    // Verifica se usuário já possui algum registro
    if (!register) {
      return res
        .status(400)
        .json({ error: 'Does not exist this registration' });
    }

    // if (req.body.student_id !== register.student_id) {
    //   return res.status(400).json({ error: 'Cannot update register of another user.' });
    // }

    if (
      isBefore(parseISO(start_date), setMinutes(setHours(new Date(), 0), 0))
    ) {
      return res.status(400).json({
        error: 'Cannot update one registration to start before today.',
      });
    }

    const plan = await Plan.findByPk(plan_id);
    const price_calculated = plan.duration * plan.price;

    let end_date_calculated = addMonths(parseISO(start_date), plan.duration);
    end_date_calculated = format(end_date_calculated, "yyyy-MM-dd'T'hh:mm:ss", {
      timeZone: 'America/Sao_Paulo',
    });

    const registration = await register.update({
      start_date,
      end_date: end_date_calculated,
      price: price_calculated,
      student_id,
      plan_id,
    });

    return res.json(registration);
  }

  async delete(req, res) {
    const { id } = req.params;
    const response = await Registration.destroy({ where: { id } });

    return res.json(response);
  }

  // async cancel(req, res) {
  //   const { id } = req.headers;
  //   const registration = await Registration.findByPk(id);
  //   if (!registration) {
  //     return res.status(400).json({ error: 'Registration does not exist.' });
  //   }
  //   registration.canceled_at = new Date();
  //   await registration.save();
  //   return res.json(registration);
  // }
}

export default new RegistrationsController();
