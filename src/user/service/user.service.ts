import { Injectable, BadRequestException } from '@nestjs/common';
import { MongoRepository, getConnection, UpdateWriteOpResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/project/domain/project';
import { User } from '../domain/user';
import _ = require('lodash');

/**
 * Service for the user's domain.
 */
@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: MongoRepository<User>,
    ) { }

    /**
     * Creates a new user entry in the database if the user does not already exists.
     * @param user The user which should be added to the database.
     * @returns The user object created in the database.
     * @throws BadRequestException if user already exists.
     */
    async createUser(user: User): Promise<User> {
        const number = await this.userRepository.count({ username: user.username });
        if (number > 0) {
            throw new BadRequestException('User already exists');
        }
        return await this.userRepository.save(user);
    }

    /**
     * Finds the first entity with the given username in the db.
     * @param username The user's name.
     * @returns The user with the given username if exists.
     * @throws BadRequestException if user does not exists.
     */
    async findOne(username: string): Promise<User> {
        const user: User = await this.findOneTransaction(username);
        if (!user) {
            throw new BadRequestException(`User ${username} does not exists`);
        }
        return user;
    }

    /**
     * Adds a given project to a given user.
     * @param project The project which should be added to the user.
     * @param username The user's name.
     * @throws BadRequestException if the user does not exist.
     */
    async addProjectToUser(project: Project, username: string) {
        const result: UpdateWriteOpResult = await this.userRepository.updateOne({ username: username }, { $push: { projectNames: project.name } });
        if (result.modifiedCount === 0) {
            throw new BadRequestException(`The user ${username} does not exist!`);
        }
    }

    /**
     * Removes a project from a given user.
     * @param projectName The name of the project which should be removed.
     * @param username The user's name.
     */
    async removeProjectFromUser(projectName: string, username: string) {
        await this.userRepository.updateOne({ username: username }, { $pull: { projectNames: projectName } });
    }

    /**
     * Database transaction to find a user with given username.
     * @param username The name of the user which should be found.
     */
    private async findOneTransaction(username: string): Promise<User> {
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            // TODO join and filter directly in database 
            const users: User[] = await this.userRepository.aggregate([
                {
                    $match: { username: username }
                },
                {
                    $lookup: {
                        from: "project", localField: "projectNames",
                        foreignField: "name", as: "projects"
                    }
                }
            ]).toArray();
            const user: User = _.find(users, (u) => { return u.username === username; });
            await queryRunner.commitTransaction();
            return user;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new BadRequestException(`User ${username} does not exists`);
        } finally {
            await queryRunner.release();
        }
    }

}
