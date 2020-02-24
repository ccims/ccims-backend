import { Module, CacheModule, CacheInterceptor } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { ComponentModule } from './component/component.module';

@Module({
    imports: [ConfigModule.forRoot({
        envFilePath: 'config.env',
        isGlobal: true,
        validationSchema: Joi.object({
            NODE_ENV: Joi.string()
                .valid('development', 'production', 'test', 'provision')
                .default('development'),
            PORT: Joi.number().default(3000),
        }),
        validationOptions: {
            allowUnknown: true,
            abortEarly: true,
        },
    }), CacheModule.register({
        ttl: 5, // seconds
        max: 10, // maximum number of items in cache
    }), AuthModule, UserModule, ProjectModule, ComponentModule],
    controllers: [AppController],
    providers: [AppService, {
        provide: APP_INTERCEPTOR,
        useClass: CacheInterceptor,
    }],
})
export class AppModule { }