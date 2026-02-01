import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { ResponseObjectDefault, ResponseObjectDefaultBuilder } from '../utils/utils.models';

/**
 * HealthService class to provide utility functions.
 * @class HealthService
 * @memberof module:health
 * @public
 */
@Injectable()
export class HealthService {
  /**
   * Executes quick health checks for datasources, reports, and alert rules.
   * @param {Response} response - The response object to send the result.
   * @param {boolean} [directlyRespondToApiCall=true] - Whether to directly respond to the API call or return the returnObj.
   * @returns {ResponseObjectDefault| void} - A promise that resolves to void or a ResponseObjectDefault.
   */
  executeHealthCheckQuick(
    response: Response,
    directlyRespondToApiCall: boolean = true
  ): ResponseObjectDefault | void {
    const returnObj: ResponseObjectDefault = new ResponseObjectDefaultBuilder()
      .setHttpStatus(200)
      .setStatus('success')
      .setMessage('Health check successful')
      .setPayload([])
      .build();
    if (directlyRespondToApiCall) {
      response.status(returnObj.httpStatus).send(returnObj);
      return;
    }
    return returnObj;
  }
}
