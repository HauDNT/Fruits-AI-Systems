import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = (nestApp: INestApplication) => {
    const config = new DocumentBuilder()
        .setTitle('Fruits AI System APIs Documentation')
        .setDescription('Fruits AI System APIs description')
        .setVersion('1.0')
        .addTag('app')
        .build();

    const documentFactory = () => SwaggerModule.createDocument(nestApp, config);
    SwaggerModule.setup('swagger', nestApp, documentFactory);
}
