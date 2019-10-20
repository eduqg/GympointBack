import Sequelize from 'sequelize';

// Usuário definido do meu Mvc
import User from '../app/models/User';
import Student from '../app/models/Student';
import Plan from '../app/models/Plan';
import Registration from '../app/models/Registration'

// Configurações de senha, porta, host do meu banco de dados
import databaseConfig from '../config/database';

// Minhas models devem ser estar nesse array para que controllers acessem
const models = [User, Student, Plan, Registration];

class Database {
  constructor() {
    this.init();
  }

  init() {
    // Conecta com o banco de dados
    this.connection = new Sequelize(databaseConfig);

    // Mapeia cada model para inicializar a conexão
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
