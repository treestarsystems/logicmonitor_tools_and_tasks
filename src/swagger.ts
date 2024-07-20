import { INestApplication } from '@nestjs/common';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';

export class SwaggerDocumentVersioned {
  constructor(
    private readonly appObject: INestApplication<any>,
    private readonly apiPrefix: string,
    private readonly version: string,
    private readonly title: string,
    private readonly description: string,
  ) {}

  private readonly companyName = process.env.COMPANY_NAME;
  private readonly companySite = process.env.COMPANY_SITE;
  private readonly companyEmail = process.env.COMPANY_EMAIL;

  private SwaggerDocumentOptions: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  private apiDocumentOptions = {
    jsonDocumentUrl: `${this.apiPrefix}/${this.version}/docs/json`,
    yamlDocumentUrl: `${this.apiPrefix}/${this.version}/docs/yaml`,
  };

  private createDocument() {
    return new DocumentBuilder()
      .setTitle(this.title)
      .setDescription(this.description)
      .setVersion(this.version)
      .setContact(this.companyName, this.companySite, this.companyEmail)
      .build();
  }

  private apiDocument = SwaggerModule.createDocument(
    this.appObject,
    this.createDocument(),
    this.SwaggerDocumentOptions,
  );

  public SwaggerModuleSetup() {
    return SwaggerModule.setup(
      `${this.apiPrefix}/${this.version}/docs`,
      this.appObject,
      this.apiDocument,
      this.apiDocumentOptions,
    );
  }
}
