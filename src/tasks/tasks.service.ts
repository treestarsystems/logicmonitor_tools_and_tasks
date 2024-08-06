import { Injectable, Logger } from '@nestjs/common';
import { BackupServiceDatasources } from '../tools/tools-backup-datasources.service';
import { BackupServiceGeneral } from '../tools/tools-backup-general.service';
import {
  RequestObjectLMApi,
  ResponseObjectDefault,
  RequestObjectLMApiGenerator,
  ResponseObjectDefaultGenerator,
} from '../utils/utils.models';
import { UtilsService } from '../utils/utils.service';
import e from 'express';

@Injectable()
export class TasksService {
  constructor(
    private backupServiceDatasources: BackupServiceDatasources,
    private backupServiceGeneral: BackupServiceGeneral,
    private utilsService: UtilsService,
  ) {}

  //   getTaskList(): string {
  //     return 'This action returns all tasks';
  //   }

  async executeTaskBackups(
    company: string,
    accessId: string,
    accessKey: string,
    groupName: string,
    response: any,
  ): Promise<void> {
    let returnObj: ResponseObjectDefault = new ResponseObjectDefaultGenerator();
    const directlyRespondToApiCall = false;
    const extraRequestProperties = {
      resourcePath: '',
      queryParams: '',
      requestData: '',
    };
    // Create an object to store the progress of the backup jobs.
    const progressTracking = {
      success: [],
      failure: [],
    };
    try {
      // Backup datasources data by group name.
      const backupServiceDatasourcesResponse =
        (await this.backupServiceDatasources.backupDatasourcesByGroupName(
          company,
          accessId,
          accessKey,
          groupName,
          response,
          directlyRespondToApiCall,
        )) as ResponseObjectDefault;
      // Backup reports data.
      extraRequestProperties.resourcePath = '/report/reports';
      const backupServiceGeneralResponseReports =
        (await this.backupServiceGeneral.backupGeneralGet(
          company,
          accessId,
          accessKey,
          extraRequestProperties,
          { originalUrl: 'backup/reports' },
          response,
          directlyRespondToApiCall,
        )) as ResponseObjectDefault;
      // Backup alert rules data.
      extraRequestProperties.resourcePath = '/setting/alert/rules';
      const backupServiceGeneralResponseAlertRules =
        (await this.backupServiceGeneral.backupGeneralGet(
          company,
          accessId,
          accessKey,
          extraRequestProperties,
          { originalUrl: 'backup/alertrules' },
          response,
          directlyRespondToApiCall,
        )) as ResponseObjectDefault;

      // progressTracking.success.push(backupServiceDatasourcesResponse.payload[0]);
      progressTracking.success = [
        ...backupServiceDatasourcesResponse.payload[0].success,
        ...backupServiceGeneralResponseReports.payload[0].success,
        ...backupServiceGeneralResponseAlertRules.payload[0].success,
      ];
      progressTracking.failure = [
        ...backupServiceDatasourcesResponse.payload[0].failure,
        ...backupServiceGeneralResponseReports.payload[0].failure,
        ...backupServiceGeneralResponseAlertRules.payload[0].failure,
      ];

      //TODO: Test a failure scenario.
      //   if (progressTracking.failure.length > 0) {
      //     returnObj.httpStatus = 400;
      //     throw new Error('A backup item failed');
      //   }
      returnObj.payload = [progressTracking];
      response.status(returnObj.httpStatus).send(returnObj);
    } catch (err) {
      response
        .status(returnObj.httpStatus)
        .send(
          this.utilsService.defaultErrorHandlerHttp(err, returnObj.httpStatus),
        );
    }
  }
}
