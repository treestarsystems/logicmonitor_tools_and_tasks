import { UtilsService } from '../src/utils/utils.service';

describe('UtilsService', () => {
  let utilsService: UtilsService;

  beforeEach(() => {
    utilsService = new UtilsService();
  });

  describe('genRegular', () => {
    it('should generate a random alphanumeric string', () => {
      const result = utilsService.genRegular(10);
      expect(result).toMatch(/^[a-zA-Z0-9]{10}$/);
    });
  });

  describe('genSpecial', () => {
    it('should generate a random alphanumeric string with special characters', () => {
      const result = utilsService.genSpecial(10);
      // expect(result).toMatch(/[a-zA-Z0-9!@#$%*_\-(),;:.]{10}/);
      expect(result).toMatch(/[a-zA-Z0-9!@#$%_\-(),;:.*]{10}/);
    });
  });

  describe('genSpecialOnly', () => {
    it('should generate a random string with only special characters', () => {
      const result = utilsService.genSpecialOnly(10);
      expect(result).toMatch(/^[!@#$%_\-(),;:.*]{10}$/);
    });
  });

  describe('getRandomInt', () => {
    it('should generate a random number within the defined range', () => {
      const result = utilsService.getRandomInt(1, 10);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
    });
  });

  describe('capitalizeFirstLetter', () => {
    it('should capitalize the first letter of a given string', () => {
      const result = utilsService.capitalizeFirstLetter('hello');
      expect(result).toBe('Hello');
    });
  });

  describe('insertSpecialChars', () => {
    it('should generate a string with special characters inserted at random positions', () => {
      const string = 'hello';
      const result = utilsService.insertSpecialChars('hello');
      expect(result).toMatch(/[A-Za-z|\W]/);
    });

    it('should generate a string longer than the input string', () => {
      const string = 'hello';
      const result = utilsService.insertSpecialChars('hello');
      expect(result.length).toEqual(string.length + 1);
    });
  });

  describe('replaceAt', () => {
    it('should replace a character at a specific index in a string', () => {
      const result = utilsService.replaceAt('hello', 1, 'a');
      expect(result).toBe('hallo');
    });
  });

  describe('uuidv4', () => {
    it('should generate a random UUIDv4 string', () => {
      const result = utilsService.uuidv4();
      expect(result).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });
  });

  describe('validateJSON', () => {
    it('should validate a JSON object', () => {
      const result = utilsService.validateJSON({
        name: 'John',
        age: 30,
        city: 'New York',
      });
      expect(result).toBe(true);
    });

    it('should return false for an invalid JSON object', () => {
      const result = utilsService.validateJSON('invalid json');
      expect(result).toBe(false);
    });
  });

  // describe('encodeQueryParameters', () => {
  //   it('should encode the query parameters of a given URL', () => {
  //     const result = utilsService.encodeQueryParameters(
  //       'www.foobar.com/?first=1&second=12&third=5',
  //     );
  //     expect(result).toBe('www.foobar.com/?first=1&amp;second=12&amp;third=5');
  //   });
  // });

  describe('defaultErrorHandlerString', () => {
    it('should return the error string', () => {
      const result = utilsService.defaultErrorHandlerString(
        'Error: Something went wrong',
      );
      expect(result).toBe('Error: Something went wrong');
    });
  });

  describe('defaultErrorHandlerHttp', () => {
    it('should return an object with status, message, and payload properties', () => {
      const result = utilsService.defaultErrorHandlerHttp(
        'Error: Something went wrong',
      );
      expect(result).toEqual({
        status: 'failure',
        httpStatus: 400,
        message: 'Error: Something went wrong',
        payload: [],
      });
    });
  });

  // Add more test cases for other methods in the UtilsService class
});
