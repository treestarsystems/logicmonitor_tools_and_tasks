import { promises as fs } from 'fs';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ResponseObjectDefault,
  RequestObjectLMApi,
  RequestObjectLMApiExtraRequestProperties,
  RequestObjectLMApiBuilder,
  ResponseObjectDefaultBuilder,
} from '../utils/utils.models';
import { UtilsService } from '../utils/utils.service';
import { StorageServiceMongoDB } from '../storage/storage-mongodb.service';
import { StorageServiceZip } from '../storage/storage-zip.service';
import {
  BackupLMDataDatasource,
  BackupLMDataGeneral,
  BackupDocumentDatasource,
  BackupDocumentGeneral,
} from '../storage/schemas/storage-mongodb.schema';

/**
 * BackupServiceGeneral class to handle all general backup related API calls.
 * @class BackupServiceGeneral
 * @memberof module:tools
 * @injectable
 * @public
 * @export
 */

@Injectable()
export class BackupServiceGeneral {
  constructor(
    private readonly utilsService: UtilsService,
    private readonly storageServiceMongoDb: StorageServiceMongoDB,
    private readonly storageServiceZip: StorageServiceZip,
    @InjectModel(BackupLMDataDatasource.name)
    private readonly backupDatasourceModel: Model<BackupDocumentDatasource>,
    @InjectModel(BackupLMDataGeneral.name)
    private readonly backupGeneralModel: Model<BackupDocumentGeneral>,
  ) {}

  /**
   * Backup datasources with a group name that matches the search string to MongoDB.
   * Documentation: https://www.logicmonitor.com/support/rest-api-developers-guide/v1/datasources/get-datasources
   * @param {string} company  The company name for the LogicMonitor account.
   * @param {string} accessId  The access ID for the LogicMonitor account.
   * @param {string} accessKey  The access key for the LogicMonitor account.
   * @param {RequestObjectLMApiExtraRequestProperties} extraRequestProperties  The extra request properties to send in the API call (resourcePath, queryParams, requestData).
   * @param {any} request  The request object from the client.
   * @param {Response} response  The response object to send the response back to the client.
   * @param {boolean} [directlyRespondToApiCall=true] - Whether to directly respond to the API call or return the returnObj.
   * @returns {Promise<void | ResponseObjectDefault>} A promise that resolves to void or a ResponseObjectDefault.
   */

