import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerDocumentVersioned } from './swagger';
import {
  VersioningType,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { ResponseObjectDefault } from './utils/models.service';

async function bootstrap() {
  const apiRoutePrefix = 'api';
  const app = await NestFactory.create(AppModule);
  // Custom validation pipe to return a custom error response object.
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
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
    }),
  );
  app
    .enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    })
    .setGlobalPrefix(apiRoutePrefix);
  const apiDocumentV1 = new SwaggerDocumentVersioned(
    app,
    apiRoutePrefix,
    'v1',
    'LogicMonitor Tools and Tasks',
    'API for LogicMonitor Tools and Tasks v1',
  );
  apiDocumentV1.SwaggerModuleSetup();
  await app.listen(3000);
}
bootstrap();
