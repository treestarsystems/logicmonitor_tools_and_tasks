import { Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { ResponseObject } from './models.service';
import e from 'express';
// import { Axios } from 'axios';
// import { scrypt } from 'crypto';

@Injectable()
export class UtilsService {
  //Generate a random alphanumeric string
  genRegular(stringLength: number): string {
    const regularchar: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let text: string = "";
    for (let i = 0; i < stringLength; i++) {
      text += regularchar.charAt(Math.floor(Math.random() * regularchar.length));
    }
    return text;
  }

  //Generate a random alphanumeric string with special characters
  genSpecial(stringLength: number): string {
    const specialchar: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%_-(),;:.*"
    let text: string = "";
    for (let i = 0; i < stringLength; i++) {
      text += specialchar.charAt(Math.floor(Math.random() * specialchar.length));
    }
    return text;
  }

  //Generate a random alphanumeric string with only special characters
  genSpecialOnly(stringLength: number): string {
    const specialchar: string = "!@#$%_-(),;:.*"
    let text: string = "";
    for (let i = 0; i < stringLength; i++) {
      text += specialchar.charAt(Math.floor(Math.random() * specialchar.length));
    }
    return text;
  }

  //Generate a random number within defined range
  getRandomInt(min: number, max: number): number {
    return Math.round(Math.random() * (max - min) + min);
  }

  randomCaps(word: string): string {
    const position = this.getRandomInt(0, word.length);
    return `${this.replaceAt(word, position, word.charAt(position).toUpperCase())}`;
  }

  insertSpecialChars(word: string): string {
    const specialchar = "!@#$%_-(),;:.*"
    let index = this.getRandomInt(1, word.length);
    let text = specialchar.charAt(Math.floor(Math.random() * specialchar.length));
    return word.substring(0, index) + text + word.substring(index);
  }

  //Source: https://gist.github.com/efenacigiray/9367920
  replaceAt(originalString: string, replacementIndex: number, replacementString: string): string {
    return `${originalString.substring(0, replacementIndex)}${replacementString}${originalString.substring(replacementIndex + 1)}`;
  }

  //Source: https://stackoverflow.com/a/2117523
  uuidv4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  //Source: https://learnersbucket.com/examples/javascript/how-to-validate-json-in-javascript/
  validateJSON(obj: Object): boolean {
    let o = JSON.stringify(obj);
    try {
      JSON.parse(o);
    } catch (e) {
      return false;
    }
    return true;
  }

  // defaultErrorHandler(error: string |Error): ResponseObject {
  //   let returnObj = { "status": "", "message": "", "payload": "" };
  //   //This is done just incase you use the "throw" keyword to produce your own error.
  //   let errorMessage = ((error?.message) ? error?.message : error);
  //   returnObj.status = "failure";
  //   returnObj.message = `Function: ${arguments.callee.caller.name} - Error: ${errorMessage}`;
  //   returnObj.payload = errorMessage;
  //   return returnObj;
  // }

  // //Takes an object that containts http method, http data, resource path, accessId, signature
  // async genericAPICall(obj) {
  //   const RETURNOBJ = { 'status': '', 'message': '', 'payload': '' };
  //   let url = ((obj.reportURL) ? `${obj.reportURL}` : `${obj.url()}?size=1000&`);
  //   if (obj.queryParams) {
  //     url += `?${obj.queryParams}`;
  //   }
  //   let methodRegEx = /^get$|^delete$/gi;
  //   if (methodRegEx.test(obj.method)) {
  //     delete obj.requestData;
  //   }
  //   try {
  //     let authString = this.generateAuthString(obj)
  //     if (authString.status == 'failure') {
  //       throw authString.message;
  //     }
  //     let axiosParametersObj = {
  //       method: obj.method,
  //       url: url,
  //       data: ((obj.requestData) ? obj.requestData : ''),
  //       headers: {
  //         'ContentType': 'application/json',
  //         'Authorization': authString.payload
  //       }
  //     };
  //     if (obj.apiVersion) {
  //       axiosParametersObj.headers['X-Version'] = obj.apiVersion;
  //     }
  //     let result = await Axios(axiosParametersObj);
  //     let rateLimitRemaining = result.headers['x-rate-limit-remaining'];
  //     let rateLimitWindow = (result.headers['x-rate-limit-window'] * 1000) + 1;
  //     let whileVar = false;
  //     if (rateLimitRemaining == 0) {
  //       whileVar = true;
  //       while (whileVar) {
  //         setTimeout(async () => {
  //           //If rate limit reached we need to wait.
  //           let r = await axios(axiosParametersObj);
  //           RETURNOBJ.status = 'success';
  //           RETURNOBJ.message = 'success';
  //           RETURNOBJ.payload = r.data;
  //         }, rateLimitWindow);
  //         return RETURNOBJ;
  //       }
  //     } else {
  //       RETURNOBJ.status = 'success';
  //       RETURNOBJ.message = 'success';
  //       RETURNOBJ.payload = result.data;
  //       return RETURNOBJ;
  //     }
  //   } catch (e) {
  //     return this.defaultErrorHandler(e);
  //   } finally { }
  // }

  // generateAuthString(obj) {
  //   const RETURNOBJ = { 'status': '', 'message': '', 'payload': '' };
  //   try {
  //     let requiredProperties = ['method', 'epoch', 'requestData', 'resourcePath', 'accessId', 'accessKey'];
  //     for (const p of requiredProperties) {
  //       //We want to skip over checking for requestData when using http GET.
  //       let methodRegEx = /^get$|^delete$/gi;
  //       if (methodRegEx.test(obj.method) && p == 'requestData') continue
  //       if (!obj.hasOwnProperty(p)) {
  //         throw `Missing required property to generate auth string: ${p}`;
  //       }
  //     }
  //     let requestData = ((obj.requestData) ? JSON.stringify(obj.requestData) : '');
  //     let requestVars = `${obj.method}${obj.epoch}${requestData}${obj.resourcePath}`;
  //     let hex = crypto.createHmac('sha256', obj.accessKey).update(requestVars).digest('hex');
  //     let signature = new Buffer.from(hex, 'utf-8').toString('base64');
  //     let auth = `LMv1 ${obj.accessId}:${signature}:${obj.epoch}`;
  //     RETURNOBJ.status = 'success';
  //     RETURNOBJ.message = 'success';
  //     RETURNOBJ.payload = auth;
  //     return RETURNOBJ;
  //   } catch (e) {
  //     return this.defaultErrorHandler(e);
  //   } finally { }
  // }
}
