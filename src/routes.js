/* Responsável por rotas que serão utlizadas em todo projeto */
import { Router } from 'express';

import UserController from './app/controllers/UserController';

const routes = new Router();

// Cadastro de Usuário
routes.post('/users', UserController.store);

// Será utilizado na classe App, para configurar rotas disponíveis
export default routes;
