import { PartialType } from '@nestjs/swagger';
import { CreateDeviceStatusDto } from './create-device-status.dto';

export class UpdateDeviceStatusDto extends PartialType(CreateDeviceStatusDto) {}
