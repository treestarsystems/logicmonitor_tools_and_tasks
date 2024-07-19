import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import {
  SwaggerDocumentV1,
  SwaggerDocumentOptionsV1,
  ApiDocumentOptionsV1,
} from './swagger';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/v',
    defaultVersion: ['1'],
  });
  const apiDocumentV1 = SwaggerModule.createDocument(
    app,
    SwaggerDocumentV1,
    SwaggerDocumentOptionsV1,
  );
  SwaggerModule.setup('api/v1/docs', app, apiDocumentV1, ApiDocumentOptionsV1);
  await app.listen(3000);
}
bootstrap();
