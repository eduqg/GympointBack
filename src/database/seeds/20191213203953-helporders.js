const addMonths = require('date-fns/addMonths');

module.exports = {
  up: async QueryInterface => {
    const students = await QueryInterface.sequelize.query(
      `SELECT id from STUDENTS;`
    );

    return QueryInterface.bulkInsert(
      'help_orders',
      [
        {
          student_id: students[0][0].id,
          question: 'Olá como faço para ficar grandão?',
          answer: 'Cara, tem que comer muito peito de frango',
          answer_at: addMonths(new Date(), 3),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          student_id: students[0][1].id,
          question: 'Olá como faço para emagrecer?',
          answer: null,
          answer_at: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          student_id: students[0][2].id,
          question: 'Em quanto tempo eu consigo alcançar um corpo dos sonhos?',
          answer: 'Depende da sua determinação, tudo é possível.',
          answer_at: addMonths(new Date(), 4),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('help_orders', null, {});
  },
};
