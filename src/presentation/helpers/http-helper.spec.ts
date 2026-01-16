import { describe, test, expect } from '@jest/globals';
import { badRequest, serverError, ok } from './http-helper';
import { ServerError } from '../errors';
import { MissingParamError } from '../errors';

describe('HttpHelper', () => {
  describe('badRequest', () => {
    test('should return a response with status 400 and the error', () => {
      const error = new MissingParamError('email');
      const response = badRequest(error);

      expect(response).toEqual({
        statusCode: 400,
        body: error,
      });
    });
  });

  describe('serverError', () => {
    test('should return a response with status 500 and ServerError with stack', () => {
      const error = new Error('Test error');
      error.stack = 'Error: Test error\n    at test.ts:1:1';
      const response = serverError(error);

      expect(response.statusCode).toBe(500);
      expect(response.body).toBeInstanceOf(ServerError);
      expect(response.body.stack).toBe('Error: Test error\n    at test.ts:1:1');
    });

    test('should return a response with status 500 and ServerError without stack', () => {
      const error = new Error('Test error');
      error.stack = undefined;
      const response = serverError(error);

      expect(response.statusCode).toBe(500);
      expect(response.body).toBeInstanceOf(ServerError);
      expect(response.body.stack).toBe('');
    });

    test('should return a response with status 500 and ServerError when stack is null', () => {
      const error = new Error('Test error');
      error.stack = null as unknown as string;
      const response = serverError(error);

      expect(response.statusCode).toBe(500);
      expect(response.body).toBeInstanceOf(ServerError);
      expect(response.body.stack).toBe('');
    });
  });

  describe('ok', () => {
    test('should return a response with status 200 and the data', () => {
      const data = { id: '123', name: 'Test' };
      const response = ok(data);

      expect(response).toEqual({
        statusCode: 200,
        body: data,
      });
    });

    test('should return a response with status 200 and null data', () => {
      const response = ok(null);

      expect(response).toEqual({
        statusCode: 200,
        body: null,
      });
    });

    test('should return a response with status 200 and undefined data', () => {
      const response = ok(undefined);

      expect(response).toEqual({
        statusCode: 200,
        body: undefined,
      });
    });
  });
});

