import { Controller, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { BackupService } from './backup.service';
import { ResponseObjectDefault } from '../utils/models.service';
import { Get, Query } from '@nestjs/common';

@Controller('tools')
@ApiTags('tools')
export class ToolsController {
  constructor(private readonly backupService: BackupService) {}

  @Get('backup/datasources')
  @ApiTags('tools')
  @ApiResponse({ type: ResponseObjectDefault })
  async backupDatasources(
    @Query('company') company: string,
    @Query('accessId') accessId: string,
    @Query('accessKey') accessKey: string,
    @Query('searchString') searchString: string,
    @Res() response: Response,
  ): Promise<void> {
    await this.backupService.backupDatasources(
      company,
      accessId,
      accessKey,
      searchString,
      response,
    );
  }
}
