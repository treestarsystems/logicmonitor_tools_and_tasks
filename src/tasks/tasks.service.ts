import { Injectable } from '@nestjs/common';
import { BackupServiceDatasources } from '../tools/tools-backup-datasources.service';
import { BackupServiceGeneral } from '../tools/tools-backup-general.service';
import {
  ResponseObjectDefault,
  ResponseObjectDefaultBuilder,
} from '../utils/utils.models';
import { UtilsService } from '../utils/utils.service';
import { AuditsService } from '../audits/audits.service';

@Injectable()
export class TasksService {
  constructor(
    private backupServiceDatasources: BackupServiceDatasources,
    private backupServiceGeneral: BackupServiceGeneral,
    private utilsService: UtilsService,
    private auditService: AuditsService,
  ) {}

  async executeTaskBackups(
    company: string,
    accessId: string,
    accessKey: string,
    groupName: string,
    response: any,
    directlyRespondToApiCall: boolean = true,
  ): Promise<void | ResponseObjectDefault> {
    let returnObj: ResponseObjectDefault =
      new ResponseObjectDefaultBuilder().build();
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
          false,
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
          false,
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
          false,
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

  async executeTaskAudits(
    company: string,
    accessId: string,
    accessKey: string,
    response: any,
    directlyRespondToApiCall: boolean = true,
  ): Promise<void | ResponseObjectDefault> {
    let returnObj: ResponseObjectDefault =
      new ResponseObjectDefaultBuilder().build();
    // Create an object to store the progress of the backup jobs.
    const progressTracking = {
      success: [],
      failure: [],
    };
    try {
      // Audit SDTs.
      const auditServiceAuditSDTResponse = (await this.auditService.auditSDTs(
        company,
        accessId,
        accessKey,
        response,
        false,
      )) as ResponseObjectDefault;
      if (auditServiceAuditSDTResponse.status == 'failure') {
        progressTracking.failure.push(
          `SDT: Failed to audit SDTs - ${auditServiceAuditSDTResponse.httpStatus}|${auditServiceAuditSDTResponse.message}`,
        );
      }
      // Audit collector versions.
      const auditServiceAuditCollectorVersionResponse =
        (await this.auditService.auditCollectorVersion(
          company,
          accessId,
          accessKey,
          response,
          false,
        )) as ResponseObjectDefault;
      console.log(auditServiceAuditSDTResponse);
      console.log(auditServiceAuditCollectorVersionResponse);
      // progressTracking.success = [
      //   ...(auditServiceAuditSDTResponse.payload[0]?.success ?? []),
      // ];
      returnObj.payload = [progressTracking];
      if (progressTracking.failure.length > 0) {
        returnObj.status = 'failure';
        returnObj.httpStatus = 400;
        returnObj.message = 'An audit item has failed';
      }
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
}
