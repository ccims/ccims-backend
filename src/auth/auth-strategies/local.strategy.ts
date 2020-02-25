import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../service/auth.service';

/**
 * Local passport strategy to validate a user by given username and password.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super();
    }

    /**
     * Validates the user by his given username and password.
     * @param username the user's name
     * @param password the user's password
     * @returns The user object if valid
     * @throws UnauthorizedException if validation fails
     */
    async validate(username: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(username, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}