import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { UtilsService } from './utils/utils.service';

/**
 * Custom global exception filter to return a custom error response object.
 * @class HttpExceptionFilter
 * @implements {ExceptionFilter}
 * @memberof module:customGlobalHttpExceptionFilter
 * @public
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * Catch method to handle the exception and return a custom error response.
   * @param {HttpException} exception The exception object.
   * @param {ArgumentsHost} host The arguments host object.
   * @returns {void}
   */
  catch(exception: HttpException, host: ArgumentsHost): void {
    const utilsService = new UtilsService();
    const ctx = host.switchToHttp();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const message = exception.getResponse();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    response.status(status).json(utilsService.defaultErrorHandlerHttp(message, status));
  }
}
