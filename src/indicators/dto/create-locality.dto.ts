import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateLocalityDto {
    @ApiProperty({
        example: 'Santa Cruz',
        description: 'Nombre de la localidad',
    })
    @IsString()
    @IsNotEmpty()
    name: string;
}
