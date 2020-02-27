import { Module, CacheModule, CacheInterceptor } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { ComponentModule } from './component/component.module';
import { Connection } from 'typeorm';
import { User } from './user/domain/user';
import { Project } from './project/domain/project';

@Module({
    imports: [ConfigModule.forRoot({
        envFilePath: 'config.env',
        isGlobal: true,
        validationSchema: Joi.object({
            NODE_ENV: Joi.string()
                .valid('development', 'production', 'test', 'provision')
                .default('development'),
            PORT: Joi.number().default(3000),
            VALIDATION_ERROR_MESSAGES: Joi.boolean().default(true),
            SECRET: Joi.string()
        }),
        validationOptions: {
            allowUnknown: true,
            abortEarly: true,
        },
    }), CacheModule.register({
        ttl: 5, // seconds
        max: 10, // maximum number of items in cache
    }),
    TypeOrmModule.forRoot({
        type: 'mongodb',
        host: 'localhost',
        port: 27017,
        database: 'mcim',
        entities: [User, Project],
        synchronize: true,
        useNewUrlParser: true,
        logging: true,
        useUnifiedTopology: true
    }), AuthModule, UserModule, ProjectModule, ComponentModule],
    controllers: [],
    providers: [{
        provide: APP_INTERCEPTOR,
        useClass: CacheInterceptor,
    }],
})
export class AppModule {
    constructor(private readonly connection: Connection) { }
}
