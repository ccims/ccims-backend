import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/service/user.service';
import { User } from 'src/user/domain/user';

/**
 * Service for authorization purpose.
 */
@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) { }

    /**
     * Registers a given user.
     * @param user The user which should be registered.
     * @returns The registered user.
     */
    async register(user: User): Promise<User> {
        return await this.userService.createUser(user);
    }

    /**
     * Loggs a given user in and returns a valid JWT.
     * @param user The user which should be logged in.
     * @returns The JWT of the user's name and id.
     */
    async login(user: any) {
        const payload = { username: user.username, sub: user.userId };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }

    /**
     * Validates a user by his name and password.
     * This operation is used by the auth guards.
     * @param username The user's name.
     * @param pass The user's password.
     * @returns An object containing the user's name, e-mail and id if valid or null otherwhise. 
     */
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.userService.findOne(username);
        if (user && user.password === pass) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

}
