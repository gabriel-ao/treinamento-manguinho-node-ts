import { MongoHelper as sut } from './mongo-helper';

describe('MongoHelper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await sut.disconnect();
  });

  test('should reconnect if mongodb is down', async () => {
    let accountCollection = await sut.getCollection('accounts');
    expect(accountCollection).toBeTruthy();

    await sut.disconnect();

    accountCollection = await sut.getCollection('accounts');
    expect(accountCollection).toBeTruthy();
  });

  describe('map', () => {
    test('should map collection with _id that has toString method', () => {
      const mockId = {
        toString: () => '507f1f77bcf86cd799439011',
      };
      const collection = {
        _id: mockId,
        name: 'Test Name',
        email: 'test@mail.com',
      };

      const result = sut.map(collection);

      expect(result).toEqual({
        id: '507f1f77bcf86cd799439011',
        name: 'Test Name',
        email: 'test@mail.com',
      });
      expect(result.id).toBe('507f1f77bcf86cd799439011');
      expect(result._id).toBeUndefined();
    });

    test('should map collection with _id that does not have toString method', () => {
      const collection = {
        _id: 'simple-string-id',
        name: 'Test Name',
        email: 'test@mail.com',
      };

      const result = sut.map(collection);

      expect(result).toEqual({
        id: 'simple-string-id',
        name: 'Test Name',
        email: 'test@mail.com',
      });
      expect(result.id).toBe('simple-string-id');
      expect(result._id).toBeUndefined();
    });

    test('should map collection with numeric _id', () => {
      const collection = {
        _id: 123,
        name: 'Test Name',
      };

      const result = sut.map(collection);

      expect(result).toEqual({
        id: 123,
        name: 'Test Name',
      });
      expect(result.id).toBe(123);
      expect(result._id).toBeUndefined();
    });

    test('should map collection with all properties except _id', () => {
      const mockId = {
        toString: () => '507f1f77bcf86cd799439011',
      };
      const collection = {
        _id: mockId,
        name: 'Test Name',
        email: 'test@mail.com',
        password: 'hashed_password',
        createdAt: new Date(),
      };

      const result = sut.map(collection);

      expect(result.id).toBe('507f1f77bcf86cd799439011');
      expect(result.name).toBe('Test Name');
      expect(result.email).toBe('test@mail.com');
      expect(result.password).toBe('hashed_password');
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result._id).toBeUndefined();
    });
  });
});
