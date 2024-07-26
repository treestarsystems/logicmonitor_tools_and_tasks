import { Body, Controller, Post, Res, Req } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { BackupServiceDatasources } from './tools-backup-datasources.service';
import { BackupServiceGeneral } from './tools-backup-general.service';
import {
  ResponseObjectDefault,
  ToolsBackupDatasourcesRequest,
  ToolsBackupGeneralRequest,
} from '../utils/utils.models';
import { Get, Query } from '@nestjs/common';

@Controller('tools')
@ApiTags('Tools')
export class ToolsController {
  constructor(
    private readonly backupServiceDatasources: BackupServiceDatasources,
    private readonly backupServiceGeneral: BackupServiceGeneral,
  ) {}

  @Get('backup/datasources')
  @ApiOperation({
    summary:
      'Retrieve all datasources where the group name contains the searchString as a .zip containing XML and JSON files.',
  })
  @ApiResponse({ type: ResponseObjectDefault })
  async retrieveDatasources(
    @Query('groupName') groupName: string,
    @Res() response: Response,
  ): Promise<void> {
    await this.backupServiceDatasources.retrieveDatasources(
      groupName,
      response,
    );
  }

  // @Get('backup/alertrules')
  // @ApiOperation({
  //   summary:
  //     'Retrieve all datasources where the group name contains the searchString as a .zip containing XML and JSON files.',
  // })
  // @ApiResponse({ type: ResponseObjectDefault })
  // async retrieveBackupsGeneral(
  //   @Query('groupName') groupName: string,
  //   @Res() response: Response,
  // ): Promise<void> {
  //   await this.backupService.retrieveDatasources(groupName, response);
  // }

  @Post('backup/datasources/bygroupname')
  @ApiOperation({
    summary:
      'Backup datasources where the group name contains the searchString',
  })
  @ApiResponse({ type: ResponseObjectDefault })
  async backupDatasourcesPost(
    @Body() body: ToolsBackupDatasourcesRequest,
    @Res() response: Response,
  ): Promise<void> {
    await this.backupServiceDatasources.backupDatasources(
      body.company,
      body.accessId,
      body.accessKey,
      body.searchString,
      response,
    );
  }

  @Post('backup/alertrules')
  @ApiOperation({
    summary: 'Backup alert rules',
  })
  @ApiResponse({ type: ResponseObjectDefault })
  async backupGeneralGet(
    @Body() body: ToolsBackupGeneralRequest,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    await this.backupServiceGeneral.backupGeneralGet(
      body.company,
      body.accessId,
      body.accessKey,
      body.extraRequestProperties,
      request,
      response,
    );
  }
}
