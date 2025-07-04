import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '@/config/configuration';
import { APP_FILTER } from '@nestjs/core';
import { typeOrmAsyncConfig } from '@/database/typeorm-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from '@/middleware/LoggerMiddleware';
import { FruitsModule } from './modules/fruits/fruits.module';
import { FruitTypesModule } from './modules/fruit-types/fruit-types.module';
import { FruitImagesModule } from './modules/fruit-images/fruit-images.module';
import { AreasModule } from './modules/areas/areas.module';
import { DeviceTypesModule } from './modules/device-types/device-types.module';
import { DeviceStatusModule } from './modules/device-status/device-status.module';
import { DevicesModule } from './modules/devices/devices.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { FruitClassificationModule } from './modules/fruit-classification/fruit-classification.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RaspberryModule } from './modules/raspberry/raspberry.module';
import { StatisticalModule } from './modules/statistical/statistical.module';
import { AllExceptionsFilter } from '@/config/AllExceptionsFilter';
// import { CacheModule } from '@nestjs/cache-manager';
// import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env.production'],
      load: [configuration],
    }),
    // CacheModule.registerAsync({
    //   isGlobal: true,
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     store: redisStore,
    //     host: configService.get<string>('redisHost'),
    //     port: configService.get<number>('redisPort'),
    //     ttl: configService.get<number>('redisTTL'),
    //   }),
    // }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    FruitsModule,
    FruitTypesModule,
    FruitImagesModule,
    AreasModule,
    DeviceTypesModule,
    DeviceStatusModule,
    DevicesModule,
    EmployeesModule,
    FruitClassificationModule,
    AuthModule,
    UserModule,
    RaspberryModule,
    StatisticalModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
