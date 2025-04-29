import {Module} from '@nestjs/common';
import {FruitClassificationService} from './fruit-classification.service';
import {FruitClassificationController} from './fruit-classification.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {FruitClassification} from "@/modules/fruit-classification/entities/fruit-classification.entity";
import {Fruit} from "@/modules/fruits/entities/fruit.entity";
import {Area} from "@/modules/areas/entities/area.entity";
import {FruitBatch} from "@/modules/fruit-batches/entities/fruit-batch.entity";
import {FruitType} from "@/modules/fruit-types/entities/fruit-type.entity";
import {FruitClassificationGateway} from "@/gateway/fruitClassification.gateway";

@Module({
    imports: [TypeOrmModule.forFeature([FruitClassification, Fruit, Area, FruitBatch, FruitType])],
    controllers: [FruitClassificationController],
    providers: [FruitClassificationService, FruitClassificationGateway],
    exports: [FruitClassificationGateway]
})
export class FruitClassificationModule {
}
