import { Controller, Res, Req } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { BackupService } from './backup.service';
import { ResponseObjectDefault } from '../utils/models.service';
import { Get, Query } from '@nestjs/common';

@Controller('tools')
@ApiTags('Tools')
export class ToolsController {
  constructor(private readonly backupService: BackupService) {}

  @Get('backup/datasources')
  @ApiResponse({ type: ResponseObjectDefault })
  async backupDatasources(
    @Query('company') company: string,
    @Query('accessId') accessId: string,
    @Query('accessKey') accessKey: string,
    @Query('searchString') searchString: string,
    // @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    await this.backupService.backupDatasources(
      company,
      accessId,
      accessKey,
      searchString,
      // request,
      response,
    );
  }
}
