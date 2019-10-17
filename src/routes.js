/* Responsável por rotas que serão utlizadas em todo projeto */
import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// Cadastro de Usuário
routes.post('/users', UserController.store);
// Criação de sessão com retorno de token
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

// Será utilizado na classe App, para configurar rotas disponíveis
export default routes;
