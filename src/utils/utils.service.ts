import { Injectable } from '@nestjs/common';
// import { catchError, firstValueFrom } from 'rxjs';
import { DefaultResponseObject, LMRequestObject } from './models.service';
import e from 'express';
// import { scrypt } from 'crypto';
import * as crypto from 'crypto';
import { Axios, AxiosRequestConfig, AxiosResponse } from 'axios';
@Injectable()
export class UtilsService {
  /**
   * Generate a random alphanumeric string
   * @param stringLength The length of the string to generate
   * @returns A random alphanumeric string
   * @example
   * genRandomString(10)
   * // returns 'aBcDeFgHiJ'
   */
  genRegular(stringLength: number): string {
    const regularchar: string =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text: string = '';
    for (let i = 0; i < stringLength; i++) {
      text += regularchar.charAt(
        Math.floor(Math.random() * regularchar.length),
      );
    }
    return text;
  }

  /**
   * Generate a random alphanumeric string with special characters
   * @param stringLength The length of the string to generate
   * @returns A random alphanumeric string with special characters
   * @example
   * genSpecial(10)
   * // returns 'aBcDeFgHiJ!@#$%'
   */
  genSpecial(stringLength: number): string {
    const specialchar: string =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%_-(),;:.*';
    let text: string = '';
    for (let i = 0; i < stringLength; i++) {
      text += specialchar.charAt(
        Math.floor(Math.random() * specialchar.length),
      );
    }
    return text;
  }

  /**
   * Generate a random alphanumeric string with only special characters
   * @param stringLength The length of the string to generate
   * @returns A random alphanumeric string with only special characters
   * @example
   * genSpecialOnly(10)
   * // returns '!@#$%_-(),'
   */
  genSpecialOnly(stringLength: number): string {
    const specialchar: string = '!@#$%_-(),;:.*';
    let text: string = '';
    for (let i = 0; i < stringLength; i++) {
      text += specialchar.charAt(
        Math.floor(Math.random() * specialchar.length),
      );
    }
    return text;
  }

  /**
   * Generate a random number within defined range
   * @param min The minimum number
   * @param max The maximum number
   * @returns A random number within the defined range
   * @example
   * getRandomInt(1, 10)
   * // returns 5
   */
  getRandomInt(min: number, max: number): number {
    return Math.round(Math.random() * (max - min) + min);
  }

  /**
   * Generate a random string with random capitalization
   * @param word
   * @returns
   * @example
   * randomCaps('hello')
   * // returns 'heLlo'
   */
  randomCaps(word: string): string {
    const position = this.getRandomInt(0, word.length);
    return `${this.replaceAt(word, position, word.charAt(position).toUpperCase())}`;
  }

  /**
   * Generate a random string with special characters
   * @param word
   * @returns
   * @example
   * insertSpecialChars('hello')
   * // returns 'hel!lo'
   */
  insertSpecialChars(word: string): string {
    const specialchar = '!@#$%_-(),;:.*';
    let index = this.getRandomInt(1, word.length);
    let text = specialchar.charAt(
      Math.floor(Math.random() * specialchar.length),
    );
    return word.substring(0, index) + text + word.substring(index);
  }
  /**
   * Replace a character at a specific index in a string
   * Source: https://gist.github.com/efenacigiray/9367920
   * @param originalString
   * @param replacementIndex
   * @param replacementString
   * @returns
   */
  replaceAt(
    originalString: string,
    replacementIndex: number,
    replacementString: string,
  ): string {
    return `${originalString.substring(0, replacementIndex)}${replacementString}${originalString.substring(replacementIndex + 1)}`;
  }

  /**
   * Generate a random UUID
   * Source: https://stackoverflow.com/a/2117523
   * @returns A random UUID
   * @example
   * uuidv4()
   * // returns 'a0a0a0a0-a0a0-a0a0-a0a0-a0a0a0a0a0a0'
   */
  uuidv4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Validate a JSON object
   * Source: https://learnersbucket.com/examples/javascript/how-to-validate-json-in-javascript/
   * @param obj The object to validate
   * @returns A boolean indicating if the object is valid JSON
   * @example
   * validateJSON({ "name": "John", "age": 30, "city": "New York" })
   * // returns true
   */
  validateJSON(obj: Object): boolean {
    let o = JSON.stringify(obj);
    try {
      JSON.parse(o);
    } catch (e) {
      return false;
    }
    return true;
  }

