import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';

/**
 * This class is used to store the data from API calls.
 * The data is stored in the following format:
 * @status - The status of the API call (success|failure).
 * @httpStatus - The HTTP status code of the API call.
 * @message - The message from the API call.
 * @payload - The payload from the API call.
 */
export class ResponseObjectDefault {
  @IsString()
  @ApiProperty()
  status: string;

  @IsNumber()
  @ApiProperty()
  httpStatus: number;

  @IsString()
  @ApiProperty()
  message: string;

  @IsArray()
  @ApiProperty()
  payload: any[any];
}

/**
 * This class is used to store the data that is needed to make a call to the LogicMonitor API.
 * The data is stored in the following format:
 * @method - The method to use for the API call.
 * @accessId - The access ID for the LogicMonitor account.
 * @accessKey - The access key for the LogicMonitor account.
 * @epoch - The current epoch time.
 * @resourcePath - The path to the resource that the API call is being made to.
 * @queryParams - The query parameters for the API call.
 * @requestData - The data to send in the API call.
 * @url - The URL for the API call.
 * @apiVersion - The version of the API to use.
 *
 */
export class RequestObjectLMApi {
  @IsString()
  method: string;

  @IsString()
  accessId: string;

  @IsString()
  accessKey: string;

  @IsNumber()
  epoch: number;

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
/**
 * This class is used to store the data from LogicMonitor API calls.
 * The data is stored in 3 different formats:
 * @type - type of data being backed up (dataSource|report|alertRule).
 * @dataXML - The XML data from the API call.
 * @dataJSON - The JSON data from the API call.
 */
export class StoreObjectLMData {
  @IsString()
  type: string;

  @IsString()
  dataXML: string;

  @IsObject()
  dataJSON: object;
}
@Injectable()
export class ModelsService {}
