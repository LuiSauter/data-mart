import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateModeDto {
    @ApiProperty({
        example: 'Presencial',
        description: 'Nombre de la modalidad',
    })
    @IsString()
    @IsNotEmpty()
    name: string;
}
