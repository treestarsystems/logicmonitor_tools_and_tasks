/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';

/**
 * StorageServiceMongoDB class to handle all MongoDB related operations.
 * @class StorageServiceMongoDB
 * @memberof module:storage
 * @public
 */
@Injectable()
export class StorageServiceMongoDB {
  /**
   * Upsert the backup data to MongoDB.
   * The types should be defined when the method is called.
   * @param {any} mongooseModel The Mongoose model object to use for the upsert.
   * @param {any} filter The filter object to use for the upsert.
   * @param {any} upsertBackupLMData The backup data to upsert.
   * @returns {Promise<any>} The upserted backup data.
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
   * @param {any} filter The filter object to use for the find.
   * @returns {Promise<any>} The found backup data.
   */
  async find(mongooseModel: any, filter: any = {}): Promise<any> {
    return await mongooseModel.find(filter).exec();
  }
}
