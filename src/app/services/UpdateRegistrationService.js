import { parseISO, isBefore, addMonths, setHours, setMinutes } from 'date-fns';
import { format } from 'date-fns-tz';

import Registration from '../models/Registration';
import Plan from '../models/Plan';

class UpdateRegistrationService {
  async run({ start_date, student_id, plan_id, registration_id }) {
    const register = await Registration.findByPk(registration_id);

    // Verifica se usuário já possui algum registro
    if (!register) {
      throw new Error('Does not exist this registration');
    }

    if (
      isBefore(parseISO(start_date), setMinutes(setHours(new Date(), 0), 0))
    ) {
      throw new Error('Cannot update one registration to start before today.');
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

    return registration;
  }
}

export default new UpdateRegistrationService();
