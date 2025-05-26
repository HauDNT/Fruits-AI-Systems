import { IsArray, IsNotEmpty, IsString, Length, ArrayNotEmpty, IsInt } from "class-validator";
import { Transform } from "class-transformer";

export class CreateFruitDto {
    @IsString()
    @Length(1, 100, { message: 'Tên trái cây phải từ 1 đến 100 ký tự' })
    @IsNotEmpty({ message: 'Tên trái cây không được bỏ trống' })
    @Transform(({ value }) => String(value))
    fruit_name: string;

    @IsString()
    @Length(1, 100, { message: 'Mô tả trái cây phải từ 1 đến 100 ký tự' })
    @IsNotEmpty({ message: 'Mô tả trái cây không được bỏ trống' })
    @Transform(({ value }) => String(value))
    fruit_desc: string;

    @IsArray({ message: 'fruit_types phải là một mảng' })
    @ArrayNotEmpty({ message: 'Tình trạng trái cây là bắt buộc chọn' })
    @Transform(({ value }) => {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
                return parsed.map(Number);
            }
            return [];
        } catch (e) {
            return [];
        }
    })
    @IsInt({ each: true, message: 'Mỗi phần tử trong fruit_types phải là số nguyên' })
    fruit_types: number[];
}
