module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'students',
      [
        {
          name: 'João Queiroz Ramos',
          email: 'joaoqueiroz@gympoint.com',
          idade: 20,
          peso: 60.2,
          altura: 2.0,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Marcela Joana da Silva',
          email: 'marcelajoana@gympoint.com',
          idade: 32,
          peso: 80.2,
          altura: 1.64,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Otávio Rubens Alves',
          email: 'otaviorubens@gympoint.com',
          idade: 40,
          peso: 72.2,
          altura: 1.75,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Jorge Ribeiro Gomes',
          email: 'jorgeribeiro@gympoint.com',
          idade: 27,
          peso: 78.2,
          altura: 1.84,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Gabriela Almeida de Souza',
          email: 'gabriela22@gympoint.com',
          idade: 22,
          peso: 55,
          altura: 1.62,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Natália Santos Oliveira',
          email: 'nataliasantos@gympoint.com',
          idade: 25,
          peso: 61,
          altura: 1.65,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('students', null, {});
  },
};
