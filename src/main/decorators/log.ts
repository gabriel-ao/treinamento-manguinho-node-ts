import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '../../presentation/protocols';

import { LogErrorRepository } from '../../data/protocols/log-error-repository';
import { serverError } from '../../presentation/helpers/http-helper';

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller;
  private readonly logErrorRepository: LogErrorRepository;

  constructor(controller: Controller, logErrorRepository: LogErrorRepository) {
    this.controller = controller;
    this.logErrorRepository = logErrorRepository;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const httpResponse = await this.controller.handle(httpRequest);
      if (httpResponse.statusCode === 500) {
        await this.logErrorRepository.log(httpResponse.body.stack);
      }
      return httpResponse;
    } catch (error: any) {
      await this.logErrorRepository.log(error?.stack ?? '');
      return serverError(error);
    }
  }
}
