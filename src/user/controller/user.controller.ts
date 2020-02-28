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

    @Get(':username')
    async getUserByName(@Param('username') username: string) {
        return await this.userService.findOne(username);
    }

}
