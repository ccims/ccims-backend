import { Module } from '@nestjs/common';
import { ComponentController } from './controller/component.controller';
import { ComponentService } from './service/component.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Component } from './domain/component';
import { UserModule } from 'src/user/user.module';
import { ProjectModule } from 'src/project/project.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Component]), UserModule, ProjectModule,
        JwtModule.register({
            secret: 'some-really-hard-secret', // TODO load secret with service from config file
            signOptions: { expiresIn: '1d' }, // TODO extend expiresIn so that a user is logged in longer
        })],
    controllers: [ComponentController],
    providers: [ComponentService]
})
export class ComponentModule { }
