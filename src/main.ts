import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as compression from 'compression';
import cookieParser = require('cookie-parser');
import * as helmet from 'helmet';
//import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

declare const module: any; // For hot-code replacement

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService); // Loads the config.env file

    app.use(compression());
    app.use(cookieParser());

    app.use(helmet()); // Protection against well-known web vulnerabilities
    app.enableCors(); // Enable Cross-origin resource sharing (CORS)
    // app.use(csurf()); // Mitigate Cross-site request forgery (also known as CSRF or XSRF) attacks
    app.use(
        rateLimit({
            windowMs: 2 * 60 * 1000, // 2 minutes
            max: 100, // limit each IP to 100 requests per windowMs
        }),
    );

    app.useGlobalPipes(new ValidationPipe({
        disableErrorMessages: !configService.get('VALIDATION_ERROR_MESSAGES'),
    })); // Validate the correctness of any data sent into this application

    /*
     * Generate swagger documentation and provide it under /api.
     * Download the swagger file under api-json
     */
    const options = new DocumentBuilder()
        .setTitle('Multi-Component Issue Management')
        .setDescription('API of the Multi-Component Issue Management System')
        .setVersion('1.0')
        .addTag('Multi-Component Issue')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);


    await app.listen(configService.get('PORT'));

    // Hot code replacement
    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();
