import { Type } from "class-transformer";
import { IsOptional } from "class-validator";

export class FilterIndicatorCareerDto {
    @IsOptional()
    @Type(() => String)
    localidadName?: string;

    @IsOptional()
    @Type(() => String)
    facultyName?: string;

    @IsOptional()
    @Type(() => String)
    modeName?: string;

    @IsOptional()
    @Type(() => String)
    semesterPeriod?: string;

    @IsOptional()
    @Type(() => String)
    semesterYear?: string;

    @Type(() => String)
    indicatorAttributes: string[];  
}
