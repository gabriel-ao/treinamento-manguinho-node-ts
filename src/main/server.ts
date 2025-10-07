import { app } from './config/app';
import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper';
import { env } from './config/env';

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = (await import('./config/app')).app;
    app.listen(env.port, () => {
      console.log('Server is running on port http://localhost:5050');
    });
  })
  .catch(console.error);

app.listen(env.port, () => {
  console.log('Server is running on port http://localhost:5050');
});
