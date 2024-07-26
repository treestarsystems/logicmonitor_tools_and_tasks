import * as fs from 'fs';
import { Injectable, Logger } from '@nestjs/common';
import {
  ResponseObjectDefault,
  RequestObjectLMApi,
  RequestObjectLMApiExtraRequestProperties,
} from '../utils/utils.models';
import { UtilsService } from '../utils/utils.service';
import { StorageServiceMongoDB } from '../storage/storage-mongodb.service';
import { StorageServiceZip } from '../storage/storage-zip.service';
import { BackupLMDataGeneral } from '../storage/schemas/storage-mongodb.schema';

@Injectable()
export class BackupServiceGeneral {
  constructor(
    private readonly utilsService: UtilsService,
    private readonly storageServiceMongoDb: StorageServiceMongoDB,
    private readonly storageServiceZip: StorageServiceZip,
  ) {}

  /**
   * Backup datasources with a group name that matches the search string to MongoDB.
   * Documentation: https://www.logicmonitor.com/support/rest-api-developers-guide/v1/datasources/get-datasources
   * @param company  The company name for the LogicMonitor account.
   * @param accessId  The access ID for the LogicMonitor account.
   * @param accessKey  The access key for the LogicMonitor account.
   * @param extraRequestProperties  The extra request properties to send in the API call (resourcePath, queryParams, requestData).
   * @param response  The response object to send the response back to the client.
   */
  async backupGeneralGet(
    company: string,
    accessId: string,
    accessKey: string,
    extraRequestProperties: RequestObjectLMApiExtraRequestProperties,
    request: any,
    response: any,
  ): Promise<void> {
    let returnObj = {
      status: 'success',
      httpStatus: 200,
      message: '',
      payload: [],
    };
    // Get the backup type from the request URL.
    let backupType =
      request.originalUrl.split('/')[request.originalUrl.split('/').length - 1];
    // Remove the letter 's' if it is at the end of the string.
    if (backupType.endsWith('s')) {
      backupType = backupType.slice(0, -1);
    }
    let fileExtension: string;
    try {
      // Create an object to store the progress of the backup jobs.
      const progressTracking = {
        success: [],
        failure: [],
      };
      const generalGetObj: RequestObjectLMApi = {
        method: 'GET',
        accessId: accessId,
        accessKey: accessKey,
        epoch: new Date().getTime(),
        resourcePath: extraRequestProperties?.resourcePath
          ? extraRequestProperties.resourcePath
          : '/',
        queryParams: extraRequestProperties?.queryParams
          ? extraRequestProperties.queryParams
          : '',
        url: function (resourcePath: string) {
          return `https://${company}.logicmonitor.com/santaba/rest${resourcePath}`;
        },
        requestData: extraRequestProperties?.requestData
          ? extraRequestProperties.requestData
          : {},
        apiVersion: 3,
      };
      const resultList: ResponseObjectDefault =
        await this.utilsService.genericAPICall(generalGetObj);
      returnObj.httpStatus = resultList.httpStatus;
      if (resultList.status == 'failure') throw resultList.message;
      // Lets loop through the response and extract the items that match our filter into a new array.
      const payloadItems = JSON.parse(resultList.payload).items;

      for (const pli of payloadItems) {
        if (backupType != 'datasource') {
          fileExtension = 'json';
        } else {
          fileExtension = 'xml';
        }
        let backupNameParsed = `${backupType}_${pli.name.replace(/\W/g, '_')}.${fileExtension}`;
        const dataJSON: object = pli;
        const storageObj: BackupLMDataGeneral = {
          type: backupType,
          name: pli.name,
          nameFormatted: backupNameParsed,
          company: company,
          dataJSON: dataJSON,
        };
        // MongoDB storage call.
        await this.storageServiceMongoDb.upsert(
          { nameFormatted: backupNameParsed },
          storageObj,
        );
        progressTracking.success.push(`Success: ${backupNameParsed}`);
        continue;
      }
      returnObj.payload.push(progressTracking);
      if (progressTracking.failure.length > 0) {
        returnObj.status = 'failure';
        returnObj.httpStatus = 500;
      }
      if (progressTracking.success.length == 0) {
        returnObj.status = 'failure';
        returnObj.httpStatus = 404;
        returnObj.message = `No ${backupType} found matching the request.`;
      } else {
        returnObj.message = `$${backupType} backup completed: ${progressTracking.success.length} successful, ${progressTracking.failure.length} failed.`;
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
      const datasourcesList = await this.storageServiceMongoDb.find({
        // Case insensitive search.
        group: { $regex: groupName, $options: 'i' },
      });
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