import { Module } from '@nestjs/common';
import { ProjectController } from './controller/project.controller';
import { ProjectService } from './service/project.service';
import { Project } from './domain/project';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([Project]), UserModule],
    controllers: [ProjectController],
    providers: [ProjectService]
})
export class ProjectModule { }
