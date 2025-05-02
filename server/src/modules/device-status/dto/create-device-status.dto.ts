import {IsNotEmpty, IsString, Length} from "class-validator";

export class CreateDeviceStatusDto {
    @IsString()
    @Length(8, 50, { message: 'Status name must be 8 to 50 characters' })
    @IsNotEmpty({ message: 'Status name is not empty' })
    status_name: string;
}
