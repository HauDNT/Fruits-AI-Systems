import {IsString, IsOptional, IsInt, Min} from 'class-validator';
import { Type } from 'class-transformer';

export class GetAreaByQueryDto {
    @IsOptional()
    @IsString()
    queryString?: string;

    @IsOptional()
    @IsString()
    searchFields?: string;      // Chuỗi dạng "type_name,type_desc"

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;
}