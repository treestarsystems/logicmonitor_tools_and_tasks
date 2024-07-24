import { Body, Controller, Logger, Post, Res, Param } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { BackupService } from './backup.service';
import {
  ResponseObjectDefault,
  ToolsBackupDatasourcesRequestDto,
} from '../utils/utils.models';
import { Get, Query } from '@nestjs/common';

@Controller('tools')
@ApiTags('Tools')
export class ToolsController {
  constructor(private readonly backupService: BackupService) {}

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
    await this.backupService.retrieveDatasources(groupName, response);
  }

  // Source for query DTO: https://tkssharma.com/nestjs-playing-with-query-param-dto/
  @Post('backup/datasources/bygroupname')
  @ApiOperation({
    summary:
      'Backup datasources where the group name contains the searchString',
  })
  @ApiResponse({ type: ResponseObjectDefault })
  async backupDatasourcesPost(
    @Body() body: ToolsBackupDatasourcesRequestDto,
    @Res() response: Response,
  ): Promise<void> {
    await this.backupService.backupDatasources(
      body.company,
      body.accessId,
      body.accessKey,
      body.searchString,
      response,
    );
  }
}
