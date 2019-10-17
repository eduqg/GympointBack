/* Responsável por rotas que serão utlizadas em todo projeto */
import { Router } from 'express';

const routes = new Router();

routes.get('/', (req, res) => {
  console.log(req);
  return res.json({ hello: 'World' });
});

// Será utilizado na classe App, para configurar rotas disponíveis
export default routes;
