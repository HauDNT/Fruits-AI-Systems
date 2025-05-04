import {IsString, IsOptional, IsInt, Min} from 'class-validator';
import { Type } from 'class-transformer';

export class GetDataWithQueryParamsDTO {
    @IsOptional()
    @IsString()
    queryString?: string;

    @IsOptional()
    @IsString()
    searchFields?: string;

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