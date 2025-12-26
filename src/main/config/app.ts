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
  .catch((error) => {
    console.error('Error setting up routes:', error);
    routesInitialized = true; // Marcar como inicializado mesmo com erro para evitar loop infinito
  });

// Função para aguardar inicialização das rotas (usado em testes)
export const waitForRoutes = async (timeout: number = 5000): Promise<void> => {
  const startTime = Date.now();
  while (!routesInitialized) {
    if (Date.now() - startTime > timeout) {
      throw new Error('Timeout waiting for routes to initialize');
    }
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
};
