import { Injectable, BadRequestException } from '@nestjs/common';
import { MongoRepository, getConnection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from "lodash";
import { Project } from '../domain/project';
import { Contributor } from 'src/user/domain/contributor';
import { UserService } from 'src/user/service/user.service';

/**
 * Service for the project's domain.
 */
@Injectable()
export class ProjectService {

    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: MongoRepository<Project>,
        private readonly userService: UserService
    ) { }

    /**
     * Creates a new project entry in the database if the project does not already exists.
     * @param project The project which should be added to the database.
     * @returns The project object created in the database.
     * @throws BadRequestException if project already exists.
     */
    async createProject(project: Project) {
        const number = await this.projectRepository.count({ name: project.name });
        if (number > 0) {
            throw new BadRequestException('Project already exists');
        }
        return await this.updateOrCreateProject(project);
    }

    /**
     * Finds the first entity with the given project in the db.
     * @param projectName The project's name.
     * @returns The project with the given name if exists.
     * @throws BadRequestException if the project does not exists.
     */
    async findOne(projectName: string): Promise<Project> {
        const project: Project = await this.projectRepository.findOne({ name: projectName });
        if (!project) {
            throw new BadRequestException(`Project ${projectName} does not exists`);
        }
        return project;
    }

    /**
     * Deletes the project with given name and removes it from all contributors.
     * @param name The project's name.
     * @returns The project which is deleted.
     */
    async deleteProjectByName(name: string): Promise<Project> {
        const project: Project = await this.findOne(name);
        await this.deleteProjectTransaction(project);
        return project;
    }

    /**
     * Adds a user as contributor to a project.
     * @param projectName The project's name.
     * @param contributor The user to be added as contributor.
     * @returns The updated project if the user was no contributor.
     * @throws BadRequestException if the user is already contributor to the project.
     */
    async addAsContributorToProject(projectName: string, contributor: Contributor) {
        const project: Project = await this.findOne(projectName);
        if (_.some(project.contributors, contributor)) {
            throw new BadRequestException(`User ${contributor.username} is already contributor of ${projectName}`);
        };
        project.contributors.push(contributor);
        await this.addContributorTransaction(project, contributor);
        return project;
    }

    /**
     * Database transaction to add a contributor to a project.
     * @param project The project on which the contributor should be added.
     * @param contributor The contributor which should be added.
     * @throws BadRequestException if some error happens during the transaction.
     */
    private async addContributorTransaction(project: Project, contributor: Contributor) {
        // get a connection and create a new query runner
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        // establish real database connection using our new query runner
        await queryRunner.connect();
        // open a new transaction:
        await queryRunner.startTransaction();
        try {
            // execute some operations on this transaction:
            await this.userService.addProjectToUser(project, contributor.username);
            await this.updateOrCreateProject(project);
            // commit transaction now:
            await queryRunner.commitTransaction();
        } catch (error) {
            // since we have errors lets rollback changes we made
            await queryRunner.rollbackTransaction();
            throw new BadRequestException(`Contributor ${contributor.username} could not be added to ${project.name}`);
        } finally {
            // release query runner which is manually created:
            await queryRunner.release();
        }
    }

    /**
     * Database transaction to deletes a project and remove it from all contributors.
     * @param project The project to be deleted.
     * @throws BadRequestException if some error happens during the transaction.
     */
    private async deleteProjectTransaction(project: Project) {
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await this.projectRepository.deleteOne({ name: project.name });
            project.contributors.forEach(async c => { await this.userService.removeProjectFromUser(project.name, c.username); });
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new BadRequestException(`Project ${project.name} could not be deleted`);
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * Updates or adds a given project to the database.
     * @param project The project to be added or updated.
     * @returns The added/updated project.
     */
    private async updateOrCreateProject(project: Project) {
        return await this.projectRepository.save(project);
    }
}
