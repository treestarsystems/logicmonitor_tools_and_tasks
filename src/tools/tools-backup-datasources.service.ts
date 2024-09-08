import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  RequestObjectLMApi,
  ResponseObjectDefault,
  ResponseObjectDefaultBuilder,
  RequestObjectLMApiBuilder,
} from '../utils/utils.models';
import { UtilsService } from '../utils/utils.service';
import { StorageServiceMongoDB } from '../storage/storage-mongodb.service';
import {
  BackupLMDataDatasource,
  BackupDocumentDatasource,
} from '../storage/schemas/storage-mongodb.schema';

/**
 * BackupServiceDatasources class to handle all datasource related API calls.
 * @class BackupServiceDatasources
 * @memberof module:tools
 * @implements {BackupServiceDatasources}
 * @injectable
 * @api
 */

@Injectable()
export class BackupServiceDatasources {
  constructor(
    private readonly utilsService: UtilsService,
    private readonly storageServiceMongoDb: StorageServiceMongoDB,
    @InjectModel(BackupLMDataDatasource.name)
    private readonly backupDatasourceModel: Model<BackupDocumentDatasource>,
  ) {}

  /**
   * Backup datasources with a group name that matches the search string to MongoDB.
   * Documentation: https://www.logicmonitor.com/support/rest-api-developers-guide/v1/datasources/get-datasources
   * @param {string} company  The company name for the LogicMonitor account.
   * @param {string} accessId  The access ID for the LogicMonitor account.
   * @param {string} accessKey  The access key for the LogicMonitor account.
   * @param {string} searchString  The search string to filter the datasources.
   * @param {Response} response  The response object to send the response back to the client.
   */
  async backupDatasourcesByGroupName(
    company: string,
    accessId: string,
    accessKey: string,
    groupName: string,
    response: any,
    directlyRespondToApiCall: boolean = true,
  ): Promise<void | ResponseObjectDefault> {
    let returnObj: ResponseObjectDefault =
      new ResponseObjectDefaultBuilder().build();
    try {
      const progressTracking = {
        success: [],
        failure: [],
      };

      const datasourcesGetObj: RequestObjectLMApi =
        new RequestObjectLMApiBuilder()
          .setMethod('GET')
          .setAccessId(accessId)
          .setAccessKey(accessKey)
          .setQueryParams(`filter=group~"${groupName}"`)
          .setUrl(company, '/setting/datasources')
          .build();

      const datasourcesList: ResponseObjectDefault =
        await this.utilsService.genericAPICall(datasourcesGetObj);
      returnObj.httpStatus = datasourcesList.httpStatus;
      if (datasourcesList.status == 'failure') {
        progressTracking.failure.push(
          `Failure: Retrieving datasource list - ${datasourcesList.message}`,
        );
        returnObj.payload.push(progressTracking);
        throw new Error(
          this.utilsService.defaultErrorHandlerString(datasourcesList.message),
        );
      }
      // Lets loop through the response and extract the items that match our filter into a new array.
      const payloadItems = JSON.parse(datasourcesList.payload).items ?? [];
      for (const dle of payloadItems) {
        const datasourceNameParsed: string = `datasource_${dle.name.replace(/\W/g, '_')}`;
        try {
          const datasourcesGetXMLObj: RequestObjectLMApi =
            new RequestObjectLMApiBuilder()
              .setMethod('GET')
              .setAccessId(accessId)
              .setAccessKey(accessKey)
              .setQueryParams('format=xml')
              .setUrl(company, `/setting/datasources/${dle.id}`)
              .build();

          const datasourceXMLExport: ResponseObjectDefault =
            await this.utilsService.genericAPICall(datasourcesGetXMLObj);
          returnObj.httpStatus = datasourceXMLExport.httpStatus;
          if (datasourceXMLExport.status == 'failure') {
            const errMsg = this.utilsService.defaultErrorHandlerString(
              datasourceXMLExport.message,
            );
            progressTracking.failure.push(
              `Failure: ${datasourceNameParsed} - ${errMsg}`,
            );
            throw new Error(errMsg);
          }

          await this.processXMLDataExport(
            datasourceXMLExport,
            dle,
            datasourceNameParsed,
            company,
            progressTracking,
          );
        } catch (err) {
          progressTracking.failure.push(
            `Failure: ${datasourceNameParsed} - ${err}`,
          );
        }
      }
      returnObj.payload.push(progressTracking);
      if (progressTracking.failure.length > 0) {
        returnObj.httpStatus = 500;
        throw new Error(
          `Backup failure: ${progressTracking.failure.length} failed.`,
        );
      }
      if (progressTracking.success.length == 0) {
        returnObj.httpStatus = 404;
        throw new Error('No datasources found with the specified group name.');
      }
      returnObj.message = `Datasources backup completed: ${progressTracking.success.length} successful, ${progressTracking.failure.length} failed.`;
      if (directlyRespondToApiCall) {
        response.status(returnObj.httpStatus).send(returnObj);
        return;
      }
      return returnObj;
    } catch (err) {
      if (directlyRespondToApiCall) {
        response
          .status(returnObj.httpStatus)
          .send(
            this.utilsService.defaultErrorHandlerHttp(
              err,
              returnObj.httpStatus,
            ),
          );
        return;
      }
      return this.utilsService.defaultErrorHandlerHttp(
        err,
        returnObj.httpStatus,
      );
    }
  }

  /**
   * Handles the export of a datasource by storing it in the MongoDB and updating the progress tracking.
   * @param {any} datasourceXMLExport - The export result containing the XML payload.
   * @param {any} dle - The datasource object containing details about the datasource.
   * @param {string} datasourceNameParsed - The parsed name of the datasource.
   * @param {string} company - The company associated with the datasource.
   * @param {any} progressTracking - The object used to track the progress of the export operation.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   * @throws {Error} - Throws an error if the payload is not a string or if there is an issue with the upsert operation.
   */

  private async processXMLDataExport(
    datasourceXMLExport: any,
    dle: any,
    datasourceNameParsed: string,
    company: string,
    progressTracking: any,
  ): Promise<void> {
    if (typeof datasourceXMLExport.payload[0] !== 'string') {
      throw new Error('Payload is not a string');
    }

    const dataXML: string = datasourceXMLExport.payload[0];
    const dataJSON: object = dle;
    const storageObj: BackupLMDataDatasource = {
      type: 'datasource',
      name: dle.name,
      nameFormatted: datasourceNameParsed,
      company: company,
      group: dle.group,
      dataXML: dataXML,
      dataJSON: dataJSON,
    };

    try {
      await this.storageServiceMongoDb.upsert(
        this.backupDatasourceModel,
        { nameFormatted: datasourceNameParsed },
        storageObj,
      );
      progressTracking.success.push(`Success: ${datasourceNameParsed}`);
    } catch (err) {
      const errMsg = this.utilsService.defaultErrorHandlerString(err);
      progressTracking.failure.push(
        `Failure: ${datasourceNameParsed} - ${errMsg}`,
      );
    }
  }
}
