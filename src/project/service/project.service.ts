import { Injectable, BadRequestException } from '@nestjs/common';
import { Project } from '../domain/project';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

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
        return await this.projectRepository.save(project);
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
}
