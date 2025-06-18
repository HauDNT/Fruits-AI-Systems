import { IsArray, IsNotEmpty } from 'class-validator';

export class DeleteDeviceDto {
  @IsArray()
  @IsNotEmpty({ message: 'Device list id is not empty' })
  deviceIds: string[];
}
