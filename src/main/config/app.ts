import express from 'express';
import setupMiddlewares from './middlewares';
import setupRoutes from './routes';

export const app = express();
setupMiddlewares(app);

// Inicializar rotas de forma assíncrona
let routesInitialized = false;
setupRoutes(app)
  .then(() => {
    routesInitialized = true;
  })
  .catch(console.error);

// Função para aguardar inicialização das rotas (usado em testes)
export const waitForRoutes = async (): Promise<void> => {
  while (!routesInitialized) {
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
};
