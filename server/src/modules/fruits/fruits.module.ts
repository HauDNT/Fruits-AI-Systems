import {Module} from '@nestjs/common';
import {FruitsService} from './fruits.service';
import {FruitsController} from './fruits.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Fruit} from "@/modules/fruits/entities/fruit.entity";
import {FruitType} from "@/modules/fruit-types/entities/fruit-type.entity";
import {FruitTypesService} from "@/modules/fruit-types/fruit-types.service";
import {FruitImage} from "@/modules/fruit-images/entities/fruit-image.entity";
import {FruitClassification} from "@/modules/fruit-classification/entities/fruit-classification.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Fruit, FruitType, FruitImage, FruitClassification]),
    ],
    controllers: [FruitsController],
    providers: [FruitsService, FruitTypesService],
})
export class FruitsModule {
}
