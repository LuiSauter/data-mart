import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID, IsOptional } from 'class-validator';

export class CreateIndicatorDto {
    @ApiProperty({ example: 'uuid-de-carrera', description: 'ID de la carrera' })
    @IsUUID()
    @IsNotEmpty()
    careerId: string;

    @ApiProperty({ example: 'uuid-de-localidad', description: 'ID de la localidad' })
    @IsUUID()
    @IsNotEmpty()
    localityId: string;

    @ApiProperty({ example: 'uuid-de-modalidad', description: 'ID de la modalidad' })
    @IsUUID()
    @IsNotEmpty()
    modeId: string;

    @ApiProperty({ example: 'uuid-de-semestre', description: 'ID del semestre' })
    @IsUUID()
    @IsNotEmpty()
    semesterId: string;

    @ApiProperty({ example: 100, description: 'Total de inscritos' })
    @IsNumber()
    @IsNotEmpty()
    t_inscritos: number;

    @ApiProperty({ example: 50, description: 'Total de nuevos inscritos' })
    @IsNumber()
    @IsNotEmpty()
    t_nuevos: number;

    @ApiProperty({ example: 50, description: 'Total de inscritos anteriores' })
    @IsNumber()
    @IsNotEmpty()
    t_anteriores: number;

    @ApiProperty({ example: 75, description: 'Total de matrículas inscritas' })
    @IsNumber()
    @IsNotEmpty()
    matriculas_inscritas: number;

    @ApiProperty({ example: 5, description: 'Cantidad de estudiantes sin nota' })
    @IsNumber()
    @IsNotEmpty()
    sin_nota: number;

    @ApiProperty({ example: 10.5, description: 'Porcentaje de estudiantes sin nota' })
    @IsNumber()
    @IsNotEmpty()
    sin_nota_percent: number;

    @ApiProperty({ example: 70, description: 'Cantidad de estudiantes aprobados' })
    @IsNumber()
    @IsNotEmpty()
    aprobados: number;

    @ApiProperty({ example: 85.0, description: 'Porcentaje de aprobados' })
    @IsNumber()
    @IsNotEmpty()
    aprobados_percent: number;

    @ApiProperty({ example: 15, description: 'Cantidad de reprobados' })
    @IsNumber()
    @IsNotEmpty()
    reprobados: number;

    @ApiProperty({ example: 15.0, description: 'Porcentaje de reprobados' })
    @IsNumber()
    @IsNotEmpty()
    reprobados_percent: number;

    @ApiProperty({ example: 5, description: 'Cantidad de reprobados con 0' })
    @IsNumber()
    @IsNotEmpty()
    reprobados_con_0: number;

    @ApiProperty({ example: 5.0, description: 'Porcentaje de reprobados con 0' })
    @IsNumber()
    @IsNotEmpty()
    reprobados_con_0_percent: number;

    @ApiProperty({ example: 3, description: 'Cantidad de estudiantes en mora' })
    @IsNumber()
    @IsNotEmpty()
    moras: number;

    @ApiProperty({ example: 2.5, description: 'Porcentaje de estudiantes en mora' })
    @IsNumber()
    @IsNotEmpty()
    moras_percent: number;

    @ApiProperty({ example: 2, description: 'Cantidad de retirados' })
    @IsNumber()
    @IsNotEmpty()
    retirados: number;

    @ApiProperty({ example: 3.8, description: 'Promedio ponderado acumulado' })
    @IsNumber()
    @IsOptional()
    ppa?: number;

    @ApiProperty({ example: 4.0, description: 'Promedio ponderado simple' })
    @IsNumber()
    @IsOptional()
    pps?: number;

    @ApiProperty({ example: 3.9, description: 'Promedio ponderado del primer año' })
    @IsNumber()
    @IsOptional()
    ppa1?: number;

    @ApiProperty({ example: 4.1, description: 'Promedio ponderado acumulado completo' })
    @IsNumber()
    @IsOptional()
    ppac?: number;

    @ApiProperty({ example: 15, description: 'Cantidad de egresados' })
    @IsNumber()
    @IsNotEmpty()
    egresados: number;

    @ApiProperty({ example: 10, description: 'Cantidad de titulados' })
    @IsNumber()
    @IsNotEmpty()
    titulados: number;
}
