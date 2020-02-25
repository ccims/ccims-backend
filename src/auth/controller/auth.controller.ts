import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { UserRegistrationCredentialDto } from '../dto/user-registration-credential.dto';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { User } from 'src/user/domain/user';
import { LoginCredentialDto } from '../dto/login-credential.dto';

/**
 * Controller wich implements auth endpoints, such as register and login a user.
 */
@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    /**
     * Registers a new user if the username does not already exists.
     * @param userCredentialDto Object which contains the user's name, password and e-mail.
     * @returns The created user object.
     */
    @Post('register')
    async register(@Body() userCredentialDto: UserRegistrationCredentialDto): Promise<User> {
        return await this.authService.register({
            username: userCredentialDto.username,
            password: userCredentialDto.password,
            email: userCredentialDto.email
        });
    }

    /**
     * Creates a valid JWT token for the user and loggs the user in only if the user's credentials are valid.
     * The credentials are checked using an auth guard.
     * @param loginCredential Username and password of the user which should be logged in.
     * @returns The JWT token containing the user's name and unique id.
     */
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Body() loginCredential: LoginCredentialDto) {
        return this.authService.login(loginCredential);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req: any) {
        return req.user;
    }
}
