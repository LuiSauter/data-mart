import { Body, Controller, Delete, Get, Param, Post, Patch } from '@nestjs/common';
import { CareerService } from '../service/career.service';
import { CreateCareerDto } from '../dto/create-career.dto';
import { ApiTags } from '@nestjs/swagger';
import { ResponseMessage, ResponseGet } from 'src/common/interfaces';

@ApiTags('Careers')
@Controller('careers')
export class CareerController {
    constructor(private readonly careerService: CareerService) { }

    @Post()
    async create(@Body() createCareerDto: CreateCareerDto): Promise<ResponseMessage> {
        return {
            statusCode: 201,
            data: await this.careerService.create(createCareerDto),
        };
    }

    @Get()
    async findAll(): Promise<ResponseGet> {
        const { data, countData } = await this.careerService.findAll();
        return { data, countData };
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ResponseMessage> {
        return {
            statusCode: 200,
            data: await this.careerService.findOne(id),
        };
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() createCareerDto: CreateCareerDto,
    ): Promise<ResponseMessage> {
        return {
            statusCode: 200,
            data: await this.careerService.update(id, createCareerDto),
        };
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<ResponseMessage> {
        await this.careerService.remove(id);
        return { statusCode: 200, message: 'Career deleted' };
    }
}
