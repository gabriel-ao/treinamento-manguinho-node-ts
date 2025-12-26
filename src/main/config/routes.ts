import { Express, Router } from 'express';
import fg from 'fast-glob';

export default async (app: Express): Promise<void> => {
  const router = Router();
  app.use('/api', router);

  // Importar rotas diretamente (temporário para debug)
  const signupRoute = (await import('../routes/signup-routes')).default;
  if (signupRoute) {
    signupRoute(router);
  }

  // Tentar carregar outras rotas dinamicamente
  const files = fg
    .sync('**/src/main/routes/**routes.ts')
    .filter((file) => !file.includes('signup-routes'));

  await Promise.all(
    files.map(async (file) => {
      try {
        const routePath = file.replace(/^.*src\/main\//, '');
        const relativePath = `../${routePath}`;
        const route = (await import(relativePath)).default;
        if (route) {
          route(router);
        }
      } catch (error) {
        // Ignorar erros silenciosamente
      }
    })
  );
};
