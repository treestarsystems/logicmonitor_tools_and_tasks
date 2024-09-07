import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BackupServiceDatasources } from '../src/tools/tools-backup-datasources.service';
import { UtilsService } from '../src/utils/utils.service';
import { StorageServiceMongoDB } from '../src/storage/storage-mongodb.service';
import {
  BackupDocumentDatasource,
  BackupLMDataDatasource,
} from '../src/storage/schemas/storage-mongodb.schema';

describe('BackupServiceDatasources', () => {
  let service: BackupServiceDatasources;
  let utilsService: UtilsService;
  let storageServiceMongoDb: StorageServiceMongoDB;
  let backupDatasourceModel: Model<BackupDocumentDatasource>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BackupServiceDatasources,
        {
          provide: UtilsService,
          useValue: {
            // Mock methods as needed
          },
        },
        {
          provide: StorageServiceMongoDB,
          useValue: {
            // Mock methods as needed
          },
        },
        {
          provide: getModelToken(BackupLMDataDatasource.name),
          useValue: {
            // Mock methods as needed
          },
        },
      ],
    }).compile();

    service = module.get<BackupServiceDatasources>(BackupServiceDatasources);
    utilsService = module.get<UtilsService>(UtilsService);
    storageServiceMongoDb = module.get<StorageServiceMongoDB>(
      StorageServiceMongoDB,
    );
    backupDatasourceModel = module.get<Model<BackupDocumentDatasource>>(
      getModelToken(BackupLMDataDatasource.name),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add more tests here
  describe('processXMLDataExport', () => {
    // it('should handle datasource export successfully', async () => {
    //   const datasourceXMLExport = { payload: ['<xml>data</xml>'] };
    //   const dle = { name: 'test', group: 'group' };
    //   const datasourceNameParsed = 'test';
    //   const company = 'company';
    //   const progressTracking = { success: [], failure: [] };

    //   console.log(Object.getOwnPropertyNames(storageServiceMongoDb));

    //   jest.spyOn(storageServiceMongoDb, 'upsert').mockResolvedValueOnce(null);
    //   jest
    //     .spyOn(utilsService, 'defaultErrorHandlerString')
    //     .mockImplementation((msg) => msg);

    //   await service['processXMLDataExport'](
    //     datasourceXMLExport,
    //     dle,
    //     datasourceNameParsed,
    //     company,
    //     progressTracking,
    //   );

    //   expect(progressTracking.success).toContain('Success: test');
    // });

    // it('should handle datasource export failure', async () => {
    //   const datasourceXMLExport = { payload: ['<xml>data</xml>'] };
    //   const dle = { name: 'test', group: 'group' };
    //   const datasourceNameParsed = 'test';
    //   const company = 'company';
    //   const progressTracking = { success: [], failure: [] };

    //   jest
    //     .spyOn(storageServiceMongoDb, 'upsert')
    //     .mockRejectedValueOnce(new Error('Upsert failed'));
    //   jest
    //     .spyOn(utilsService, 'defaultErrorHandlerString')
    //     .mockImplementation((msg) => msg);

    //   await expect(
    //     service['processXMLDataExport'](
    //       datasourceXMLExport,
    //       dle,
    //       datasourceNameParsed,
    //       company,
    //       progressTracking,
    //     ),
    //   ).rejects.toThrow('Upsert failed');
    //   expect(progressTracking.failure).toContain(
    //     'Failure: test - Upsert failed',
    //   );
    // });

    it('should throw error if payload is not a string', async () => {
      const datasourceXMLExport = { payload: [123] };
      const dle = { name: 'test', group: 'group' };
      const datasourceNameParsed = 'test';
      const company = 'company';
      const progressTracking = { success: [], failure: [] };

      await expect(
        service['processXMLDataExport'](
          datasourceXMLExport,
          dle,
          datasourceNameParsed,
          company,
          progressTracking,
        ),
      ).rejects.toThrow('Payload is not a string');
    });
  });
});
