import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFacultyDto {
    @ApiProperty({ example: 'Faculty of Engineering', description: 'Name of the faculty' })
    @IsString()
    @IsNotEmpty()
    name: string;
}
