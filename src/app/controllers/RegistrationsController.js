import * as Yup from 'yup';
import { startOfDate, parseISO, isBefore, format, subHours, addMonths, parseFromTimeZone } from 'date-fns';
import { format } from 'date-fns-tz';
import pt from 'date-fns/locale/pt-BR';
import Registration from '../models/Registration';
import Plan from '../models/Plan';
import Student from '../models/Student';

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
      where: { student_id: student_id }
    });

    // Verifica se plano foi criado para começar numa data passada
    if (isBefore(parseISO(start_date), new Date())) {
      return res.status(400).json({ error: 'Cannot create one registration to start in the past.' });
    }

    // Verifica se usuário já possui algum registro
    if (planRegistered) {
      // Verifica se plano está ativo
      if (isBefore(new Date(), planRegistered.end_date)) {
        return res.status(400).json({ error: 'Student already registrated in an active plan.' });
      } else {
        console.log('Plano ja passou a data de termino, pode ser criado um novo plano.');
      }
    };


    const plan = await Plan.findByPk(plan_id);
    const price_calculated = plan.duration * plan.price;

    let end_date_calculated = addMonths(parseISO(start_date), plan.duration);
    console.log(end_date_calculated);
    end_date_calculated = format(end_date_calculated, "yyyy-MM-dd'T'hh:mm:ss", {
      timeZone: 'America/Sao_Paulo'
    });
    console.log({
      start_date,
      end_date: end_date_calculated,
      price: price_calculated,
      student_id,
      plan_id,
    })
    const registration = await Registration.create({
      start_date,
      end_date: end_date_calculated,
      price: price_calculated,
      student_id,
      plan_id,
    });

    return res.json(registration);
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
