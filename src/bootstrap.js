// Para carregar variáveis ambiente da minha aplicação
require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});
