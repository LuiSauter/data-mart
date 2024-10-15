import { Type } from "class-transformer";
import { IsOptional } from "class-validator";

export class FilterIndicatorLocalityDto {
    @IsOptional()
    @Type(() => String)
    modeName?: string;

    @IsOptional()
    @Type(() => String)
    semesterPeriod?: string;

    @IsOptional()
    @Type(() => String)
    semesterYear?: string;

    @IsOptional()
    @Type(() => String)
    facultyName?: string;  

    @Type(() => String)
    indicatorAttributes: string[];  
}
