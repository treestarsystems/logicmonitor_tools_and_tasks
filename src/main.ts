import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerDocumentVersioned } from './swagger';
import { VersioningType, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const apiRoutePrefix = 'api';
  const app = await NestFactory.create(AppModule);
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
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
