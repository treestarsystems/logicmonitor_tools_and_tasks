import { Injectable } from '@nestjs/common';
import {
  ResponseObjectDefault,
  RequestObjectLMApi,
} from '../utils/models.service';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class BackupService {
  constructor(private readonly utilsService: UtilsService) {}

  private accessId = process.env.LM_ACCESS_ID;
  private accessKey = process.env.LM_ACCESS_KEY;
  private company = process.env.LM_COMPANY;

  //Documentation: https://www.logicmonitor.com/support/rest-api-developers-guide/v1/datasources/get-datasources
  async backupDatasources(
    requestObject: RequestObjectLMApi,
  ): Promise<ResponseObjectDefault> {
    let returnObj = { status: '', message: '', payload: '' };
    const {
      accessId,
      accessKey,
      company,
      utilsService: { genericAPICall, defaultErrorHandler },
    } = this;

    try {
      const datasourcesGetObj = {
        method: 'GET',
        accessId: accessId,
        accessKey: accessKey,
        epoch: new Date().getTime(),
        resourcePath: '/setting/datasources',
        queryParams: '?filter=group:_<CLIENT>',
        url: function () {
          return `https://${company}.logicmonitor.com/santaba/rest${this.resourcePath}`;
        },
      };
      //Get list of datasources
      const datasourcesList: ResponseObjectDefault =
        await genericAPICall(requestObject);
      if (datasourcesList.status == 'failure') throw datasourcesList.payload;
      //Lets loop through the response and extract the items that match our filter into a new array.
      for (const dle of datasourcesList.payload) {
        console.log(dle);
        /*
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
          */
      }
      return {
        status: 'success',
        message: 'Datasources backup complete',
        payload: [],
      };
    } catch (err) {
      return defaultErrorHandler(err);
    }
  }
}
