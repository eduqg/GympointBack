/* Classe responsável por configurar middlewares e rotas de requisição */
const express = require('express');
const routes = require('./routes');

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    // Toda requisição vai usar json
    this.server.use(express.json());
  }

  routes() {
    // O servidor deve usar as rotas designadas em routes
    this.server.use(routes);
  }
}

// Exportação apenas do server, será usado em server.js
module.exports = new App().server;
