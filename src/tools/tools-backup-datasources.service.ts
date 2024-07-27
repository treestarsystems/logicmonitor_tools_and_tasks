import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ResponseObjectDefault,
  RequestObjectLMApi,
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
 * @injectable
 * @api
 * @export
 * @implements {BackupServiceDatasources}
 * @injectable
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
   * @param company  The company name for the LogicMonitor account.
   * @param accessId  The access ID for the LogicMonitor account.
   * @param accessKey  The access key for the LogicMonitor account.
   * @param searchString  The search string to filter the datasources.
   * @param response  The response object to send the response back to the client.
   */
  async backupDatasources(
    company: string,
    accessId: string,
    accessKey: string,
    groupName: string,
    response: any,
  ): Promise<void> {
    let returnObj = {
      status: 'success',
      httpStatus: 0,
      message: '',
      payload: [],
    };

    try {
      // Create an object to store the progress of the backup jobs.
      const progressTracking = {
        success: [],
        failure: [],
      };
      const datasourcesGetObj: RequestObjectLMApi = {
        method: 'GET',
        accessId: accessId,
        accessKey: accessKey,
        epoch: new Date().getTime(),
        resourcePath: '/setting/datasources',
        queryParams: `filter=group~"${groupName}"`,
        url: function (resourcePath: string) {
          return `https://${company}.logicmonitor.com/santaba/rest${resourcePath}`;
        },
        requestData: {},
        apiVersion: 3,
      };
      const datasourcesList: ResponseObjectDefault =
        await this.utilsService.genericAPICall(datasourcesGetObj);
      returnObj.httpStatus = datasourcesList.httpStatus;
      if (datasourcesList.status == 'failure') throw datasourcesList.message;
      // Lets loop through the response and extract the items that match our filter into a new array.
      const payloadItems = JSON.parse(datasourcesList.payload).items;
      for (const dle of payloadItems) {
        let datasourceNameParsed = `datasource_${dle.name.replace(/\W/g, '_')}`;
        try {
          const datasourcesGetXMLObj: RequestObjectLMApi = {
            method: 'GET',
            accessId: accessId,
            accessKey: accessKey,
            epoch: new Date().getTime(),
            resourcePath: `/setting/datasources/${dle.id}`,
            queryParams: 'format=xml',
            url: function (resourcePath: string) {
              return `https://${company}.logicmonitor.com/santaba/rest${resourcePath}`;
            },
            requestData: {},
            apiVersion: 3,
          };
          const datasourceXMLExport =
            await this.utilsService.genericAPICall(datasourcesGetXMLObj);
          returnObj.httpStatus = datasourceXMLExport.httpStatus;
          if (datasourceXMLExport.status == 'failure')
            throw new Error(datasourceXMLExport.message);
          if (typeof datasourceXMLExport.payload[0] === 'string') {
            // Store the XML string and JSON object to a file or in a database.
            const dataXML: string = datasourceXMLExport.payload[0];
            const dataJSON: object = dle;
            const storageObj: BackupLMDataDatasource = {
              type: 'dataSource',
              name: dle.name,
              nameFormatted: datasourceNameParsed,
              company: company,
              group: dle.group,
              dataXML: dataXML,
              dataJSON: dataJSON,
            };
            // MongoDB storage call.
            await this.storageServiceMongoDb.upsert(
              this.backupDatasourceModel,
              { nameFormatted: datasourceNameParsed },
              storageObj,
            );
            progressTracking.success.push(`Success: ${datasourceNameParsed}`);
            continue;
          } else {
            throw new Error('Payload is not a string');
          }
        } catch (err) {
          progressTracking.failure.push(
            `Failure: ${datasourceNameParsed} - ${err}`,
          );
        }
      }
      returnObj.payload.push(progressTracking);
      if (progressTracking.failure.length > 0) {
        returnObj.status = 'failure';
        returnObj.httpStatus = 500;
      }
      if (progressTracking.success.length == 0) {
        returnObj.status = 'failure';
        returnObj.httpStatus = 404;
        returnObj.message =
          'No datasources found with the specified group name.';
      } else {
        returnObj.message = `Datasources backup completed: ${progressTracking.success.length} successful, ${progressTracking.failure.length} failed.`;
      }
      response.status(returnObj.httpStatus).send(returnObj);
    } catch (err) {
      response
        .status(returnObj.httpStatus)
        .send(this.utilsService.defaultErrorHandler(err, returnObj.httpStatus));
    }
  }
}
