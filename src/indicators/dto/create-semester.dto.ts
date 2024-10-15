import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSemesterDto {
    @ApiProperty({
        example: '2024',
        description: 'Año del semestre',
    })
    @IsString()
    @IsNotEmpty()
    year: string;

    @ApiProperty({
        example: '1',
        description: 'Periodo del semestre',
    })
    @IsString()
    @IsNotEmpty()
    period: string;
}
