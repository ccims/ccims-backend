import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { UserRegistrationCredentialDto } from '../dto/user-registration-credential.dto';
import { UserCredential } from '../domain/user-credential';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() userCredentialDto: UserRegistrationCredentialDto): Promise<UserCredential> {
        return this.authService.register({
            username: userCredentialDto.username,
            password: userCredentialDto.password,
            email: userCredentialDto.email,
            userId: '123'
        });
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Body() loginCredential: UserCredential) {
        return this.authService.login(loginCredential);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req: any) {
        return req.user;
    }
}
