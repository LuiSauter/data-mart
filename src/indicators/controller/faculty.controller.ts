import { Body, Controller, Delete, Get, Param, Post, Patch, Query, Logger } from '@nestjs/common';
import { FacultyService } from '../service/faculty.service';
import { CreateFacultyDto } from '../dto/create-faculty.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ResponseMessage, ResponseGet } from 'src/common/interfaces';
import { FilterIndicatorFacultyDto } from '../dto/filter-indicator-faculty.dto';

@ApiTags('Faculties')
@Controller('faculties')
export class FacultyController {
    constructor(private readonly facultyService: FacultyService) { }

    @Post()
    public async create(@Body() createFacultyDto: CreateFacultyDto): Promise<ResponseMessage> {
        return {
            statusCode: 201,
            data: await this.facultyService.create(createFacultyDto),
        };
    }

    // @Get()
    // public async findAll(): Promise<ResponseGet> {
    //     const { data, countData } = await this.facultyService.findAll();
    //     return { data, countData };
    // }

    @Get(':id')
    public async findOne(@Param('id') id: string): Promise<ResponseMessage> {
        return {
            statusCode: 200,
            data: await this.facultyService.findOne(id),
        };
    }

    @Patch(':id')
    public async update(
        @Param('id') id: string,
        @Body() createFacultyDto: CreateFacultyDto,
    ): Promise<ResponseMessage> {
        return {
            statusCode: 200,
            data: await this.facultyService.update(id, createFacultyDto),
        };
    }

    @Delete(':id')
    public async remove(@Param('id') id: string): Promise<ResponseMessage> {
        await this.facultyService.remove(id);
        return { statusCode: 200, message: 'Faculty deleted' };
    }

    @ApiQuery({ name: 'localidadName', required: false, description: 'Filter by locality Name', type: 'string' })
    @ApiQuery({ name: 'modeName', required: false, description: 'Filter by mode Name', type: 'string' })
    @ApiQuery({ name: 'semesterPeriod', required: false, description: 'Filter by semester Name', type: 'string' })
    @ApiQuery({ name: 'semesterYear', required: false, description: 'Filter by semester Year', type: 'string' })
    @ApiQuery({ name: 'indicatorAttributes', required: true, description: 'Indicator attribute to sum', isArray: true, type: 'string' })
    @Get()    
    public async getFacultiesWithIndicatorSum(@Query() filterDto: FilterIndicatorFacultyDto): Promise<any> {
        Logger.log(filterDto);
        return this.facultyService.getFacultyWithIndicatorSum(filterDto);
    }
}
