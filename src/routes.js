/* Responsável por rotas que serão utlizadas em todo projeto */
import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// Cadastro de Usuário
routes.post('/users', UserController.store);
// Criação de sessão com retorno de token
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

// Cadastro de Alunos
routes.post('/students', StudentController.store);

routes.put('/students/:id', StudentController.update);

// Será utilizado na classe App, para configurar rotas disponíveis
export default routes;
