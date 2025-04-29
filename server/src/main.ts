import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {ConfigService} from "@nestjs/config";
import {swaggerConfig} from "@/config/swagger-config";
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.get("PORT");

    // Config CORS
    app.enableCors(
        {
            "origin": true,
            "methods": "GET , HEAD, PUT, PATCH, POST, DELETE",
            "preflightContinue": false,
            credentials: true
        }
    );

    // Serve static files in "uploads" folder at "/uploads" path
    app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

    // Swagger
    swaggerConfig(app);

    await app.listen(port ?? 8081);
}

bootstrap();
