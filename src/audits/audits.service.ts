import { Injectable } from '@nestjs/common';
import { UtilsService } from '../utils/utils.service';
import {
  ResponseObjectDefault,
  RequestObjectLMApi,
  RequestObjectLMApiBuilder,
  ResponseObjectDefaultBuilder,
  RequestObjectLMApiExtraRequestProperties,
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

  async auditSDTs(
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
        .setUrl(company, '/sdt/sdts')
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
      console.log('sdtList:', sdtList);
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
      return this.utilsService.defaultErrorHandlerHttp(err);
    }
  }
}
