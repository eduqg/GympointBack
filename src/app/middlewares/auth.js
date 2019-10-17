// Responsável por bloquear usuário em alguma rota caso não esteja logado
import jwt from 'jsonwebtoken';
// promisify = tranforma função de callback em async await
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  // Lemrar que esse token é a de sessão (!hash_password)
  const [, token] = authHeader.split(' ');

  // Verifica se token é valido
  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // Passa para todas as rotas o id do usuário, se a requisição estiver com token válido
    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
