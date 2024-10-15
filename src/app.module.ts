import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConfig } from './config/data.source';
import { ScheduleModule } from '@nestjs/schedule';
import { IndicatorsModule } from './indicators/indicators.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot({ ...DataSourceConfig, autoLoadEntities: true }),
    ScheduleModule.forRoot(),
    IndicatorsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
