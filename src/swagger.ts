import { DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';

export const SwaggerDocumentV1 = new DocumentBuilder()
  .setTitle('LogicMonitor Tools and Tasks')
  .setDescription('API for LogicMonitor Tools and Tasks V1')
  .setVersion('v1')
  .addTag('tools')
  .addTag('tasks')
  .addTag('schedules')
  .build();

export const SwaggerDocumentOptionsV1: SwaggerDocumentOptions = {
  operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
};

export const ApiDocumentOptionsV1 = {
  jsonDocumentUrl: 'api/v1/docs/json',
  yamlDocumentUrl: 'api/v1/docs/yaml',
};
