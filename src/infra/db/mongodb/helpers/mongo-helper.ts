import { Collection, MongoClient } from 'mongodb';
import { AccountModel } from '../../../../domain/models/account';
import { env } from '../../../../main/config/env';

export const MongoHelper = {
  client: null as unknown as MongoClient,

  async connect(uri: string): Promise<void> {
    if (!env.mongoUrl) {
      throw new Error('MONGO_URL environment variable is not defined');
    }
    this.client = await MongoClient.connect(env.mongoUrl);
  },

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null as unknown as MongoClient;
    }
  },

  getCollection(name: string): Collection {
    return this.client.db().collection(name);
  },

  map: (collection: any): any => {
    const { _id, ...collectionWithoutId } = collection;
    return Object.assign({}, collectionWithoutId, { id: _id });
  },
};
