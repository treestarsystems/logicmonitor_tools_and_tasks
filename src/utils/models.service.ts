import { Injectable } from '@nestjs/common';
// import { Type } from 'class-transformer';
import { IsArray, IsDate, IsString } from 'class-validator';

export class DefaultResponseObject {
  @IsString()
  status: string;

  @IsString()
  message: string;

  @IsArray()
  payload: any[];
}

export class LMRequestObject {
  @IsString()
  method: string;

  @IsString()
  accessId: string;

  @IsString()
  accessKey: string;

  @IsDate()
  epoch: string;

  @IsString()
  resourcePath: string;

  requestData: any;
}

@Injectable()
export class ModelsService {}
