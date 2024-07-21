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
      const datasourcesGetObj: RequestObjectLMApi = {
        method: 'GET',
        accessId: accessId,
        accessKey: accessKey,
        epoch: new Date().getTime(),
        resourcePath: '/setting/datasources',
        queryParams: `?filter=group:${searchString}`,
        url: function (resourcePath: string) {
          return `https://${company}.logicmonitor.com/santaba/rest${resourcePath}`;
        },
        requestData: {},
        apiVersion: 3,
      };
      //   Logger.log(datasourcesGetObj);
      //Get list of datasources
      const datasourcesList: ResponseObjectDefault =
        await this.utilsService.genericAPICall(datasourcesGetObj);
      //   Logger.log(datasourcesList);
      returnObj.httpStatus = datasourcesList.httpStatus;
      if (datasourcesList.status == 'failure') throw datasourcesList.message;
      //   Lets loop through the response and extract the items that match our filter into a new array.
      /*
      for (const dle of datasourcesList.payload) {
          Logger.log(dle);
          //Convert datasource name to a valid file name.
          let fileName = `datasource_${dle.name.replace(/\W/g, '_')}.xml`;
          //Full file path. I really dont need this but...
          let fullStoragePath = `${backupsDir}/${fileName}`;
          //Define a new get obj so we can query the API for an XML version of the datasource.
          let datasourcesGetXMLObj = {
            method: 'GET',
            accessId: accessId,
            accessKey: accessKey,
            epoch: new Date().getTime(),
            resourcePath: `/setting/datasources/${dle.id}`,
            queryParams: '?format=xml',
            url: function () {
              return `https://${company}.logicmonitor.com/santaba/rest${this.resourcePath}`;
            },
          };
          let datasourceXMLExport =
            await core.genericAPICall(datasourcesGetXMLObj);
          if (typeof datasourceXMLExport.payload === 'string') {
            let xmlString = datasourceXMLExport.payload;
            fs.writeFile(fullStoragePath, xmlString, async (err) => {
              if (err) console.log(`FAILED: ${fileName} : ${err}`);
              console.log(`SAVED: ${fileName}`);
            });
          } else {
            console.log(
              `FAILED: ${fileName} - ${datasourceXMLExport.payload.errmsg}`,
            );
          }
        }
        */
      //   return returnObj;
      response.status(datasourcesList.httpStatus).send(datasourcesList);
    } catch (err) {
      response
        .status(returnObj.httpStatus)
        .send(this.utilsService.defaultErrorHandler(err, returnObj.httpStatus));
    }
  }
}
