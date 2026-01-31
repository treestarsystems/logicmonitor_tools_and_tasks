/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';

/**
 * StorageServiceMongoDB class to handle all MongoDB related operations.
 * @class StorageServiceMongoDB
 * @memberof module:storage
 * @injectable
 * @public
 * @export
 */
@Injectable()
export class StorageServiceMongoDB {
  constructor() {}

  /**
   * Upsert the backup data to MongoDB.
   * The types should be defined when the method is called.
   * @param {any} mongooseModel The Mongoose model object to use for the upsert.
   * @param {any} filter  The filter object to use for the upsert.
   * @param {any} upsertBackupLMData  The backup data to upsert.
   * @returns
   */
  async upsert(mongooseModel: any, filter: any, upsertBackupLMData: any): Promise<any> {
    const upsertBackup = await mongooseModel.updateOne(
      filter,
      { $set: upsertBackupLMData },
      { upsert: true }
    );
    if (upsertBackup.upsertedId) {
      return mongooseModel.findById(upsertBackup.upsertedId).exec();
    } else {
      return mongooseModel.findOne(filter).exec();
    }
  }

  /**
   * Find the backup data from MongoDB.
   * @param {any} mongooseModel The Mongoose model object to use for the find.
   * @param {any} filter  The filter object to use for the find.
   * @returns
   */
  find(mongooseModel: any, filter: any = {}): any {
    return mongooseModel.find(filter).exec();
  }
}
