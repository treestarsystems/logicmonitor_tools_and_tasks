import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { UtilsModule } from './utils/utils.module';
import { ToolsModule } from './tools/tools.module';
import { TasksModule } from './tasks/tasks.module';
import { SchedulesModule } from './schedules/schedules.module';
import { StorageModule } from './storage/storage.module';
import { AuditsModule } from './audits/audits.module';
import { HealthModule } from './health/health.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

// Define log format constants
const timeStampFormat = 'YYYY-MM-DD HH:mm:ss';
const logStringFormat = (info: winston.Logform.TransformableInfo): string =>
  `${info.timestamp as string} [${info.level.toUpperCase()}]: ${info.message as string}`;

/**
 * AppModule is the root module of the application.
 * It imports all other modules and sets up global configurations.
 * @class AppModule
 * @memberof module:app
 * @public
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'docs'),
      serveRoot: '/code/docs',
    }),
    NestScheduleModule.forRoot(),
    EventEmitterModule.forRoot({
      delimiter: '.',
      newListener: true,
      removeListener: true,
      wildcard: true,
    }),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGODB_HOSTNAME}:${process.env.MONGODB_PORT}/${process.env.MONGODB_NAME}`
    ),
    UtilsModule,
    ToolsModule,
    TasksModule,
    SchedulesModule,
    StorageModule,
    AuditsModule,
    HealthModule,
    WinstonModule.forRoot({
      transports: [
        // Console transport for warnings and above
        new winston.transports.Console({
          level: 'warn',
          format: winston.format.combine(
            winston.format.timestamp({ format: timeStampFormat }),
            winston.format.printf(logStringFormat),
            winston.format.colorize({ all: true })
          ),
        }),
        // Daily rotating file transport for info level logs
        new DailyRotateFile({
          dirname: './lmtt-app-logs',
          filename: 'lmtt-app-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '30d',
          level: 'info',
          format: winston.format.combine(
            winston.format.timestamp({ format: timeStampFormat }),
            winston.format.printf(logStringFormat)
          ),
        }),
      ],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
