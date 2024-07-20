import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsNumber, IsObject, IsString } from 'class-validator';

export class ResponseObjectDefault {
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

export class RequestObjectLMApi {
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

  @IsString()
  queryParams: string;

  @IsObject()
  requestData: Object;

  @IsObject()
  url: Function;

  @IsNumber()
  apiVersion: number;
}

@Injectable()
export class ModelsService {}
