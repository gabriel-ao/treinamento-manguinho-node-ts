import { LoginController } from './login';
import { badRequest } from '../../helpers/http-helper';
import { MissingParamError } from '../../errors';

describe('LoginController', () => {
  test('should return 400 if no email is provided', async () => {
    const loginController = new LoginController();
    const httpRequest = {
      body: {
        password: 'any_password',
      },
    };
    const httpResponse = await loginController.handle(httpRequest);
    expect(httpResponse.statusCode).toEqual(
      badRequest(new MissingParamError('email')).statusCode
    );
  });

  test('should return 400 if no password is provided', async () => {
    const loginController = new LoginController();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
      },
    };
    const httpResponse = await loginController.handle(httpRequest);
    expect(httpResponse.statusCode).toEqual(
      badRequest(new MissingParamError('password')).statusCode
    );
  });
});
