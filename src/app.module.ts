import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { UtilsModule } from './utils/utils.module';
import { ToolsModule } from './tools/tools.module';
import { TasksModule } from './tasks/tasks.module';
import { ApiModule } from './api/api.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot({
      delimiter: '.',
      newListener: true,
      removeListener: true,
      wildcard: true,
    }),
    UtilsModule,
    ToolsModule,
    TasksModule,
    ApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
