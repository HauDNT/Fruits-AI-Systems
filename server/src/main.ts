import { join } from 'path';
import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { swaggerConfig } from '@/config/swagger-config';
import { AllExceptionsFilter } from '@/config/AllExceptionsFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('SERVER_PORT');

  // Config CORS
  app.enableCors({
    origin: true,
    methods: 'GET , HEAD, PUT, PATCH, POST, DELETE',
    preflightContinue: false,
    credentials: true,
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // Global filters
  app.useGlobalFilters(new AllExceptionsFilter());

  // Serve static files in "uploads" folder at "/uploads" path
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  // Swagger
  swaggerConfig(app);

  await app.listen(port ?? 8082, '0.0.0.0', () => {
    console.log(`Server is running on port ${process.env.SERVER_PORT || 8082}`);
  });
}

bootstrap();
