import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import {
  ResponseObjectDefault,
  ToolsBackupGeneralRequest,
} from '../utils/utils.models';

@Controller('audits')
@ApiTags('Audits')
export class AuditsController {
  @Post('collector/versions')
  @ApiOperation({
    summary: 'Get the agent versions of the collectors in the account.',
  })
  @ApiResponse({ type: ResponseObjectDefault })
  async executeAuditCollectorVersion(
    @Body() body: ToolsBackupGeneralRequest,
    @Res() response: Response,
  ): Promise<void> {
    console.log('AuditsController.executeAuditCollectorVersion');
    // await this.backupServiceGeneral.backupGeneralGet(
    //     body.company,
    //     body.accessId,
    //     body.accessKey,
    //     body.extraRequestProperties,
    //     request,
    //     response,
    //   );
  }

  @Post('sdts')
  @ApiOperation({
    summary: 'Get SDTs for account that match the given criteria.',
  })
  @ApiResponse({ type: ResponseObjectDefault })
  async executeAuditSDT(
    @Body() body: ToolsBackupGeneralRequest,
    @Res() response: Response,
  ): Promise<void> {
    console.log('AuditsController.executeAuditSDT');
    // await this.backupServiceGeneral.backupGeneralGet(
    //     body.company,
    //     body.accessId,
    //     body.accessKey,
    //     body.extraRequestProperties,
    //     request,
    //     response,
    //   );
  }
}
