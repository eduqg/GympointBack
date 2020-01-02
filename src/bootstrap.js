// Para carregar variáveis ambiente da minha aplicação
import dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });
