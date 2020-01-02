import { isBefore, subDays } from 'date-fns';

import Student from '../models/Student';
import Checkin from '../models/Checkin';

class CheckinsController {
  async store(req, res) {
    const checkStudent = await Student.findByPk(req.body.student_id);
    if (!checkStudent) {
      return res.status(400).json({ error: 'Student not found to checkin.' });
    }

    const checkins = await Checkin.findAll({
      where: { student_id: req.body.student_id },
    });

    const todayMinusSeven = subDays(new Date(), 7);
    let number_checkins = 0;

    // eslint-disable-next-line no-restricted-syntax
    for (const key in checkins) {
      if (isBefore(todayMinusSeven, checkins[key].createdAt)) {
        // eslint-disable-next-line no-plusplus
        number_checkins++;
      }
    }

    if (number_checkins >= 5) {
      return res
        .status(400)
        .json({ error: 'Student already made 5 checkins in the last 7 days.' });
    }

    const newCheckin = await Checkin.create(req.body);

    return res.json({
      newCheckin,
      checkin_count: number_checkins,
    });
  }

  async index(req, res) {
    const checkins = await Checkin.findAll();
    return res.json(checkins);
  }
}

export default new CheckinsController();
