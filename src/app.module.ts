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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NestScheduleModule.forRoot(),
    EventEmitterModule.forRoot({
      delimiter: '.',
      newListener: true,
      removeListener: true,
      wildcard: true,
    }),
    MongooseModule.forRoot(
      `${process.env.MONGODB_URI}/${process.env.MONGODB_DB_NAME}`,
    ),
    UtilsModule,
    ToolsModule,
    TasksModule,
    SchedulesModule,
    StorageModule,
    AuditsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
