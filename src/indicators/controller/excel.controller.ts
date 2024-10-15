import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags, ApiBody } from '@nestjs/swagger';
import * as XLSX from 'xlsx';
import { ExcelService } from '../service/excel.service';


@ApiTags('Excel')
@Controller('excel')
export class ExcelController {

    constructor(private excelService: ExcelService) {}

    @Post('upload')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        const data = await this.excelService.saveData(file);

        return {
            message: 'Archivo cargado con éxito',
            data,
        };
    }
    
}
