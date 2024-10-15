import { Type } from "class-transformer";
import { IsEmpty, IsOptional } from "class-validator";
import { TYPE } from "src/common/constants/type";

export class FilterIndicatorFacultyDto {
    @IsOptional()
    @Type(() => String)
    localidadName?: string;  

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
