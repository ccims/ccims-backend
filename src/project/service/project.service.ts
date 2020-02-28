import { Injectable, BadRequestException } from '@nestjs/common';
import { Project } from '../domain/project';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Contributor } from 'src/user/domain/contributor';
import * as _ from "lodash";

/**
 * Service for the project's domain.
 */
@Injectable()
export class ProjectService {

    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: MongoRepository<Project>
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
     * Deletes the project with given name.
     * @param name The project's name.
     * @returns The project which is deleted.
     */
    async deleteProjectByName(name: string): Promise<Project> {
        const deleted: Project = await this.findOne(name);
        await this.projectRepository.deleteOne({ name: name });
        return deleted;
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
        return await this.updateOrCreateProject(project);
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
