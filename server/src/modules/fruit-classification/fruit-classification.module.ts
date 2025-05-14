import {Module} from '@nestjs/common';
import {FruitClassificationService} from './fruit-classification.service';
import {FruitClassificationController} from './fruit-classification.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {FruitClassification} from "@/modules/fruit-classification/entities/fruit-classification.entity";
import {Fruit} from "@/modules/fruits/entities/fruit.entity";
import {Area} from "@/modules/areas/entities/area.entity";
import {FruitType} from "@/modules/fruit-types/entities/fruit-type.entity";
import {SocketGateway} from "@/gateway/socketGateway";

@Module({
    imports: [TypeOrmModule.forFeature([FruitClassification, Fruit, Area, FruitType])],
    controllers: [FruitClassificationController],
    providers: [FruitClassificationService, SocketGateway],
    exports: [SocketGateway]
})
export class FruitClassificationModule {
}
