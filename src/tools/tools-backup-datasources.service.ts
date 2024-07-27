import * as fs from 'fs';
import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ResponseObjectDefault,
  RequestObjectLMApi,
} from '../utils/utils.models';
import { UtilsService } from '../utils/utils.service';
import { StorageServiceMongoDB } from '../storage/storage-mongodb.service';
import { StorageServiceZip } from '../storage/storage-zip.service';
import {
  BackupLMDataDatasource,
  BackupDocumentDatasource,
} from '../storage/schemas/storage-mongodb.schema';

@Injectable()
export class BackupServiceDatasources {
  constructor(
    private readonly utilsService: UtilsService,
    private readonly storageServiceMongoDb: StorageServiceMongoDB,
    private readonly storageServiceZip: StorageServiceZip,
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
        queryParams: `filter=group~"${searchString}"`,
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

  /**
   * Retrieve datasources with a group name that matches the search string from MongoDB.
   * @param groupName  The group name to filter the datasources.
   * @param response  The response object to send the response back to the client.
   */

  async retrieveDatasources(groupName: string, response: any): Promise<void> {
    // This method will only return JSON object when there is a server side error.
    let returnObj = {
      status: 'success',
      httpStatus: 200,
      message: '',
      payload: [],
    };
    const outputFileBasePath = `./tmp`;
    try {
      // Case insensitive search.
      const datasourcesList = await this.storageServiceMongoDb.find(
        this.backupDatasourceModel,
        {
          // Case insensitive search.
          group: { $regex: groupName, $options: 'i' },
        },
      );
      if (datasourcesList.length == 0) {
        returnObj.status = 'failure';
        returnObj.httpStatus = 404;
        returnObj.message = `No datasources found containing the specified group name: ${groupName}.`;
        throw `No datasources found containing the specified group name: ${groupName}.`;
      } else {
        returnObj.message = `Datasources found: ${datasourcesList.length}`;
        let fileContents = {};
        for (const dbi of datasourcesList) {
          if (dbi.dataXML) {
            fileContents[`${dbi.nameFormatted}.xml`] = dbi.dataXML;
            returnObj.payload.push(`File added: ${dbi.nameFormatted}.xml`);
          }
          if (dbi.dataJSON) {
            fileContents[`${dbi.nameFormatted}.json`] = JSON.stringify(
              dbi.dataJSON,
            );
            returnObj.payload.push(`File added: ${dbi.nameFormatted}.json`);
          }
        }
        const outputFileName = `datasources_${groupName}.zip`;
        const outputFilePath = `${outputFileBasePath}/${outputFileName}`;
        // Create the output directory if it doesn't exist.
        fs.mkdir(outputFileBasePath, { recursive: true }, (err) => {
          if (err) throw err;
        });
        await this.storageServiceZip.createZipWithTextFiles(
          fileContents,
          outputFilePath,
        );
        returnObj.message = `Datasources found: ${datasourcesList.length}. ZIP file created successfully with ${returnObj.payload.length} files.`;
        response.download(outputFilePath, outputFileName, (err) => {
          if (err) {
            console.error('Error downloading the file:', err);
            returnObj.status = 'failure';
            returnObj.httpStatus = 500;
            returnObj.message = `Error downloading the file: ${err}`;
            response.status(returnObj.httpStatus).send(returnObj);
          }
        });
      }
    } catch (err) {
      returnObj.status = 'failure';
      returnObj.httpStatus = 500;
      response
        .status(returnObj.httpStatus)
        .send(this.utilsService.defaultErrorHandler(err, returnObj.httpStatus));
    } finally {
      // Clean up the temporary files.
      fs.promises
        .access(outputFileBasePath)
        .then(() =>
          fs.promises.rm(outputFileBasePath, { recursive: true, force: true }),
        )
        .then(() =>
          Logger.log(
            `Temporary files at ${outputFileBasePath} have been removed.`,
          ),
        )
        .catch((err) => Logger.warn(`Error removing temporary files: ${err}`));
    }
  }
}
