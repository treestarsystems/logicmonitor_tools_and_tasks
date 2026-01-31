import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerDocumentVersioned } from './swagger';
import { HttpExceptionFilter } from './customGlobalHttpExceptionFIlter';
import { VersioningType, ValidationPipe, BadRequestException, Logger } from '@nestjs/common';
import { ResponseObjectDefault } from './utils/utils.models';

/**
 * Bootstrap the application.
 * @returns {Promise<void>} Promise object.
 * @function bootstrap
 * @memberof module:main
 * @private
 * @async
 */
async function bootstrap(): Promise<void> {
  const apiRoutePrefix: string = 'api';
  const app = await NestFactory.create(AppModule);
  // Custom exception filter to return a custom error response object.
  app.useGlobalFilters(new HttpExceptionFilter());
  // Custom validation pipe to return a custom error response object.
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors): BadRequestException => {
        let responseMessage = 'Validation failed: ';
        for (const error of errors) {
          responseMessage += `${error.constraints[Object.keys(error.constraints)[0]]}, `;
        }
        const result: ResponseObjectDefault = {
          status: 'failure',
          httpStatus: 400,
          message: responseMessage.trim().slice(0, -1),
          payload: [],
        };
        return new BadRequestException(result);
      },
      stopAtFirstError: true,
    })
  );
  // Enable versioning with URI type and default version 1.
  app
    .enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    })
    .setGlobalPrefix(apiRoutePrefix);
  const apiDocumentV1: SwaggerDocumentVersioned = new SwaggerDocumentVersioned(
    app,
    apiRoutePrefix,
    'v1',
    'LogicMonitor Tools and Tasks',
    'API for LogicMonitor Tools and Tasks v1'
  );
  apiDocumentV1.SwaggerModuleSetup();
  // Start app on port defined in .env file or 3000.
  await app.listen(process.env.PORT || 3000);
}

bootstrap().catch(error => {
  Logger.error('Failed to start application:', error);
  process.exit(1);
});
