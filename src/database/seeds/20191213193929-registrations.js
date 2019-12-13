const addMonths = require('date-fns/addMonths');
const format = require('date-fns-tz/format');

module.exports = {
  up: async QueryInterface => {
    const students = await QueryInterface.sequelize.query(
      `SELECT id from STUDENTS;`
    );

    const plans = await QueryInterface.sequelize.query(
      `SELECT id, duration, price from PLANS;`
    );

    const start_date = new Date();
    const plan1 = plans[0][0];
    const price1 = plan1.duration * plan1.price;
    let endDate1 = addMonths(start_date, plan1.duration);
    endDate1 = format(endDate1, "yyyy-MM-dd'T'hh:mm:ss", {
      timeZone: 'America/Sao_Paulo',
    });

    const plan2 = plans[0][1];
    const price2 = plan2.duration * plan2.price;
    let endDate2 = addMonths(start_date, plan2.duration);
    endDate2 = format(endDate2, "yyyy-MM-dd'T'hh:mm:ss", {
      timeZone: 'America/Sao_Paulo',
    });

    const plan3 = plans[0][2];
    const price3 = plan3.duration * plan3.price;
    let endDate3 = addMonths(start_date, plan3.duration);
    endDate3 = format(endDate3, "yyyy-MM-dd'T'hh:mm:ss", {
      timeZone: 'America/Sao_Paulo',
    });

    console.log('Chegou');
    return QueryInterface.bulkInsert(
      'registrations',
      [
        {
          start_date,
          end_date: endDate1,
          price: price1,
          student_id: students[0][0].id,
          plan_id: plan1.id,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          start_date,
          end_date: endDate2,
          price: price2,
          student_id: students[0][1].id,
          plan_id: plan2.id,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          start_date,
          end_date: endDate3,
          price: price3,
          student_id: students[0][2].id,
          plan_id: plan3.id,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('registrations', null, {});
  },
};
