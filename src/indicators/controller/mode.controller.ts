import { Body, Controller, Delete, Get, Param, Post, Patch } from '@nestjs/common';
import { ModeService } from '../service/mode.service';
import { CreateModeDto } from '../dto/create-mode.dto';
import { ApiTags } from '@nestjs/swagger';
import { ResponseGet, ResponseMessage } from 'src/common/interfaces'; // Si tienes esta interfaz

@ApiTags('Modes')
@Controller('modes')
export class ModeController {
    constructor(private readonly modeService: ModeService) { }

    @Post()
    async create(@Body() createModeDto: CreateModeDto): Promise<ResponseMessage> {
        return {
            statusCode: 201,
            data: await this.modeService.create(createModeDto),
        };
    }

    @Get()
    async findAll(): Promise<ResponseGet> {
        const {data, countData} = await this.modeService.findAll();
        return {
            data, countData
        };
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ResponseMessage> {
        return {
            statusCode: 200,
            data: await this.modeService.findOne(id),
        };
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() createModeDto: CreateModeDto,
    ): Promise<ResponseMessage> {
        return {
            statusCode: 200,
            data: await this.modeService.update(id, createModeDto),
        };
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<ResponseMessage> {
        await this.modeService.remove(id);
        return { statusCode: 200, message: 'Mode deleted' };
    }
}
