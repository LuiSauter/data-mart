import { Body, Controller, Delete, Get, Param, Post, Patch, Query } from '@nestjs/common';
import { IndicatorService } from '../service/indicator.service';
import { CreateIndicatorDto } from '../dto/create-indicator.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ResponseGet, ResponseMessage } from 'src/common/interfaces';

@ApiTags('Indicators')
@Controller('indicators')
export class IndicatorController {
    constructor(private readonly indicatorService: IndicatorService) { }

    @Post()
    async create(@Body() createIndicatorDto: CreateIndicatorDto): Promise<ResponseMessage> {
        return {
            statusCode: 201,
            data: await this.indicatorService.create(createIndicatorDto),
        };
    }

    @Get()
    async findAll(): Promise<ResponseGet> {
        const { data, countData } = await this.indicatorService.findAll();
        return { data, countData };
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ResponseMessage> {
        return {
            statusCode: 200,
            data: await this.indicatorService.findOne(id),
        };
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() createIndicatorDto: CreateIndicatorDto,
    ): Promise<ResponseMessage> {
        return {
            statusCode: 200,
            data: await this.indicatorService.update(id, createIndicatorDto),
        };
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<ResponseMessage> {
        await this.indicatorService.remove(id);
        return { statusCode: 200, message: 'Indicator deleted' };
    }

}
