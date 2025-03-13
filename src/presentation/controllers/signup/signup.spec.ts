import { describe, test, expect } from '@jest/globals';
import { SignupController } from './signup'; // Importe o controlador de signup
import {
  MissingParamError,
  InvalidParamError,
  ServerError,
} from '../../errors';
import {
  EmailValidator,
  AddAccount,
  AddAccountModel,
  AccountModel,
} from '../signup/signup-protocols';

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  const emailValidatorStub = new EmailValidatorStub();

  return emailValidatorStub;
};

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const Fakeaccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
      };

      return new Promise((resolve) => resolve(Fakeaccount));
    }
  }

  return new AddAccountStub();
};

interface SutTypes {
  sut: SignupController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
}
const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();

  const sut = new SignupController(emailValidatorStub, addAccountStub);

  return { sut, emailValidatorStub, addAccountStub };
};

describe('SignUp Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut(); // SUT = System Under Test

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest); // Chame o método handle do sut
    expect(httpResponse.statusCode).toBe(400); // Verifique se o status code da resposta é 400
    expect(httpResponse.body).toEqual(new MissingParamError('name')); // Verifique se o body da resposta é um erro com a mensagem 'Missing param: name'
  });

  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut(); // SUT = System Under Test

    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest); // Chame o método handle do sut
    expect(httpResponse.statusCode).toBe(400); // Verifique se o status code da resposta é 400
    expect(httpResponse.body).toEqual(new MissingParamError('email')); // Verifique se o body da resposta é um erro com a mensagem 'Missing param: name'
  });

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut(); // SUT = System Under Test

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest); // Chame o método handle do sut
    expect(httpResponse.statusCode).toBe(400); // Verifique se o status code da resposta é 400
    expect(httpResponse.body).toEqual(new MissingParamError('password')); // Verifique se o body da resposta é um erro com a mensagem 'Missing param: name'
  });

  test('Should return 400 if password confirmation fails', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest); // Chame o método handle do sut
    expect(httpResponse.statusCode).toBe(400); // Verifique se o status code da resposta é 400
    expect(httpResponse.body).toEqual(
      new InvalidParamError('passwordConfirmation')
    ); // Verifique se o body da resposta é um erro com a mensagem 'Missing param: name'
  });

  test('Should return 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut(); // SUT = System Under Test

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest); // Chame o método handle do sut
    expect(httpResponse.statusCode).toBe(400); // Verifique se o status code da resposta é 400
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation')
    ); // Verifique se o body da resposta é um erro com a mensagem 'Missing param: name'
  });

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut(); // SUT = System Under Test

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false); // mocar manualmente para forçar o erro
    // OBS: sempre iniciar valor positivo, para não interferir nos demais testes

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest); // Chame o método handle do sut
    expect(httpResponse.statusCode).toBe(400); // Verifique se o status code da resposta é 400
    expect(httpResponse.body).toEqual(new InvalidParamError('email')); // Verifique se o body da resposta é um erro com a mensagem 'Missing param: name'
  });

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut(); // SUT = System Under Test

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    sut.handle(httpRequest); // Chame o método handle do sut
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com'); // Verifique se o status code da resposta é 400
  });

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest); // Chame o método handle do sut
    expect(httpResponse.statusCode).toBe(500); // Verifique se o status code da resposta é 400
    expect(httpResponse.body).toEqual(new ServerError()); // Verifique se o body da resposta é um erro com a mensagem 'Missing param: name'
  });

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut();

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    });

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest); // Chame o método handle do sut
    expect(httpResponse.statusCode).toBe(500); // Verifique se o status code da resposta é 400
    expect(httpResponse.body).toEqual(new ServerError()); // Verifique se o body da resposta é um erro com a mensagem 'Missing param: name'
  });

  test('Should call AddAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut();

    const addSpy = jest.spyOn(addAccountStub, 'add');

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    });
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    });
  });
});
