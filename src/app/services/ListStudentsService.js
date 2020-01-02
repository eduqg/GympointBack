import Sequelize from 'sequelize';

import Student from '../models/Student';

class ListStudentsService {
  async run({ page, student_id, name }) {
    let students = [];

    if (student_id) {
      const data = await Student.findByPk(student_id);
      return data;
    }

    if (page) {
      students = await Student.findAll({
        where: {},
        limit: 5,
        offset: (page - 1) * 5,
        order: [['updatedAt', 'DESC']],
      });
    } else if (name) {
      students = await Student.findAll({
        where: { name: { [Sequelize.Op.iLike]: name } },
      });
    } else {
      students = await Student.findAll({
        order: [['updatedAt', 'DESC']],
      });
    }

    return students;
  }
}

export default new ListStudentsService();
