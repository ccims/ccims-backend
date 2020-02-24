import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from '../domain/user';

@Injectable()
export class UserService {

    private readonly users: User[] = [];

    constructor() {
        this.users.push({
            username: 'raccoon',
            password: 'raccoon1234',
            email: 'raccoon@mcim.com',
            userId: '4214325'
        });
    }

    addToUsers(user: User) {
        // TODO refactor and use library to prevent code duplicates 
        for (let i = 0; i < this.users.length; i++) {
            const u: User = this.users[i];
            if (u.username === user.username) {
                throw new BadRequestException();
            }
        }
        this.users.push(user);
    }

    async findOne(username: string): Promise<User | undefined> {
        return this.users.find(user => user.username === username);
    }

}
