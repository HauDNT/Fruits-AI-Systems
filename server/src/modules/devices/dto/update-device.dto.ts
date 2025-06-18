import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { IsIntegerString } from '@/decorate/IsIntegerString.decorator';

export class UpdateDeviceDto {
  @IsString()
  @Type(() => String)
  @IsNotEmpty({ message: 'Phải chọn trạng thái thiết bị' })
  @IsIntegerString({ message: 'ID trạng thái thiết bị phải là một chuỗi số nguyên' })
  deviceStatus: string;

  @IsString()
  @Type(() => String)
  @IsNotEmpty({ message: 'Phải chọn khu vực lắp đặt' })
  @IsIntegerString({ message: 'ID khu vực phải là một chuỗi số nguyên' })
  area: string;
}
