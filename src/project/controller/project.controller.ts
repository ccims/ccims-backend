import { Controller, Post, Body, UseGuards, Get, Param, Delete, UsePipes } from '@nestjs/common';
import { ProjectService } from '../service/project.service';
import { ProjectDto } from '../dto/project.dto';
import { ProjectOwnerPipe } from '../pipe/project.pipe';
import { Project } from '../domain/project';
import { User } from 'src/user/domain/user';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UsernameAuthGuard } from 'src/auth/guard/username-auth.guard';
import { ContributorDto } from 'src/user/dto/contributor.dto';
import { Contributor } from 'src/user/domain/contributor';
import { ProjectContributorPipe } from '../pipe/project-contributor.pipe';

/**
 * Controller for 'projects' API.
 * Offers Endpoints to CRUD projects.
 */
@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectController {
    constructor(
        private readonly projectService: ProjectService,
    ) { }

    /**
     * Creates a new project.
     * @param project The project that should be created.
     * @returns The project that is created.
     */
    @Post()
    @UseGuards(UsernameAuthGuard)
    async create(@Body(ProjectOwnerPipe) project: ProjectDto): Promise<Project> {
        const owner: any = project.owner;
        const contributor: Contributor = { username: (owner as User).username };
        return this.projectService.createProject({
            name: project.name,
            displayName: project.displayName,
            owner: owner as User,
            contributors: [contributor],
        });
    }

    /**
     * Gets the project with the given name.
     * @param name The project's name.
     * @returns The project with the given name.
     */
    @Get(':projectName')
    @UseGuards(UsernameAuthGuard)
    async getProjectByName(@Param('projectName') name: string): Promise<Project> {
        return await this.projectService.findOne(name);
    }

    /**
     * Deletes the project with the given name.
     * @param name The project's name.
     * @returns The project that is deleted.
     */
    @Delete(':projectName')
    @UseGuards(UsernameAuthGuard)
    async deleteProjectByName(@Param('projectName') name: string): Promise<Project> {
        return await this.projectService.deleteProjectByName(name);
    }

    /**
     * Adds a user as contributor to a project.
     * @param projectName The project's name.
     * @param contributor The contributor which should be added.
     * @returns The updated project.
     */
    @Post(':projectName/contributors')
    @UseGuards(UsernameAuthGuard)
    @UsePipes(ProjectContributorPipe)
    async addContributor(@Param('projectName') projectName: string, @Body() contributor: ContributorDto) {
        return await this.projectService.addAsContributorToProject(projectName, contributor);
    }

    /**
     * Removes a given contributor from the project.
     * @param projectName The name of the project which has the contributor.
     * @param contributor The contributor which should be removed from the project.
     * @returns The updated project without the contributor.
     */
    @Delete(':projectName/contributors')
    @UseGuards(UsernameAuthGuard)
    @UsePipes(ProjectContributorPipe)
    async removeContributor(@Param('projectName') projectName: string, @Body() contributor: ContributorDto) {
        await this.projectService.removeContributorFromProject(projectName, contributor);
        return this.projectService.findOne(projectName);
    }
}
