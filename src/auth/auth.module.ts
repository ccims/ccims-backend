import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { LocalStrategy } from './auth-strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth-strategies/jwt.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
        UserModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: 'some-really-hard-secret', // TODO load secret with service from config file
            signOptions: { expiresIn: '600s' }, // TODO extend expiresIn so that a user is logged in longer
        }),],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule { }
