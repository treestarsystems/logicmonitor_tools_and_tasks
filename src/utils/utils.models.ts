import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { AxiosRequestConfig } from 'axios';

/**
 * This is a base class used to store request data for LogicMonitor API calls.
 * @class {class}
 * @accessId {string} The access ID for the LogicMonitor account.
 * @accessKey The access key for the LogicMonitor account.
 */

export class BaseRequestObjectLM {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'The access ID for the LogicMonitor account. This is used to authenticate the API call',
    type: 'string',
  })
  accessId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'The access key for the LogicMonitor account. This is used to authenticate the API call',
    type: 'string',
  })
  accessKey: string;
}

/**
 * This class is used to repsond with data from the underlying API calls in a default format.
 * The data is stored in the following format:
 * @status The status of the API call (success|failure).
 * @httpStatus The HTTP status code of the API call.
 * @message The message from the API call.
 * @payload The payload from the API call.
 */

export class ResponseObjectDefault {
  @IsString()
  @ApiProperty({
    description: 'The custom status of the API call',
    enum: ['success|failure'],
  })
  status: string;

  @IsNumber()
  @ApiProperty({
    description: 'HTTP status code provided by the API call',
    enum: [200, 400, 401, 403, 404, 500],
  })
  httpStatus: number;

  @IsString()
  @ApiProperty({
    description:
      'The message from the API call. This can be a success or error message',
    type: 'string',
  })
  message: string;

  @IsArray()
  @ApiProperty({
    description:
      'The payload from the API call. This can be an array of any type',
    type: [],
    enum: ['any (string|number|object|array|boolean|error object)'],
  })
  payload: any[any];
}

/**
 * This class is used to store the data that is needed to make a call to the LogicMonitor API. This is only accessible via the backend.
 * The data is stored in the following format:
 * @method The method to use for the API call.
 * @accessId The access ID for the LogicMonitor account.
 * @accessKey The access key for the LogicMonitor account.
 * @epoch The current epoch time.
 * @resourcePath The path to the resource that the API call is being made to.
 * @queryParams The query parameters for the API call.
 * @requestData The data to send in the API call.
 * @url The URL for the API call.
 * @apiVersion The version of the API to use.
 */

export class RequestObjectLMApi extends BaseRequestObjectLM {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'The method to use for the API call. This can be GET, POST, PUT, DELETE',
    type: 'string',
  })
  method: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'The current epoch time. This is used to authenticate the API call',
    type: 'string',
  })
  epoch: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'The path to the resource that the underlying API call is being made to.',
    type: 'string',
  })
  resourcePath: string;

  @IsString()
  @ApiProperty({
    description:
      'The query parameters for the API call. This is used to filter the data being returned in some cases.',
    type: 'string',
  })
  queryParams: string;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'The data to send in the API call. This is used to create or update data in LogicMonitor.',
    type: 'string',
  })
  requestData: Object;

  // @IsObject()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The URL for the API call.',
    type: 'string',
  })
  // url: Function;
  url: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'The version of the API to use. This should be 3, which is the current version of the LogicMonitor API.',
    type: 'string',
  })
  apiVersion: number;
}

/**
 * This class is used to store request data for LogicMonitor API calls.
 * @company The company name for the LogicMonitor account.
 * @accessId The access ID for the LogicMonitor account.
 * @accessKey The access key for the LogicMonitor account.
 * @groupName The search string to filter the datasources by group name.
 */

export class ToolsBackupDatasourcesRequest extends BaseRequestObjectLM {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The company name for the LogicMonitor account.',
    type: 'string',
  })
  company: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The search string to filter the datasources by group name.',
    type: 'string',
  })
  groupName: string;
}

/**
 * Extra request properties to send in the API call (resourcePath, queryParams, requestData).
 * @resourcePath The path to the resource that the underlying API call is being made to.
 * @queryParams The query parameters for the API call. This is used to filter the data being returned in some cases.
 * @requestData The data to send in the API call. This is used to create or update data in LogicMonitor.
 */

export class RequestObjectLMApiExtraRequestProperties {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'The path to the resource that the underlying API call is being made to.',
    type: 'string',
  })
  resourcePath: string;

  @Optional()
  @IsString()
  @ApiProperty({
    description:
      'The query parameters for the API call. This is used to filter the data being returned in some cases.',
    type: 'string',
    required: false,
  })
  queryParams: string;

  @Optional()
  @IsObject()
  @ApiProperty({
    description:
      'The data to send in the API call. This is used to create or update data in LogicMonitor.',
    type: 'string',
    required: false,
  })
  requestData: Object;
}

/**
 * This class is used to store request data for LogicMonitor API calls.
 * @company The company name for the LogicMonitor account.
 * @accessId The access ID for the LogicMonitor account.
 * @accessKey The access key for the LogicMonitor account.
 * @extraRequestProperties The extra request properties to send in the API call (resourcePath, queryParams, requestData).
 */

export class ToolsBackupGeneralRequest extends BaseRequestObjectLM {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The company name for the LogicMonitor account.',
    type: 'string',
  })
  company: string;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The extra request properties to send in the API call',
    type: RequestObjectLMApiExtraRequestProperties,
  })
  extraRequestProperties: RequestObjectLMApiExtraRequestProperties;
}

/**
 * Job cron data for the scheduleListCronJobs API call.
 * @jobName The name of the job.
 * @nextRun The next run time of the job in EST.
 * @lastRun The last run time of the job in EST.
 * @futureRun The future run times of the job in EST.
 */
export class ScheduleListCronJobsResponse {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Job name',
    type: 'string',
  })
  jobName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The next run time of the job in EST',
    type: 'string',
  })
  nextRun: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The last run time of the job in EST',
    type: 'string',
  })
  lastRun: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The future run times of the job in EST',
    type: 'enum',
  })
  futureRun: string[];
}

/**
 * This class generates the request object for the LogicMonitor API.
 * @method The method to use for the API call.
 * @accessId The access ID for the LogicMonitor account.
 * @accessKey The access key for the LogicMonitor account.
 * @company The company name for the LogicMonitor account.
 * @resourcePath The path to the resource that the API call is being made to.
 * @queryParams The query parameters for the API call.
 * @requestData The data to send in the API call.
 * @returns A properly formatted request object for the LogicMonitor API call.
 */
export class RequestObjectLMApiGenerator {
  constructor(
    private method: string,
    private accessId: string,
    private accessKey: string,
    private company: string,
    private resourcePath: string,
    private queryParams: string,
    private requestData: Object,
  ) {}

  public Create(): RequestObjectLMApi {
    return {
      method: this.method,
      accessId: this.accessId,
      accessKey: this.accessKey,
      epoch: new Date().getTime(),
      resourcePath: this.resourcePath ?? '/',
      queryParams: this.queryParams ?? '',
      url: `https://${this.company}.logicmonitor.com/santaba/rest${this.resourcePath}`,
      requestData: this.requestData ?? {},
      apiVersion: 3,
    };
  }
}

/**
 * Interface representing a request object for LogicMonitor API.
 *
 * @interface RequestObjectLMApiInterface
 * @property {string} method - The HTTP method (e.g., 'GET', 'POST').
 * @property {string} accessId - The access ID for authentication.
 * @property {string} accessKey - The access key for authentication.
 * @property {number} epoch - The epoch timestamp for the request.
 * @property {string} [queryParams] - The optional query parameters for the API request.
 * @property {any} url - The URL for the API request.
 * @property {Record<string, any>} [requestData] - The optional data to send with the request.
 * @property {number} apiVersion - The version of the API being used.
 *
 * @example
 * const requestObject: RequestObjectLMApiInterface = {
 *   method: 'GET',
 *   accessId: 'your-access-id',
 *   accessKey: 'your-access-key',
 *   epoch: 1627384956,
 *   queryParams: 'param1=value1&param2=value2',
 *   url: 'https://api.logicmonitor.com/some-endpoint',
 *   requestData: { key: 'value' },
 *   apiVersion: 2
 * };
 */

