/* Responsável por rotas que serão utlizadas em todo projeto */
import { Router } from 'express';
import User from './app/models/User';

const routes = new Router();

// Requisiçaõ de teste para criar primeiro usuário
routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Dudu',
    email: 'dudu@edu.com',
    password_hash: '821812',
    admin: true,
  });

  return res.json(user);
});

// Será utilizado na classe App, para configurar rotas disponíveis
export default routes;
