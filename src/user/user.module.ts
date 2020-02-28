import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { MongoRepository } from 'typeorm';
import { User } from './domain/user';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controller/user.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UserService, MongoRepository],
    exports: [UserService],
    controllers: [UserController]
})
export class UserModule { }