  /**
   * Error handler for API calls
   * @param error The error object or string
   * @returns An object with status, message, and payload properties
   * @example
   * defaultErrorHandler('Error: Something went wrong')
   * // returns { status: 'failure', message: 'Function: defaultErrorHandler - Error: Error: Something went wrong', payload: [] }
   */
  defaultErrorHandler(error: Error): DefaultResponseObject {
    let returnObj: DefaultResponseObject = {
      status: '',
      message: '',
      payload: [],
    };
    //This is done just incase you use the "throw" keyword to produce your own error.
    let errorMessage = error?.message ? error?.message : error;
    returnObj.status = 'failure';
    returnObj.message = `Function: ${arguments.callee.caller.name} - Error: ${errorMessage}`;
    returnObj.payload = [];
    return returnObj;
  }

  /**
   * Generate an authentication string for LogicMonitor API calls
   * @param requestObject An object containing the method, epoch, requestData, resourcePath, accessId, and accessKey
   * @returns An authentication string
   * @example
   * generateAuthString({
   *  method: 'get',
   * epoch: '1234567890',
   * requestData: { name: 'John', age: 30, city: 'New York' },
   * resourcePath: '/api/v1/endpoint',
   * accessId: '
   * accessKey:
   * })
   * // returns 'LMv1 accessId:signature:epoch'
   */
  generateAuthString(requestObjectLMApi: LMRequestObject): string {
    try {
      const { method, epoch, resourcePath, accessId, accessKey, requestData } =
        requestObjectLMApi;
      const requestVars: string = `${method}${epoch}${JSON.stringify(requestData)}${resourcePath}`;
      const hex: string = crypto
        .createHmac('sha256', accessKey)
        .update(requestVars)
        .digest('hex');
      const signature: string = Buffer.from(hex, 'utf-8').toString('base64');
      return `LMv1 ${accessId}:${signature}:${epoch}`;
    } catch (err) {
      return err;
    }
  }
  // //Takes an object that containts http method, http data, resource path, accessId, signature
  /**
   * Make a generic API call to LogicMonitor
   * @param requestObjectLMApi An object containing the method, requestData, queryParams, apiVersion, and url
   * @returns An object with status, message, and payload properties
   * @example
   * genericAPICall({
   * method: 'get',
   * requestData: { name: 'John', age: 30, city: 'New York' },
   * queryParams: 'size=1000',
   * apiVersion: 1, v3 is the default
   * url: 'https://companynme.logicmonitor.com/santaba/rest/report/reports'
   * })
   * // returns { status: 'success', message: 'success', payload: [{ name: 'John', age: 30, city: 'New York' }] }
   */
  async genericAPICall(
    requestObjectLMApi: LMRequestObject,
  ): Promise<DefaultResponseObject> {
    let returnObj: DefaultResponseObject = {
      status: '',
      message: '',
      payload: [],
    };
    const { method, requestData, queryParams, apiVersion } = requestObjectLMApi;
    let { url } = requestObjectLMApi;
    let urlString: string = `${url()}?size=1000&`;
    if (queryParams) {
      urlString += `?${queryParams}`;
    }
    let methodRegEx = /^get$|^delete$/gi;
    if (methodRegEx.test(method)) {
      delete requestObjectLMApi.requestData;
    }

    try {
      let authString: string = this.generateAuthString(requestObjectLMApi);
      if (authString.toLowerCase().includes('lmv1')) {
        throw 'Error: Invalid authString';
      }
      let axiosParametersObj: AxiosRequestConfig = {
        method: method,
        url: urlString,
        data: requestData ? requestData : '',
        headers: {
          ContentType: 'application/json',
          Authorization: authString,
        },
      };
      if (apiVersion) {
        axiosParametersObj.headers['X-Version'] = apiVersion;
      }
      const apiRequest = new Axios(axiosParametersObj);
      const apiResponse: AxiosResponse =
        await apiRequest.request(axiosParametersObj);
      const { data, headers } = apiResponse;
      let rateLimitRemaining = headers['x-rate-limit-remaining'];
      let rateLimitWindow = headers['x-rate-limit-window'] * 1000 + 1;
      let whileVar = false;
      if (rateLimitRemaining == 0) {
        whileVar = true;
        while (whileVar) {
          setTimeout(async () => {
            //If rate limit reached we need to wait.
            const apiResponse: AxiosResponse =
              await apiRequest.request(axiosParametersObj);
            const { data } = apiResponse;
            returnObj.status = 'success';
            returnObj.message = 'success';
            returnObj.payload = [data];
          }, rateLimitWindow);
          return returnObj;
        }
      } else {
        returnObj.status = 'success';
        returnObj.message = 'success';
        returnObj.payload = [data];
        return returnObj;
      }
      return returnObj;
    } catch (err) {
      return this.defaultErrorHandler(err);
    }
  }
}
