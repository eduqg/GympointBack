/* Classe responsável por configurar middlewares e rotas de requisição */
import express from 'express';
import routes from './routes';

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
export default new App().server;
