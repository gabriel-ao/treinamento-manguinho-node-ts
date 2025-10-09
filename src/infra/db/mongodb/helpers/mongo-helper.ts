import { Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
  client: null as unknown as MongoClient,
  uri: null as unknown as string,

  async connect(uri: string): Promise<void> {
    console.log('Connecting to MongoDB...' + uri);
    this.uri = uri;
    this.client = await MongoClient.connect(uri);
    console.log('Connected to MongoDB');
  },

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null as unknown as MongoClient;
    }
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.client) {
      await this.connect(this.uri);
    }
    return this.client.db().collection(name);
  },

  map: (collection: any): any => {
    const { _id, ...collectionWithoutId } = collection;
    return Object.assign({}, collectionWithoutId, {
      id: _id?.toString ? _id.toString() : _id,
    });
  },
};
