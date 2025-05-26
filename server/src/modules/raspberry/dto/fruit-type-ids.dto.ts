import {IsNotEmpty, IsNumber} from "class-validator";

export class FruitTypeIdsDto {
    @IsNumber()
    @IsNotEmpty({message: 'Mã trái cây không được bỏ trống'})
    fruit_id: number;

    @IsNumber()
    @IsNotEmpty({message: 'Mã tình trạng trái cây không được bỏ trống'})
    type_id: number;
}