import {Module} from '@nestjs/common';
import {RaspberryService} from './raspberry.service';
import {RaspberryController} from './raspberry.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Raspberry} from "@/modules/raspberry/entities/raspberry.entity";
import {Device} from "@/modules/devices/entities/device.entity";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {JWTStrategy} from "@/authentication/jwt/jwt-strategy";

@Module({
    imports: [
        TypeOrmModule.forFeature([Raspberry, Device]),
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
    providers: [RaspberryService, JWTStrategy],
})
export class RaspberryModule {
}
