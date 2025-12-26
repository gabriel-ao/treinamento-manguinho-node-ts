import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '../../presentation/protocols';
import { LogControllerDecorator } from './log';
import { LogErrorRepository } from '../../data/protocols/log-error-repository';
import { ok, serverError } from '../../presentation/helpers/http-helper';
import { AccountModel } from '../../domain/models/account';

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise((resolve) => resolve(ok(makeFakeAccount())));
    }
  }
  return new ControllerStub();
};

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new LogErrorRepositoryStub();
};

const makeFakeAccount = (): AccountModel => {
  return {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password',
  };
};

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password',
    },
  };
};

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = 'any_stack';
  return serverError(fakeError);
};

interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  LogErrorRepositoryStub: LogErrorRepository;
}
const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const LogErrorRepositoryStub = makeLogErrorRepository();
  const handleSpy = jest.spyOn(controllerStub, 'handle');
  const sut = new LogControllerDecorator(
    controllerStub,
    LogErrorRepositoryStub
  );
  return { sut, controllerStub, LogErrorRepositoryStub };
};

describe('LogControllerDecorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');

    await sut.handle(makeFakeRequest());
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest());
  });

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, LogErrorRepositoryStub } = makeSut();
    const logSpy = jest.spyOn(LogErrorRepositoryStub, 'logError');

    jest
      .spyOn(controllerStub, 'handle')
      .mockResolvedValueOnce(makeFakeServerError());

    await sut.handle(makeFakeRequest());
    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
