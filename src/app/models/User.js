// Esta model será conectada com o sequelize em database/index.js
import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        admin: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    // Antes de executar store, é executado o seguinte hook
    this.addHook('beforeSave', async user => {
      // Confere se senha foi digitada
      if (user.password) {
        // Força de criptografia de 0 a 100
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    return this;
  }

  checkPassword(password) {
    // Verifica se senha passada (que é transformada em hash) confere com a hash do banco de dados
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
