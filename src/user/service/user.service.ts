import { Injectable, BadRequestException } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/project/domain/project';
import { User } from '../domain/user';

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
        const user: User = await this.userRepository.findOne({ username: username });
        if (!user) {
            throw new BadRequestException(`User ${username} does not exists`);
        }
        return user;
    }

    /**
     * Adds a given project to a given user.
     * @param project The project which should be added to the user.
     * @param username The user's name.
     * @returns The updated user.
     */
    async addProjectToUser(project: Project, username: string): Promise<User> {
        const user: User = await this.findOne(username);
        user.projectNames.push(project.name);
        return await this.userRepository.save(user);
    }

    // /**
    //  * Adds a new contributor to the project entity of all user that contributes to the given project.
    //  * @param projectName The project's name the user contributes to.
    //  * @param contributor The contributor's name which shoud be added to the user's project.
    //  */
    // async addContributorToOtherUsersOfProject(projectName: string, contributor: Contributor) {
    //     this.userRepository.updateMany({ projects: { $elemMatch: { name: projectName } } }, { $addToSet: { "projects.$.contributors": contributor } });
    // }

    /**
     * Removes a project from a given user.
     * @param projectName The name of the project which should be removed.
     * @param username The user's name.
     */
    async removeProjectFromUser(projectName: string, username: string) {
        this.userRepository.updateOne({ username: username }, { $pull: { projectNames: projectName } });
    }

}
