// A sessão é responsável por logar o usuário
// e criar token a ser usado pelo frontend
import jwt from 'jsonwebtoken';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    // Verifica se usuário existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Não autorizado
      return res.status(401).json({ error: 'User not found' });
    }

    // Verifica senha
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, admin } = user;

    // Retorna token para o front
    // jwt.sign(payload, string eg md5, configurações)
    return res.json({
      user: {
        id,
        name,
        email,
        admin,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
