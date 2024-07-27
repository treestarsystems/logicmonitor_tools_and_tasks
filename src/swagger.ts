import { INestApplication } from '@nestjs/common';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';

/**
 * SwaggerDocumentVersioned class to create a versioned Swagger document.
 * @param appObject - The NestJS application object.
 * @param apiPrefix - The API prefix for the application.
 * @param version - The version of the API.
 * @param title - The title of the API.
 * @param description - The description of the API.
 * @returns SwaggerDocumentVersioned object.
 */
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

  /**
   * API document options for SwaggerModule.setup.
   * @param jsonDocumentUrl - The URL for the JSON document.
   * @param yamlDocumentUrl - The URL for the YAML document.
   * @returns API document options object.
   * @private
   * @memberof SwaggerDocumentVersioned
   * @access private
   */
  private apiDocumentOptions = {
    jsonDocumentUrl: `${this.apiPrefix}/${this.version}/docs/json`,
    yamlDocumentUrl: `${this.apiPrefix}/${this.version}/docs/yaml`,
  };

  /**
   * Create a new Swagger document.
   * @returns DocumentBuilder object.
   * @private
   * @memberof SwaggerDocumentVersioned
   * @access private
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
   * @private
   * @memberof SwaggerDocumentVersioned
   * @access private
   */
  private apiDocument = SwaggerModule.createDocument(
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
   * @memberof SwaggerDocumentVersioned
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
