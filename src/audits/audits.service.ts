import { Injectable } from '@nestjs/common';
import { UtilsService } from '../utils/utils.service';
import {
  ResponseObjectDefault,
  RequestObjectLMApi,
  RequestObjectLMApiBuilder,
  ResponseObjectDefaultBuilder,
} from '../utils/utils.models';

/**
 * BackupServiceGeneral class to handle all general backup related API calls.
 * @class BackupServiceGeneral
 * @memberof module:audits
 * @implements {AuditsService}
 * @injectable
 * @api
 *
 */ @Injectable()
export class AuditsService {
  constructor(private utilsService: UtilsService) {}

  private async auditGetCollectorVersionList(
    company: string,
    accessId: string,
    accessKey: string,
  ): Promise<ResponseObjectDefault> {
    const returnObj: ResponseObjectDefault =
      new ResponseObjectDefaultBuilder().build();
    try {
      const collectorVersionListGetObj: RequestObjectLMApi =
        new RequestObjectLMApiBuilder()
          .setMethod('GET')
          .setAccessId(accessId)
          .setAccessKey(accessKey)
          .setUrl(company, '/setting/collector/collectors/versions')
          .build();

      const collectorList: ResponseObjectDefault =
        await this.utilsService.genericAPICall(collectorVersionListGetObj);
      returnObj.httpStatus = collectorList.httpStatus;
      if (collectorList.status == 'failure') {
        const errMsg = this.utilsService.defaultErrorHandlerString(
          collectorList.message,
        );
        throw new Error(errMsg);
      }
      returnObj.payload = [...(JSON.parse(collectorList.payload).items ?? [])];
      return returnObj;
    } catch (err) {
      return this.utilsService.defaultErrorHandlerHttp(err);
    }
  }

  private async auditGetCollectorList(
    company: string,
    accessId: string,
    accessKey: string,
  ): Promise<ResponseObjectDefault> {
    const returnObj: ResponseObjectDefault =
      new ResponseObjectDefaultBuilder().build();
    try {
      const collectorListGetObj: RequestObjectLMApi =
        new RequestObjectLMApiBuilder()
          .setMethod('GET')
          .setAccessId(accessId)
          .setAccessKey(accessKey)
          .setUrl(company, '/setting/collector/collectors')
          .build();

      const collectorList: ResponseObjectDefault =
        await this.utilsService.genericAPICall(collectorListGetObj);
      returnObj.httpStatus = collectorList.httpStatus;
      if (collectorList.status == 'failure') {
        const errMsg = this.utilsService.defaultErrorHandlerString(
          collectorList.message,
        );
        throw new Error(errMsg);
      }
      returnObj.payload = [...(JSON.parse(collectorList.payload).items ?? [])];
      return returnObj;
    } catch (err) {
      return this.utilsService.defaultErrorHandlerHttp(err);
    }
  }

  private processCollectorItem(
    collectorItem: any,
    collectorVersionList: any[any],
    returnObj: ResponseObjectDefault,
  ): void {
    const updatedVersionAvailable = [];
    const collectorBuildMajor = collectorItem?.build.slice(0, 2);
    const collectorBuildMinor = collectorItem?.build.slice(2);
    const collectorBuildNumber = parseFloat(
      `${collectorBuildMajor}.${collectorBuildMinor}`,
    );

    for (const collectorVersionItem of collectorVersionList.payload) {
      const collectorVersionNumber = parseFloat(
        `${collectorVersionItem.majorVersion}.${collectorVersionItem.minorVersion}`,
      );
      if (
        collectorVersionItem.stable === true &&
        collectorVersionNumber > collectorBuildNumber
      ) {
        updatedVersionAvailable.push(collectorVersionNumber);
      }
    }

    returnObj.payload.push(
      `${collectorItem?.hostname} (${collectorItem?.id}) Build: ${collectorBuildNumber} (Available Stable Updates: ${updatedVersionAvailable.reverse().join(',')} <--latest)`,
    );
  }

  private processCollectors(
    collectorList: any[any],
    collectorVersionList: any[any],
    returnObj: ResponseObjectDefault,
  ): void {
    for (const collectorItem of collectorList.payload) {
      this.processCollectorItem(collectorItem, collectorVersionList, returnObj);
    }
  }

  public async auditSDTs(
    company: string,
    accessId: string,
    accessKey: string,
    response: any,
    directlyRespondToApiCall: boolean = true,
  ): Promise<void | ResponseObjectDefault> {
    const returnObj: ResponseObjectDefault =
      new ResponseObjectDefaultBuilder().build();
    try {
      const sdtGetObj: RequestObjectLMApi = new RequestObjectLMApiBuilder()
        .setMethod('GET')
        .setAccessId(accessId)
        .setAccessKey(accessKey)
        .setUrl(company, '/sdt/sdtss')
        .build();

      const sdtList: ResponseObjectDefault =
        await this.utilsService.genericAPICall(sdtGetObj);
      returnObj.httpStatus = sdtList.httpStatus;
      if (sdtList.status == 'failure') {
        const errMsg = this.utilsService.defaultErrorHandlerString(
          sdtList.message,
        );
        throw new Error(errMsg);
      }
      const sdtItems = JSON.parse(sdtList.payload).items ?? [];
      for (const sdtItem of sdtItems) {
        if (!sdtItem?.comment) {
          const sdtCommentAuditMsg = `The SDT for ${sdtItem?.deviceDisplayName || sdtItem?.deviceId} has a blank SDT comment: ${sdtItem?.comment}`;
          returnObj.payload.push(sdtCommentAuditMsg);
        }
        if (sdtItem?.endDateTime < Date.now()) {
          const sdtExpireAuditMsg = `The SDT for ${sdtItem?.deviceDisplayName || sdtItem?.deviceId} has a expired but is still present.`;
          returnObj.payload.push(sdtExpireAuditMsg);
        }
      }
      if (returnObj.payload.length !== 0) {
        returnObj.message = 'There are SDTs that violate the audit criteria';
      }
      returnObj.message = 'No SDTs violate the audit criteria.';
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

  public async auditCollectorVersion(
    company: string,
    accessId: string,
    accessKey: string,
    response: any,
    directlyRespondToApiCall: boolean = true,
  ): Promise<void | ResponseObjectDefault> {
    const returnObj: ResponseObjectDefault =
      new ResponseObjectDefaultBuilder().build();
    try {
      const collectorVersionList: ResponseObjectDefault =
        await this.auditGetCollectorVersionList(company, accessId, accessKey);
      const collectorList: ResponseObjectDefault =
        await this.auditGetCollectorList(company, accessId, accessKey);
      // Process the collector and collector version list. This will add the audit data to the returnObj directly.
      this.processCollectors(collectorList, collectorVersionList, returnObj);
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
