import { Controller, Post, Body } from '@nestjs/common';
import { ProjectService } from '../service/project.service';
import { ProjectDto } from '../dto/project.dto';
import { Project } from '../domain/project';

/**
 * Controller for 'projects' API.
 * Offers Endpoints to CRUD projects.
 */
@Controller('projects')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) { }

    @Post()
    async create(@Body() projectDto: ProjectDto): Promise<ProjectDto> {
        const project: Project = {
            name: projectDto.name,
            ownerName: projectDto.ownerName,
            contributorNames: []
        };

        this.projectService.create(project);
        return project;
    }
}
