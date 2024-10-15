import { Body, Controller, Delete, Get, Param, Post, Patch } from '@nestjs/common';
import { SemesterService } from '../service/semester.service';
import { CreateSemesterDto } from '../dto/create-semester.dto';
import { ApiTags } from '@nestjs/swagger';
import { ResponseMessage, ResponseGet } from 'src/common/interfaces';

@ApiTags('Semesters')
@Controller('semesters')
export class SemesterController {
    constructor(private readonly semesterService: SemesterService) { }

    @Post()
    async create(@Body() createSemesterDto: CreateSemesterDto): Promise<ResponseMessage> {
        return {
            statusCode: 201,
            data: await this.semesterService.create(createSemesterDto),
        };
    }

    @Get()
    async findAll(): Promise<ResponseGet> {
        const { data, countData } = await this.semesterService.findAll();
        return { data, countData };
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ResponseMessage> {
        return {
            statusCode: 200,
            data: await this.semesterService.findOne(id),
        };
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() createSemesterDto: CreateSemesterDto,
    ): Promise<ResponseMessage> {
        return {
            statusCode: 200,
            data: await this.semesterService.update(id, createSemesterDto),
        };
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<ResponseMessage> {
        await this.semesterService.remove(id);
        return { statusCode: 200, message: 'Semester deleted' };
    }
}
