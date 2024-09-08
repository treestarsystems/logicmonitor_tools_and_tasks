import { Injectable } from '@nestjs/common';
import { BackupServiceDatasources } from '../tools/tools-backup-datasources.service';
import { BackupServiceGeneral } from '../tools/tools-backup-general.service';
import {
  ResponseObjectDefault,
  ResponseObjectDefaultBuilder,
} from '../utils/utils.models';
import { UtilsService } from '../utils/utils.service';
import { AuditsService } from '../audits/audits.service';

/**
 * TasksService class to provide utility functions.
 * @class TasksService
 * @memberof module:tasks
 * @injectable
 * @public
 * @export
 */

@Injectable()
export class TasksService {
  constructor(
    private backupServiceDatasources: BackupServiceDatasources,
    private backupServiceGeneral: BackupServiceGeneral,
    private utilsService: UtilsService,
    private auditService: AuditsService,
  ) {}

  /**
   * Executes backup tasks for datasources, reports, and alert rules.
   * @param {string} company - The company name.
   * @param {string} accessId - The access ID for authentication.
   * @param {string} accessKey - The access key for authentication.
   * @param {string} groupName - The group name for which backups are to be executed.
   * @param {Response} response - The response object to send the result.
   * @param {boolean} [directlyRespondToApiCall=true] - Whether to directly respond to the API call or return the returnObj.
   * @returns {Promise<void | ResponseObjectDefault>} - A promise that resolves to void or a ResponseObjectDefault.
   */

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

  /**
   * Executes audit tasks.
   * @param {string} company - The company name.
   * @param {string} accessId - The access ID for authentication.
   * @param {string} accessKey - The access key for authentication.
   * @param {Response} response - The response object to send the result.
   * @param {boolean} [directlyRespondToApiCall=true] - Whether to directly respond to the API call or return the returnObj.
   * @returns {Promise<void | ResponseObjectDefault>} - A promise that resolves to void or a ResponseObjectDefault.
   */

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
      if (auditServiceAuditCollectorVersionResponse.status == 'failure') {
        progressTracking.failure.push(
          `Collector: Failed to audit Collectors - ${auditServiceAuditCollectorVersionResponse.httpStatus}|${auditServiceAuditCollectorVersionResponse.message}`,
        );
      }

      progressTracking.success = [
        ...(auditServiceAuditSDTResponse.payload.map(
          (item) => `SDT: ${item}`,
        ) ?? []),
        ...(auditServiceAuditCollectorVersionResponse.payload.map(
          (item) => `Collector: ${item}`,
        ) ?? []),
      ];
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
