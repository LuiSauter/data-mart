import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModeEntity } from './entities/mode.entity';
import { SemesterEntity } from './entities/semester.entity';
import { CareerEntity } from './entities/career.entity';
import { IndicatorEntity } from './entities/indicator.entity';
import { FacultyEntity } from './entities/faculty.entity';
import { ModeController } from './controller/mode.controller';
import { ModeService } from './service/mode.service';
import { FacultyController } from './controller/faculty.controller';
import { SemesterController } from './controller/semester.controller';
import { LocalityController } from './controller/locality.controller';
import { FacultyService } from './service/faculty.service';
import { SemesterService } from './service/semester.service';
import { LocalityService } from './service/locality.service';
import { LocalityEntity } from './entities/locality.entity';
import { CareerController } from './controller/career.controller';
import { IndicatorController } from './controller/indicator.controller';
import { CareerService } from './service/career.service';
import { IndicatorService } from './service/indicator.service';
import { ExcelController } from './controller/excel.controller';
import { ExcelService } from './service/excel.service';

@Module({
    imports: [TypeOrmModule.forFeature([
        ModeEntity, SemesterEntity,CareerEntity, IndicatorEntity, FacultyEntity, LocalityEntity
    ])],
    controllers: [ModeController, FacultyController, SemesterController, LocalityController, CareerController, IndicatorController, ExcelController],
    providers: [ModeService, FacultyService, SemesterService, LocalityService, CareerService, IndicatorService, ExcelService],
    exports: [ModeService, FacultyService, SemesterService, LocalityService, CareerService, IndicatorService, ExcelService],
})
export class IndicatorsModule {}
