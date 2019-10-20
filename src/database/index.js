import Sequelize from 'sequelize';

// Usuário definido do meu Mvc
import User from '../app/models/User';
import Student from '../app/models/Student';
import Plan from '../app/models/Plan';

// Configurações de senha, porta, host do meu banco de dados
import databaseConfig from '../config/database';

// Minhas models devem ser estar nesse array para que controllers acessem
const models = [User, Student, Plan];

class Database {
  constructor() {
    this.init();
  }

  init() {
    // Conecta com o banco de dados
    this.connection = new Sequelize(databaseConfig);

    // Mapeia cada model para inicializar a conexão
    models.map(model => model.init(this.connection));
  }
}

export default new Database();
