import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { UtilsService } from './utils/utils.service';

/**
 * Custom global exception filter to return a custom error response object.
 * @class HttpExceptionFilter
 * @implements {ExceptionFilter}
 * @memberof module:customGlobalHttpExceptionFilter
 * @access public
 * @public
 */

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const utilsService = new UtilsService();
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const message: any = exception.getResponse();
    response
      .status(status)
      .json(utilsService.defaultErrorHandlerHttp(message, status));
  }
}
