import { Injectable } from '@nestjs/common';
import { ResponseObjectDefault, RequestObjectLMApi } from './utils.models';
import * as crypto from 'crypto';
import { Axios, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * UtilsService class to provide utility functions.
 * @class UtilsService
 * @memberof module:utils
 * @access public
 * @public
 */
@Injectable()
export class UtilsService {
  /**
   * Generate a random alphanumeric string
   * @param {number} stringLength The length of the string to generate
   * @returns {string} A random alphanumeric string
   * @example
   * genRandomString(10) // returns 'aBcDeFgHiJ'
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
   * @param {number} stringLength The length of the string to generate
   * @returns {string} A random alphanumeric string with special characters
   * @example
   * genSpecial(10) // returns 'aBcDeFgHiJ!@#$%'
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
   * Generate a random string with only special characters
   * @param {number} stringLength The length of the string to generate
   * @returns {string} A random string with only special characters
   * @example
   * genSpecialOnly(10) // returns '!@#$%_-(),'
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
   * Generate a random number within the defined range
   * @param {number} min The minimum number
   * @param {number} max The maximum number
   * @returns {number} A random number within the defined range
   * @example
   * getRandomInt(1, 10) // returns 5
   */

  getRandomInt(min: number, max: number): number {
    return Math.round(Math.random() * (max - min) + min);
  }

  /**
   * Capitalizes the first letter of a given string.
   * @param {string} str The string to capitalize.
   * @returns {string} The string with the first letter capitalized.
   */

  capitalizeFirstLetter(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Generate a random string with random capitalization
   * @param {string} word The word to randomly capitalize
   * @returns {string} A random string with random capitalization
   * @example
   * randomCaps('hello') // returns 'heLlo'
   */

  randomCaps(word: string): string {
    const position: number = this.getRandomInt(0, word.length);
    return `${this.replaceAt(word, position, word.charAt(position).toUpperCase())}`;
  }

  /**
   * Generate a string with special characters inserted at random positions
   * @param {string} word The word to insert special characters into
   * @returns {string} A random string with special characters inserted
   * @example
   * insertSpecialChars('hello') // returns 'hel!lo'
   */

  insertSpecialChars(word: string): string {
    const specialchar: string = '!@#$%_-(),;:.*';
    let index: number = this.getRandomInt(1, word.length);
    let text: string = specialchar.charAt(
      Math.floor(Math.random() * specialchar.length),
    );
    return word.substring(0, index) + text + word.substring(index);
  }

  /**
   * Replace a character at a specific index in a string
   * Source: https://gist.github.com/efenacigiray/9367920
   * @param {string} originalString
   * @param {number} replacementIndex
   * @param {string} replacementString
   * @returns {string} The string with the character replaced
   */

  replaceAt(
    originalString: string,
    replacementIndex: number,
    replacementString: string,
  ): string {
    return `${originalString.substring(0, replacementIndex)}${replacementString}${originalString.substring(replacementIndex + 1)}`;
  }

  /**
   * Generate a random UUIDv4 string
   * Source: https://stackoverflow.com/a/2117523
   * @returns {string} A random UUIDv4 string
   * @example
   * uuidv4() // returns 'bee5063a-4711-45eb-8a44-d84cc4925b8b'
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
   * @param {Object} obj The object to validate
   * @returns {boolean} A boolean indicating if the object is valid JSON
   * @example
   * validateJSON({ "name": "John", "age": 30, "city": "New York" }) // returns true
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
   * Encodes the query parameters of a given URL.
   *
   * This function takes a URL with query parameters and returns a new URL
   * where the query parameters have been percent-encoded. This is particularly
   * useful for ensuring that special characters in query parameters are properly
   * encoded to conform to URL standards.
   *
   * @param {string} url - The original URL with query parameters to encode.
   * @returns {string} The URL with encoded query parameters.
   * @example
   * encodeQueryParameters('www.foobar.com/?first=1&second=12&third=5') // returns 'www.foobar.com/?first=1&amp;second=12&amp;third=5'
   */

  encodeQueryParameters(url: string): string {
    // Split the URL into the base URL and query parameters
    const [baseUrl, queryParamsString] = url.split('?');

    // Check if there are query parameters to encode
    if (!queryParamsString) {
      return url; // Return the original URL if there are no query parameters
    }

    // Split the query parameters string into individual parameters
    const queryParams = queryParamsString.split('&');

    // Encode each query parameter
    const encodedQueryParams = queryParams
      .map((param) => {
        // Split each parameter into key and value
        const [key, value] = param.split('=');
        // Return the encoded key-value pair, joined by '='
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .join('&'); // Join all encoded parameters back into a single string

    // Reconstruct and return the URL with encoded query parameters
    return `${baseUrl}?${encodedQueryParams}`;
  }

  /**
   * Error handler for API calls
   * @param {any} error The error string or object
   * @returns {string} An object with status, message, and payload properties
   * @example
   * defaultErrorHandlerString('Error: Something went wrong') // returns 'Error: Error: Something went wrong'
   */

  defaultErrorHandlerString(err): string {
    return err?.message ? err.message : err;
  }

  /**
   * Error handler for API calls
   * @param {any} error The error string or object
   * @param {number} httpStatusCode The HTTP status code
   * @returns {ResponseObjectDefault} An object with status, message, and payload properties
   * @example
   * defaultErrorHandler('Error: Something went wrong') // returns { status: 'failure', httpStatusCode: 400, message: 'Error: Error: Something went wrong', payload: [] }
   */

  defaultErrorHandlerHttp(
    err,
    httpStatusCode: number = 400,
  ): ResponseObjectDefault {
    return {
      status: 'failure',
      httpStatus: httpStatusCode,
      message: err?.message ? err.message : err,
      payload: [],
    };
  }

  /**
   * Generate an authentication string for LogicMonitor API calls
   * @param {RequestObjectLMApi} requestObject An object containing the method, epoch, requestData, resourcePath, accessId, and accessKey
   * @returns {string} An authentication string
   * @example
   * generateAuthString({
   *  method: 'get',
   * epoch: '1234567890',
   * requestData: { name: 'John', age: 30, city: 'New York' },
   * resourcePath: '/api/v1/endpoint',
   * accessId: '
   * accessKey:
   * }) // returns 'LMv1 accessId:signature:epoch'
   */

  generateAuthString(requestObjectLMApi: RequestObjectLMApi): string {
    try {
      const { method, epoch, resourcePath, accessId, accessKey, requestData } =
        requestObjectLMApi;
      const requestVars: string = `${method}${epoch}${requestData ? JSON.stringify(requestData) : ''}${resourcePath}`;
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

  /**
   * Make a generic API call to LogicMonitor
   * @param {RequestObjectLMApi} requestObjectLMApi An object containing the method, requestData, queryParams, apiVersion, and url
   * @returns {Promise<ResponseObjectDefault>} An object with status, message, and payload properties
   * @example
   * genericAPICall({
   * method: 'get',
   * requestData: { ... },
   * queryParams: 'company=<subdomain>,accessId=<from LM>,accessKey=<from LM>,searchString=<part of search string>',
   * apiVersion: 3 // is the default
   * url: 'https://companynme.logicmonitor.com/santaba/rest/report/reports'
   * }) // returns { status: 'success', httpStatus: 200, message: 'success', payload: [{ name: 'John', age: 30, city: 'New York' }] }
   */

  async genericAPICall(
    requestObjectLMApi: RequestObjectLMApi,
  ): Promise<ResponseObjectDefault> {
    let returnObj: ResponseObjectDefault = {
      status: 'success',
      httpStatus: 200,
      message: '',
      payload: [],
    };
    const { method, queryParams, apiVersion, resourcePath, url } =
      requestObjectLMApi;
    let urlString: string = `${url(resourcePath)}?size=1000&`;
    if (queryParams) {
      urlString += `${queryParams}`;
    }
    // Encode the query parameters in the URL
    const urlStringEncoded: string = this.encodeQueryParameters(urlString);
    // Remove requestData from the request object if the method is 'get' or 'delete'
    let methodRegEx = /^get$|^delete$/gi;
    if (methodRegEx.test(method)) {
      delete requestObjectLMApi.requestData;
    }
    try {
      const { generateAuthString } = this;
      let authString: string = generateAuthString(requestObjectLMApi);
      if (!authString.toLowerCase().includes('lmv1')) {
        throw new Error('Invalid authString');
      }
      let axiosParametersObj: AxiosRequestConfig = {
        method: requestObjectLMApi.method,
        url: urlStringEncoded,
        data: requestObjectLMApi?.requestData
          ? requestObjectLMApi.requestData
          : '',
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
      const { data, status, headers } = apiResponse;
      // Set HTTP status code for use in error handling
      returnObj.httpStatus = status;
      if (status > 299) {
        throw new Error(`(${status}) - ${JSON.parse(data).errorMessage}`);
      }
      let rateLimitRemaining: number = headers['x-rate-limit-remaining'];
      let rateLimitWindow: number = headers['x-rate-limit-window'] * 1000 + 1;
      let whileVar: boolean = false;
      if (rateLimitRemaining == 0) {
        whileVar = true;
        while (whileVar) {
          setTimeout(async () => {
            //If rate limit reached we need to wait.
            const apiResponse: AxiosResponse =
              await apiRequest.request(axiosParametersObj);
            const { data } = apiResponse;
            returnObj.status = 'success';
            returnObj.httpStatus = status;
            returnObj.message = 'success';
            returnObj.payload = [data];
          }, rateLimitWindow);
          return returnObj;
        }
      } else {
        returnObj.status = 'success';
        returnObj.httpStatus = status;
        returnObj.message = 'success';
        returnObj.payload = [data];
        return returnObj;
      }
      return returnObj;
    } catch (err) {
      return this.defaultErrorHandlerHttp(err, returnObj.httpStatus);
    }
  }
}
