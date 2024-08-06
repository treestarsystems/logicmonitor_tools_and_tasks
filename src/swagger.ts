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
 * @access public
 * @public
 */
export class SwaggerDocumentVersioned {
  constructor(
    private readonly appObject: INestApplication<any>,
    private readonly apiPrefix: string,
    private readonly version: string,
    private readonly title: string,
    private readonly description: string,
  ) {}

  private readonly companyName: string = process.env.COMPANY_NAME;
  private readonly companySite: string = process.env.COMPANY_SITE;
  private readonly companyEmail: string = process.env.COMPANY_EMAIL;

  private SwaggerDocumentOptions: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  /**
   * API document options for SwaggerModule.setup.
   * @property {string} jsonDocumentUrl The URL for the JSON document.
   * @property {string} yamlDocumentUrl The URL for the YAML document.
   * @returns API document options object.
   * @memberof SwaggerDocumentVersioned
   * @access private
   * @private
   */
  private apiDocumentOptions = {
    jsonDocumentUrl: `${this.apiPrefix}/${this.version}/docs/json`,
    yamlDocumentUrl: `${this.apiPrefix}/${this.version}/docs/yaml`,
  };

  /**
   * Create a new Swagger document.
   * @returns DocumentBuilder object.
   * @memberof SwaggerDocumentVersioned
   * @access private
   * @private
   */

  private createDocument() {
    return new DocumentBuilder()
      .setTitle(this.title)
      .setDescription(this.description)
      .setVersion(this.version)
      .setContact(this.companyName, this.companySite, this.companyEmail)
      .build();
  }

  /**
   * API document object for SwaggerModule.createDocument.
   * @param {INestApplication<any>} appObject The NestJS application object.
   * @param createDocument The document builder object.
   * @param SwaggerDocumentOptions The Swagger document options object.
   * @returns API document object.
   * @memberof SwaggerDocumentVersioned
   * @access private
   * @private
   */
  private apiDocument: OpenAPIObject = SwaggerModule.createDocument(
    this.appObject,
    this.createDocument(),
    this.SwaggerDocumentOptions,
  );

  /**
   * Setup the Swagger module.
   * @returns SwaggerModule.setup object.
   * @memberof SwaggerDocumentVersioned
   * @access public
   * @public
   */

  public SwaggerModuleSetup() {
    return SwaggerModule.setup(
      `${this.apiPrefix}/${this.version}/docs`,
      this.appObject,
      this.apiDocument,
      this.apiDocumentOptions,
    );
  }
}
