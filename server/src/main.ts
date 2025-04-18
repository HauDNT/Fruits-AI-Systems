import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {ConfigService} from "@nestjs/config";
import {swaggerConfig} from "@/config/swagger-config";

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

    // Swagger
    swaggerConfig(app);

    await app.listen(port ?? 8081);
}

bootstrap();
