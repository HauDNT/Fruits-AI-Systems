import {Module} from '@nestjs/common';
import {RaspberryService} from './raspberry.service';
import {RaspberryController} from './raspberry.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Raspberry} from "@/modules/raspberry/entities/raspberry.entity";
import {Device} from "@/modules/devices/entities/device.entity";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {JWTStrategy} from "@/authentication/jwt/jwt-strategy";
import {Fruit} from "@/modules/fruits/entities/fruit.entity";
import {FruitType} from "@/modules/fruit-types/entities/fruit-type.entity";
import {DevicesService} from "@/modules/devices/devices.service";
import {FruitsService} from "@/modules/fruits/fruits.service";
import {FruitTypesService} from "@/modules/fruit-types/fruit-types.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Raspberry, Device, Fruit, FruitType]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('secret_key'),
                signOptions: {
                    expiresIn: '1h',
                }
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [RaspberryController],
    providers: [
        RaspberryService,
        JWTStrategy,
    ],
})
export class RaspberryModule {
}
