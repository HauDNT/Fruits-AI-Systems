import {IsNotEmpty, IsString, Length} from "class-validator";

export class CreateDeviceTypeDto {
    @IsString()
    @Length(8, 50, { message: 'Type name must be 8 to 50 characters' })
    @IsNotEmpty({ message: 'Type name is not empty' })
    type_name: string;
}
