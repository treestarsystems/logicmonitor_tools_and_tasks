import { Injectable } from '@nestjs/common';
// import { Type } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

export class ResponseObject {
  @IsString()
  status: string;

  @IsString()
  message: string;

  @IsArray()
  payload: string;
}

@Injectable()
export class ModelsService {}
