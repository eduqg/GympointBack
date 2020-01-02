/* Responsável por rotas que serão utlizadas em todo projeto */
import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlansController from './app/controllers/PlansController';
import RegistrationsController from './app/controllers/RegistrationsController';
import CheckinsController from './app/controllers/CheckinsController';
import HelpOrdersController from './app/controllers/HelpOrdersController';

import validateUserStore from './app/validators/UserStore';
import validateUserUpdate from './app/validators/UserUpdate';
import validateSessionStore from './app/validators/SessionStore';
import validateStudentStore from './app/validators/StudentStore';
import validateRegistrationStore from './app/validators/RegistrationStore';
import validateRegistrationUpdate from './app/validators/RegistrationUpdate';
import validatePlanStore from './app/validators/PlanStore';
import validatePlanUpdate from './app/validators/PlanUpdate';
import validateHelpOrderStoreQuestion from './app/validators/HelpOrderStoreQuestion';
import validateHelpOrderStoreAnswer from './app/validators/HelpOrderStoreAnswer';
import validateCheckinStore from './app/validators/CheckinStore';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', validateUserStore, UserController.store);

// Criação de sessão com retorno de token
routes.post('/sessions', validateSessionStore, SessionController.store);

// Pega usuário pelo nome
routes.post('/students/sign', StudentController.studentSign);

// Pedidos de auxílio do aluno - Native
routes.get('/students/:id/help-orders', HelpOrdersController.questions_student);

// Novo Pedido de auxílio - Native
routes.post(
  '/students/:id/help-orders',
  validateHelpOrderStoreQuestion,
  HelpOrdersController.store_question
);

// Visualizar resposta - Native
routes.get('/help-orders(/:id)?', HelpOrdersController.index);

routes.get('/students/:id/checkins', StudentController.checkins);
routes.post('/checkins', validateCheckinStore, CheckinsController.store);

// Rotas a partir daqui precisar de token de autenticação
routes.use(authMiddleware);

// Usuário
routes.put('/users', validateUserUpdate, UserController.update);

// Alunos
routes.get('/students(/:id)?', StudentController.index);
routes.post('/students', validateStudentStore, StudentController.store);
routes.put('/students/:id', StudentController.update);
routes.delete('/students', StudentController.delete);

// Planos
routes.get('/plans(/:id)?', PlansController.index);
routes.post('/plans', validatePlanStore, PlansController.store);
routes.put('/plans/:id', validatePlanUpdate, PlansController.update);
routes.delete('/plans', PlansController.delete);

// Matrículas
routes.post(
  '/registrations',
  validateRegistrationStore,
  RegistrationsController.store
);
routes.get('/registrations', RegistrationsController.index);
routes.get('/registrations/:id', RegistrationsController.getone);
routes.put(
  '/registrations/:id',
  validateRegistrationUpdate,
  RegistrationsController.update
);
routes.delete('/registrations/:id', RegistrationsController.delete);

// Checkins
routes.get('/checkins', CheckinsController.index);

// Help Orders
routes.post(
  '/help-orders/:id/answer',
  validateHelpOrderStoreAnswer,
  HelpOrdersController.store_answer
);
routes.get(
  '/help-orders-not-answered',
  HelpOrdersController.index_not_answered
);
// reoutes.get('/students/:id/help-orders', HelpOrdersController.index);

// Será utilizado na classe App, para configurar rotas disponíveis
export default routes;
