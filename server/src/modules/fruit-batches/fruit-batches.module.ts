import {Module} from '@nestjs/common';
import {FruitBatchesService} from './fruit-batches.service';
import {FruitBatchesController} from './fruit-batches.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {FruitBatch} from "@/modules/fruit-batches/entities/fruit-batch.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([FruitBatch]),
    ],
    controllers: [FruitBatchesController],
    providers: [FruitBatchesService],
})
export class FruitBatchesModule {
}
