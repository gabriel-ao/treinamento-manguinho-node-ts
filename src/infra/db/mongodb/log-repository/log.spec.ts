import { MongoHelper } from '../helpers/mongo-helper';
import { Collection } from 'mongodb';
import { LogMongoRepository } from './log';

describe('Log Mongo Repository', () => {
  let errorCollection: Collection;
  beforeAll(async () => {
    if (!process.env.MONGO_URL) {
      throw new Error('MONGO_URL environment variable is not defined');
    }
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors');
    await errorCollection.deleteMany({});
  });

  test('Should create an error log on success', async () => {
    const sut = new LogMongoRepository();
    await sut.logError('any_error');
    const count = await errorCollection.countDocuments();
    expect(count).toBe(1);
  });
});
