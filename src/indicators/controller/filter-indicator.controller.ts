import { Controller, Get, Query, Logger } from '@nestjs/common';
import { FacultyService } from '../service/faculty.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { FilterIndicatorFacultyDto } from '../dto/filter-indicator-faculty.dto';
import { LocalityService } from '../service/locality.service';
import { FilterIndicatorLocalityDto } from '../dto/filter-indicator-locality.dto';

@ApiTags('Filter')
@Controller('filters')
export class FilterController {
    constructor(
        private readonly facultyService: FacultyService,
        private readonly localityService: LocalityService,
    ) { }

    @ApiQuery({ name: 'localidadName', required: false, description: 'Filter by locality Name', type: 'string' })
    @ApiQuery({ name: 'modeName', required: false, description: 'Filter by mode Name', type: 'string' })
    @ApiQuery({ name: 'semesterPeriod', required: false, description: 'Filter by semester Name', type: 'string' })
    @ApiQuery({ name: 'semesterYear', required: false, description: 'Filter by semester Year', type: 'string' })
    @ApiQuery({ name: 'indicatorAttributes', required: true, description: 'Indicator attribute to sum', isArray: true, type: 'string' })
    @Get('faculties')
    public async getFacultiesWithIndicatorSum(@Query() filterDto: FilterIndicatorFacultyDto): Promise<any> {
        Logger.log(filterDto);
        return this.facultyService.getFacultyWithIndicatorSum(filterDto);
    }

    @ApiQuery({ name: 'modeName', required: false, type: String })
    @ApiQuery({ name: 'semesterPeriod', required: false, type: String })
    @ApiQuery({ name: 'semesterYear', required: false, type: String })
    @ApiQuery({ name: 'facultyName', required: false, type: String }) 
    @ApiQuery({ name: 'indicatorAttributes', required: true, isArray: true, type: 'string' })
    @Get('localities')
    public async getLocalitiesWithIndicatorSum(@Query() filterDto: FilterIndicatorLocalityDto): Promise<any> {
        return this.localityService.getLocalityWithIndicatorSum(filterDto);
    }
}
