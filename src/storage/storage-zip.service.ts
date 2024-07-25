import { Injectable } from '@nestjs/common';
import * as archiver from 'archiver';
import { createWriteStream } from 'fs';
import { join } from 'path';

@Injectable()
export class StorageServiceZip {
  async createZipWithTextFiles(
    fileContents: { [fileName: string]: string },
    outputFilePath: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const output = createWriteStream(outputFilePath);
      const archive = archiver('zip', {
        zlib: { level: 9 }, // Sets the compression level.
      });

      output.on('close', () => {
        console.log(
          `ZIP file created successfully. Total bytes: ${archive.pointer()}`,
        );
        resolve();
      });

      archive.on('error', (err) => {
        reject(err);
      });

      archive.pipe(output);

      for (const [fileName, content] of Object.entries(fileContents)) {
        archive.append(content, { name: fileName });
      }

      archive.finalize();
    });
  }
}