  async backupGeneralGet(
    company: string,
    accessId: string,
    accessKey: string,
    extraRequestProperties: RequestObjectLMApiExtraRequestProperties,
    request: any,
    response: any,
    directlyRespondToApiCall: boolean = true,
  ): Promise<void | ResponseObjectDefault> {
    let returnObj: ResponseObjectDefault =
      new ResponseObjectDefaultBuilder().build();
    // Get the backup type from the request URL.
    let backupType = request.originalUrl.split('/').pop();
    if (backupType?.endsWith('s')) {
      backupType = backupType.slice(0, -1);
    }
    // Confirm the backup type matches the resource path.
    const routeMatchString = backupType.slice(0, 4);
    if (!extraRequestProperties?.resourcePath.includes(routeMatchString)) {
      throw new Error(
        `Backup type (${backupType}) does not match the resource path (${extraRequestProperties?.resourcePath})`,
      );
    }
    try {
      // Create an object to store the progress of the backup jobs.
      const progressTracking = {
        success: [],
        failure: [],
      };
      const generalGetObj: RequestObjectLMApi = new RequestObjectLMApiBuilder()
        .setMethod('GET')
        .setAccessId(accessId)
        .setAccessKey(accessKey)
        .setQueryParams(extraRequestProperties?.queryParams)
        .setUrl(company, extraRequestProperties?.resourcePath)
        .setRequestData(extraRequestProperties?.requestData)
        .build();

      const resultList: ResponseObjectDefault =
        await this.utilsService.genericAPICall(generalGetObj);
      returnObj.httpStatus = resultList.httpStatus;

      if (resultList.status === 'failure') {
        const failureMessage = `Failure: Retrieving ${backupType} list - ${resultList.message}`;
        progressTracking.failure.push(failureMessage);
        returnObj.payload.push(progressTracking);
        const errorMessage = this.utilsService.defaultErrorHandlerString(
          resultList.message,
        );
        throw new Error(errorMessage);
      }
      // Lets loop through the response and extract the items that match our filter into a new array.
      const payloadItems = JSON.parse(resultList.payload).items ?? [];
      this.processPayloadItems(
        payloadItems,
        backupType,
        company,
        progressTracking,
      );
      returnObj.payload.push(progressTracking);
      if (progressTracking.failure.length > 0) {
        returnObj.httpStatus = 500;
        throw new Error(
          `Backup failure: ${progressTracking.failure.length} failed.`,
        );
      }
      if (progressTracking.success.length == 0) {
        returnObj.httpStatus = 404;
        throw new Error(`No ${backupType} found matching the request.`);
      }
      returnObj.message = `${this.utilsService.capitalizeFirstLetter(backupType)} backup completed: ${progressTracking.success.length} successful, ${progressTracking.failure.length} failed.`;
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
   * Retrieve datasources with a group name that matches the search string from MongoDB.
   * @param {string} company  The company name for the LogicMonitor account.
   * @param {Response} response  The response object to send the response back to the client.
   * @returns {Promise<void>} A promise that resolves to void.
   */

  async retrieveBackupsAll(company: string, response: any): Promise<void> {
    // This method will only return JSON object when there is an error.
    let returnObj: ResponseObjectDefault =
      new ResponseObjectDefaultBuilder().build();
    const outputFileBasePath = `./tmp`;
    const backupsListAll = [];
    try {
      // Find all backups in the MongoDB database.
      const backupsListGeneral = await this.storageServiceMongoDb.find(
        this.backupGeneralModel,
        { company: company, type: { $not: new RegExp('datasource', 'i') } },
      );
      const backupsListDatasources = await this.storageServiceMongoDb.find(
        this.backupDatasourceModel,
        { company: company, type: new RegExp('datasource', 'i') },
      );
      // Combine the two arrays into one.
      backupsListAll.push(...backupsListDatasources, ...backupsListGeneral);
      if (backupsListAll.length == 0) {
        returnObj.httpStatus = 404;
        throw new Error(
          'No datasource, alert rule, or report backups found matching the comopany name. Please run a backup first.',
        );
      } else {
        returnObj.message = `Backups found: ${backupsListAll.length}`;
        let fileContents = {};
        // Loop through the backups and add them to the fileContents object.
        for (const dbi of backupsListAll) {
          const fileName = `${company}_${dbi.nameFormatted}`;
          if (dbi.dataXML) {
            fileContents[`${fileName}.xml`] = dbi.dataXML;
            returnObj.payload.push(`File added: ${fileName}.xml`);
          }
          if (dbi.dataJSON) {
            fileContents[`${fileName}.json`] = JSON.stringify(dbi.dataJSON);
            returnObj.payload.push(`File added: ${fileName}.json`);
          }
        }
        const outputFileName = `${company}_backups.zip`;
        const outputFilePath = `${outputFileBasePath}/${outputFileName}`;
        // Create the output directory if it doesn't exist.
        fs.mkdir(outputFileBasePath, { recursive: true });
        await this.storageServiceZip.createZipWithTextFiles(
          fileContents,
          outputFilePath,
        );
        returnObj.message = `Backups found: ${backupsListAll.length}. ZIP file created successfully with ${returnObj.payload.length} files.`;
        response.download(outputFilePath, outputFileName, (err) => {
          if (err) {
            returnObj.httpStatus = 500;
            const errMsg = this.utilsService.defaultErrorHandlerString(err);
            console.error(`Error downloading the file - ${errMsg}`);
            throw new Error(`Creating download file - ${errMsg}`);
          }
        });
      }
    } catch (err) {
      response
        .status(returnObj.httpStatus)
        .send(
          this.utilsService.defaultErrorHandlerHttp(err, returnObj.httpStatus),
        );
    } finally {
      const dirExists = await fs
        .access(outputFileBasePath)
        .then(() => true)
        .catch(() => false);
      if (dirExists) {
        // Remove the temporary directory.
        await fs.rm(outputFileBasePath, { recursive: true, force: true });
      }
    }
  }

  /**
   * Process the payload items and store them in MongoDB.
   * @param {any} payloadItems  The payload items to process.
   * @param {string} backupType  The type of backup.
   * @param {string} company  The company name for the LogicMonitor account.
   * @param {object} progressTracking  The object to track the progress of the backup jobs.
   * @returns {void} Void.
   */

  private processPayloadItems(
    payloadItems: any,
    backupType: string,
    company: string,
    progressTracking: { success: string[]; failure: string[] },
  ) {
    for (const pli of payloadItems) {
      let backupNameParsed = `${backupType}_${pli.name.replace(/\W/g, '_')}`;
      const dataJSON: object = pli;
      const storageObj: BackupLMDataGeneral = {
        type: backupType,
        name: pli.name,
        nameFormatted: backupNameParsed,
        company: company,
        dataJSON: dataJSON,
      };
      // MongoDB storage call.
      try {
        this.storageServiceMongoDb.upsert(
          this.backupGeneralModel,
          { nameFormatted: backupNameParsed },
          storageObj,
        );
        progressTracking.success.push(`Success: ${backupNameParsed}`);
      } catch (err) {
        // I am not sure if this is the correct way to handle the error.
        const errMsg = this.utilsService.defaultErrorHandlerString(err);
        progressTracking.failure.push(
          `Failure: ${backupNameParsed} - ${errMsg}`,
        );
      }
    }
  }
}
