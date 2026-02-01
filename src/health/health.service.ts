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
   * Builds and returns (or sends) a static success response for a basic health check endpoint.
   * @param {Response} response - The response object used to send the result when responding directly.
   * @param {boolean} [directlyRespondToApiCall=true] - Whether to directly respond to the API call or return the response object.
   * @returns {ResponseObjectDefault| void} - Returns either void or a ResponseObjectDefault, depending on the directlyRespondToApiCall flag.
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
