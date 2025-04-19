import {Module} from '@nestjs/common';
import {FruitTypesService} from './fruit-types.service';
import {FruitTypesController} from './fruit-types.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {FruitType} from "@/modules/fruit-types/entities/fruit-type.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([FruitType]),
    ],
    controllers: [FruitTypesController],
    providers: [FruitTypesService],
})
export class FruitTypesModule {
}
