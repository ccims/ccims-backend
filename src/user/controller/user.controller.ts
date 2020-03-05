import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

/**
 * Controller for retrieving and updating user data
 */
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }

    /**
     * Gets a user with given username.
     * @param username The user's name.
     * @returns The user's data.
     */
    @Get(':username')
    async getUserByName(@Param('username') username: string) {
        return await this.userService.findOne(username);
    }

    /**
     * Gets the project's of a user with given username.
     * @param username The user's name.
     * @returns The user's projects.
     */
    @Get(':username/projects')
    async getProjectOfUser(@Param('username') username: string) {
        return (await this.userService.findOne(username)).projects;
    }

}
