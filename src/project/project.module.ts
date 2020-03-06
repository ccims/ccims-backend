import { Module } from '@nestjs/common';
import { ProjectController } from './controller/project.controller';
import { ProjectService } from './service/project.service';
import { Project } from './domain/project';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([Project]), UserModule,
        JwtModule.register({
            secret: 'some-really-hard-secret', // TODO load secret with service from config file
            signOptions: { expiresIn: '1d' }, // TODO extend expiresIn so that a user is logged in longer
        })],
    controllers: [ProjectController],
    providers: [ProjectService],
    exports: [ProjectService]
})
export class ProjectModule { }
