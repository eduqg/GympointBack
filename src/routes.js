/* Responsável por rotas que serão utlizadas em todo projeto */
const { Router } = require('express');

const routes = new Router();

routes.get('/', (req, res) => {
  return res.json({ hello: 'World' });
});

// Será utilizado na classe App, para configurar rotas disponíveis
module.exports = routes;
