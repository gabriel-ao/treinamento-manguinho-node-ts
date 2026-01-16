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
    let id = _id;

    // Se _id é um número, mantém como número
    if (typeof _id === 'number') {
      id = _id;
    }
    // Se _id tem método toString (como ObjectId do MongoDB), converte para string
    else if (_id?.toString && typeof _id.toString === 'function') {
      id = _id.toString();
    }
    // Caso contrário, usa o valor original

    return Object.assign({}, collectionWithoutId, {
      id,
    });
  },
};
