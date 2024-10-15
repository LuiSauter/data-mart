import { Body, Controller, Delete, Get, Param, Post, Patch } from '@nestjs/common';
import { LocalityService } from '../service/locality.service';
import { CreateLocalityDto } from '../dto/create-locality.dto';
import { ApiTags } from '@nestjs/swagger';
import { ResponseMessage, ResponseGet } from 'src/common/interfaces';

@ApiTags('Localities')
@Controller('localities')
export class LocalityController {
    constructor(private readonly localityService: LocalityService) { }

    @Post()
    async create(@Body() createLocalityDto: CreateLocalityDto): Promise<ResponseMessage> {
        return {
            statusCode: 201,
            data: await this.localityService.create(createLocalityDto),
        };
    }

    @Get()
    async findAll(): Promise<ResponseGet> {
        const { data, countData } = await this.localityService.findAll();
        return { data, countData };
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ResponseMessage> {
        return {
            statusCode: 200,
            data: await this.localityService.findOne(id),
        };
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() createLocalityDto: CreateLocalityDto,
    ): Promise<ResponseMessage> {
        return {
            statusCode: 200,
            data: await this.localityService.update(id, createLocalityDto),
        };
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<ResponseMessage> {
        await this.localityService.remove(id);
        return { statusCode: 200, message: 'Locality deleted' };
    }
}
