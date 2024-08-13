import { Injectable } from '@nestjs/common';
import { BackupServiceDatasources } from '../tools/tools-backup-datasources.service';
import { BackupServiceGeneral } from '../tools/tools-backup-general.service';
import {
  ResponseObjectDefault,
  ResponseObjectDefaultGenerator,
} from '../utils/utils.models';
import { UtilsService } from '../utils/utils.service';

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
  ): Promise<void | ResponseObjectDefault> {
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

      progressTracking.success = [
        ...(backupServiceDatasourcesResponse.payload[0]?.success ?? []),
        ...(backupServiceGeneralResponseReports.payload[0]?.success ?? []),
        ...(backupServiceGeneralResponseAlertRules.payload[0]?.success ?? []),
      ];
      progressTracking.failure = [
        ...(backupServiceDatasourcesResponse.payload[0]?.failure ?? []),
        ...(backupServiceGeneralResponseReports.payload[0]?.failure ?? []),
        ...(backupServiceGeneralResponseAlertRules.payload[0]?.failure ?? []),
      ];

      returnObj.payload = [progressTracking];
      if (progressTracking.failure.length > 0) {
        returnObj.status = 'failure';
        returnObj.httpStatus = 400;
        returnObj.message = 'A backup item failed';
      }
      if (directlyRespondToApiCall) {
        response.status(returnObj.httpStatus).send(returnObj);
      } else {
        return returnObj;
      }
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
      } else {
        return returnObj;
      }
    }
  }
}
