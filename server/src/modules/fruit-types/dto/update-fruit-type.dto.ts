import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateFruitTypeDto {
  @IsString()
  @Length(1, 50, { message: 'Tình trạng trái cây phải từ 1 đến 50 ký tự' })
  @IsNotEmpty({ message: 'Tình trạng trái cây không được bỏ trống' })
  type_name: string;

  @IsString()
  @Length(1, 100, { message: 'Mô tả tình trạng phải từ 1 đến 100 ký tự' })
  @IsNotEmpty({ message: 'Mô tả tình trạng không được bỏ trống' })
  type_desc: string;
}
