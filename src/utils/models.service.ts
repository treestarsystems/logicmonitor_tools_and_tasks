import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsObject, IsString } from 'class-validator';

export class DefaultResponseObject {
  @IsString()
  @ApiProperty()
  status: string;

  @IsString()
  @ApiProperty()
  message: string;

  @IsArray()
  @ApiProperty()
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

  @IsObject()
  requestData: Object;

  @IsObject()
  url: Function;
}

@Injectable()
export class ModelsService {}
