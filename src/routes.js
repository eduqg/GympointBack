/* Responsável por rotas que serão utlizadas em todo projeto */
import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlansController from './app/controllers/PlansController';
import RegistrationsController from './app/controllers/RegistrationsController';
import CheckinsController from './app/controllers/CheckinsController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();


// Criação de sessão com retorno de token
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

// Usuário
routes.post('/users', UserController.store);
routes.put('/users', UserController.update);

// Alunos
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);
routes.get('/students', StudentController.index);
routes.get('/students/:id/checkins', StudentController.checkins);

// Planos
routes.get('/plans', PlansController.index);
routes.post('/plans', PlansController.store);
routes.put('/plans/:id', PlansController.update);
routes.delete('/plans', PlansController.delete);

// Matrículas
routes.post('/registrations', RegistrationsController.store);
routes.get('/registrations', RegistrationsController.index);
routes.put('/registrations/:id', RegistrationsController.update);
routes.delete('/registrations/:id', RegistrationsController.delete);

// Checkins
routes.post('/checkins', CheckinsController.store);
routes.get('/checkins', CheckinsController.index);

// Será utilizado na classe App, para configurar rotas disponíveis
export default routes;
