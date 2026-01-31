import { INestApplication } from '@nestjs/common';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
  OpenAPIObject,
} from '@nestjs/swagger';

/**
 * SwaggerDocumentVersioned class to create a versioned Swagger document.
 * @param {INestApplication<any>} appObject The NestJS application object.
 * @param {string} apiPrefix The API prefix for the application.
 * @param {string} version The version of the API.
 * @param {string} title The title of the API.
 * @param {string} description The description of the API.
 * @returns {SwaggerDocumentVersioned} SwaggerDocumentVersioned object.
 * @memberof SwaggerDocumentVersioned
 * @public
 */
export class SwaggerDocumentVersioned {
  /**
   * Creates an instance of SwaggerDocumentVersioned.
   * @param {INestApplication<unknown>} appObject The NestJS application object.
   * @param {string} apiPrefix The API prefix for the application.
   * @param {string} version The version of the API.
   * @param {string} title The title of the API.
   * @param {string} description The description of the API.
   * @memberof SwaggerDocumentVersioned
   * @public
   */
  constructor(
    private readonly appObject: INestApplication<unknown>,
    private readonly apiPrefix: string,
    private readonly version: string,
    private readonly title: string,
    private readonly description: string
  ) {}

  private readonly companyName: string = process.env.SWAGGER_COMPANY_NAME;
  private readonly companySite: string = process.env.SWAGGER_COMPANY_SITE;
  private readonly companyEmail: string = process.env.SWAGGER_COMPANY_EMAIL;

  private SwaggerDocumentOptions: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  /**
   * API document options for SwaggerModule.setup.
   * @property {string} jsonDocumentUrl The URL for the JSON document.
   * @property {string} yamlDocumentUrl The URL for the YAML document.
   * @returns {{jsonDocumentUrl: string, yamlDocumentUrl: string}} API document options object.
   * @memberof SwaggerDocumentVersioned
   * @private
   */
  private apiDocumentOptions = {
    jsonDocumentUrl: `${this.apiPrefix}/${this.version}/docs/json`,
    yamlDocumentUrl: `${this.apiPrefix}/${this.version}/docs/yaml`,
  };

  /**
   * Create a new Swagger document.
   * @returns {Omit<OpenAPIObject, 'paths'>} DocumentBuilder object.
   * @memberof SwaggerDocumentVersioned
   * @private
   */
  private createDocument(): Omit<OpenAPIObject, 'paths'> {
    return new DocumentBuilder()
      .setTitle(this.title)
      .setDescription(this.description)
      .setVersion(this.version)
      .setContact(this.companyName, this.companySite, this.companyEmail)
      .build();
  }

  /**
   * API document object for SwaggerModule.createDocument.
   * @param {INestApplication<unknown>} appObject The NestJS application object.
   * @param {any} createDocument The document builder object.
   * @param {any} SwaggerDocumentOptions The Swagger document options object.
   * @returns {OpenAPIObject} API document object.
   * @memberof SwaggerDocumentVersioned
   * @private
   */
  private apiDocument: OpenAPIObject = SwaggerModule.createDocument(
    this.appObject,
    this.createDocument(),
    this.SwaggerDocumentOptions
  );

  /**
   * Configures and initializes the Swagger documentation UI at the specified endpoint path.
   * @returns {void}
   * @memberof SwaggerDocumentVersioned
   * @public
   */
  public SwaggerModuleSetup(): void {
    return SwaggerModule.setup(
      `${this.apiPrefix}/${this.version}/docs`,
      this.appObject,
      this.apiDocument,
      this.apiDocumentOptions
    );
  }
}
