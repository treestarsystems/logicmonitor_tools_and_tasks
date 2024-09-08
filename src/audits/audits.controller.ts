import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ResponseObjectDefault, GeneralRequest } from '../utils/utils.models';
import { AuditsService } from './audits.service';

/**
 * AuditsController class to handle all audit related API calls.
 * @class AuditsController
 * @endpoint audits
 * @memberof module:audits
 * @public
 */

@Controller('audits')
@ApiTags('Audits')
export class AuditsController {
  constructor(private readonly auditsService: AuditsService) {}

  /**
   * Endpoint to get the agent versions of the collectors in the account.
   * @param {GeneralRequest} body - The request body containing company, accessId, and accessKey.
   * @param {Response} response - The response object to send the result.
   * @returns {Promise<void>} - A promise that resolves to void.
   * @method POST
   */

  @Post('collector/versions')
  @ApiOperation({
    summary: 'Get the agent versions of the collectors in the account.',
  })
  @ApiResponse({ type: ResponseObjectDefault })
  async executeAuditCollectorVersion(
    @Body() body: GeneralRequest,
    @Res() response: Response,
  ): Promise<void> {
    await this.auditsService.auditCollectorVersion(
      body.company,
      body.accessId,
      body.accessKey,
      response,
    );
  }

  /**
   * Endpoint to get SDTs for the account that match the given criteria.
   * @param {GeneralRequest} body - The request body containing company, accessId, and accessKey.
   * @param {Response} response - The response object to send the result.
   * @returns {Promise<void>} - A promise that resolves to void.
   * @method POST
   */

  @Post('sdts')
  @ApiOperation({
    summary: 'Get SDTs for account that match the given criteria.',
  })
  @ApiResponse({ type: ResponseObjectDefault })
  async executeAuditSDT(
    @Body() body: GeneralRequest,
    @Res() response: Response,
  ): Promise<void> {
    await this.auditsService.auditSDTs(
      body.company,
      body.accessId,
      body.accessKey,
      response,
    );
  }
}
