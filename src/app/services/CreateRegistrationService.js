import { parseISO, isBefore, addMonths, setHours, setMinutes } from 'date-fns';
import { format } from 'date-fns-tz';
import pt from 'date-fns/locale/pt-BR';

import Registration from '../models/Registration';
import Plan from '../models/Plan';
import Student from '../models/Student';
import Mail from '../../lib/Mail';

class CreateRegistrationService {
  async run({ start_date, student_id, plan_id }) {
    const planRegistered = await Registration.findOne({
      where: { student_id },
    });

    // Verifica se plano foi criado para começar numa data passada
    if (
      isBefore(parseISO(start_date), setMinutes(setHours(new Date(), 0), 0))
    ) {
      throw new Error('Cannot create one registration to start in the past.');
    }

    // Verifica se usuário já possui algum registro
    if (planRegistered) {
      // Verifica se plano está ativo
      if (isBefore(new Date(), planRegistered.end_date)) {
        throw new Error('Student already registrated in an active plan.');
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

    return registration;
  }
}

export default new CreateRegistrationService();
