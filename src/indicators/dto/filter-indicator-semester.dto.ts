import { Type } from "class-transformer";
import { IsOptional } from "class-validator";

export class FilterIndicatorSemesterDto {
    @IsOptional()
    @Type(() => String)
    localidadName?: string;

    @IsOptional()
    @Type(() => String)
    facultyName?: string;

    @IsOptional()
    @Type(() => String)
    careerName?: string;

    @IsOptional()
    @Type(() => String)
    modeName?: string;

    @Type(() => String)
    indicatorAttributes: string[];  // Lista de atributos de indicadores a calcular
}