interface RequestObjectLMApiInterface {
  method: string;
  accessId: string;
  accessKey: string;
  epoch: number;
  queryParams?: string;
  url: any;
  requestData?: Record<string, any>;
  apiVersion: number;
}
export class RequestObjectLMApiBuilder {
  private requestObj: RequestObjectLMApiInterface;
  constructor() {
    this.requestObj = {
      method: '',
      accessId: '',
      accessKey: '',
      epoch: new Date().getTime(),
      queryParams: '',
      url: '',
      requestData: {},
      apiVersion: 3,
    };
  }

  setMethod(method: string): RequestObjectLMApiBuilder {
    this.requestObj.method = method;
    return this;
  }

  setAccessId(accessId: string): RequestObjectLMApiBuilder {
    this.requestObj.accessId = accessId;
    return this;
  }

  setAccessKey(accessKey: string): RequestObjectLMApiBuilder {
    this.requestObj.accessKey = accessKey;
    return this;
  }

  setQueryParams(queryParams: string): RequestObjectLMApiBuilder {
    this.requestObj.queryParams = queryParams;
    return this;
  }

  setUrl(company: string, resourcePath: string): RequestObjectLMApiBuilder {
    this.requestObj.url = `https://${company}.logicmonitor.com/santaba/rest${resourcePath}`;
    return this;
  }

  setRequestData(requestData: Record<string, any>): RequestObjectLMApiBuilder {
    this.requestObj.requestData = requestData;
    return this;
  }

  build(): RequestObjectLMApiInterface {
    return this.requestObj;
  }
}

/**
 * This class generates the response object for the LogicMonitor API.
 * @status The status of the API call (success|failure).
 * @httpStatus The HTTP status code of the API call.
 * @message The message from the API call.
 * @payload The payload from the API call.
 * @returns A properly formatted response object for the LogicMonitor API call.
 */

export class ResponseObjectDefaultGenerator {
  constructor(
    public status: string = 'success',
    public httpStatus: number = 200,
    public message: string = 'success',
    public payload: any[any] = [],
  ) {}

  public Create(): ResponseObjectDefault {
    return {
      status: this.status,
      httpStatus: this.httpStatus,
      message: this.message,
      payload: [],
    };
  }
}

/**
 * Configuration object for Axios requests.
 * @interface AxiosRequestConf
 * @property {string} method - The HTTP method to use for the request (e.g., 'GET', 'POST').
 * @property {string} url - The URL to send the request to.
 * @property {any} [data] - The optional data to send with the request (for POST, PUT, PATCH methods).
 * @property {Record<string, string | number>} headers - The headers to include in the request.
 */

interface AxiosParametersInterface {
  method: string;
  url: string;
  requestData?: Record<string, string | number>;
  headers?: Record<string, string | number>;
}

/**
 * This class builds the request object for the LogicMonitor API.
 * @returns A properly formatted request object for the Axios call to interact with the LogicMonitor API.
 */
export class AxiosParametersBuilder {
  private axiosRequestConfig: AxiosParametersInterface;

  constructor() {
    this.axiosRequestConfig = {
      url: '',
      method: '',
      headers: {
        Authorization: '',
        'Content-Type': 'application/json',
        'X-Version': 3,
      },
    };
  }

  setMethod(method: string): AxiosParametersBuilder {
    this.axiosRequestConfig.method = method;
    return this;
  }

  setUrl(url: string): AxiosParametersBuilder {
    this.axiosRequestConfig.url = url;
    return this;
  }

  setAuthString(authString: string): AxiosParametersBuilder {
    this.axiosRequestConfig.headers['Authorization'] = authString;
    return this;
  }

  setData(requestData: any): AxiosParametersBuilder {
    this.axiosRequestConfig.requestData = requestData ?? '';
    return this;
  }

  build(): AxiosParametersInterface {
    return this.axiosRequestConfig;
  }
}
