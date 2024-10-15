import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCareerDto {
    @ApiProperty({
        example: 'Ingeniería de Sistemas',
        description: 'Nombre de la carrera',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: '132-0',
        description: 'Código de la carrera',
    })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({
        example: 'c5c9b028-f9f7-4c9c-8374-b8b5f94d9e3e',
        description: 'ID de la facultad a la que pertenece la carrera',
    })
    @IsUUID()
    @IsNotEmpty()
    facultyId: string;
}
