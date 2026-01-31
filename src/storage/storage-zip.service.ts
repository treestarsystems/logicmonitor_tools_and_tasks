import { Injectable } from '@nestjs/common';
import * as archiver from 'archiver';
import { createWriteStream } from 'fs';

/**
 * StorageServiceZip class to handle all ZIP related operations.
 * @class StorageServiceZip
 * @memberof module:storage
 * @public
 */
@Injectable()
export class StorageServiceZip {
  /**
   * Create a ZIP file with text files.
   * @param {{[key: string]: string}} fileContents The file contents to write to the ZIP file.
   * @param {string} outputFilePath The output file path for the ZIP file.
   * @returns {Promise<void>} Promise object.
   */
  async createZipWithTextFiles(
    fileContents: { [fileName: string]: string },
    outputFilePath: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const output = createWriteStream(outputFilePath);
      const archive = archiver('zip', {
        zlib: { level: 9 },
      });

      output.on('close', () => {
        resolve();
      });

      archive.on('error', err => {
        reject(err);
      });

      archive.pipe(output);

      for (const [fileName, content] of Object.entries(fileContents)) {
        archive.append(content, { name: fileName });
      }

      void archive.finalize();
    });
  }
}
