/* Classe responsável por configurar middlewares e rotas de requisição */
import './bootstrap';
import express from 'express';
import cors from 'cors';
import routes from './routes';
// Importa toda minha configuração do banco de dados
import './database';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(cors());
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
