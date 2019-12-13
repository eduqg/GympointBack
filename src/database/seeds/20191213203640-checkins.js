module.exports = {
  up: async QueryInterface => {
    const students = await QueryInterface.sequelize.query(
      `SELECT id from STUDENTS;`
    );

    return QueryInterface.bulkInsert(
      'checkins',
      [
        {
          student_id: students[0][0].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          student_id: students[0][0].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          student_id: students[0][0].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          student_id: students[0][1].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          student_id: students[0][1].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          student_id: students[0][1].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          student_id: students[0][3].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          student_id: students[0][3].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          student_id: students[0][3].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('checkins', null, {});
  },
};
