import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

/**
 * Custom global exception filter to return a custom error response object.
 * @class HttpExceptionFilter
 * @implements {ExceptionFilter}
 * @memberof module:customGlobalHttpExceptionFilter
 * @access public
 */

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const message: any = exception.getResponse();

    response.status(status).json({
      status: 'failure',
      httpStatus: status,
      message: message?.message ? message.message : message,
      payload: [],
    });
  }
}
