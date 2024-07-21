import { Injectable, Logger } from '@nestjs/common';
import {
  ResponseObjectDefault,
  RequestObjectLMApi,
} from '../utils/models.service';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class BackupService {
  constructor(private readonly utilsService: UtilsService) {}

  //Documentation: https://www.logicmonitor.com/support/rest-api-developers-guide/v1/datasources/get-datasources
  async backupDatasources(
    company: string,
    accessId: string,
    accessKey: string,
    searchString: string,
    response: any,
  ): Promise<void> {
    let returnObj = {
      status: 'success',
      httpStatus: 0,
      message: '',
      payload: [],
    };

    try {
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
        queryParams: `filter=group:"${searchString}"`,
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
        let datasourceName = `datasource_${dle.name.replace(/\W/g, '_')}.xml`;
        try {
          // Convert datasource name to a valid file name.
          // Define a new get obj so we can query the API for an XML version of the datasource.
          const datasourcesGetXMLObj = {
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
            let xmlString = datasourceXMLExport.payload[0];
            // Store the XML string to a file or in a database.
          } else {
            throw new Error('Payload is not a string');
          }
          progressTracking.success.push(`Success: ${datasourceName}`);
        } catch (err) {
          progressTracking.failure.push(`Failure: ${datasourceName} - ${err}`);
        }
      }
      returnObj.payload.push(progressTracking);
      if (progressTracking.failure.length > 0) {
        returnObj.status = 'failure';
        returnObj.httpStatus = 500;
      }
      returnObj.message = `Datasources backup completed: ${progressTracking.success.length} successful, ${progressTracking.failure.length} failed.`;
      response.status(returnObj.httpStatus).send(returnObj);
    } catch (err) {
      response
        .status(returnObj.httpStatus)
        .send(this.utilsService.defaultErrorHandler(err, returnObj.httpStatus));
    }
  }
}
