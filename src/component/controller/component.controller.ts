import { Controller, Get, Body, Post, Param, UseGuards, Delete } from '@nestjs/common';
import { Component } from '../domain/component';
import { ComponentDto } from '../dto/component.dto';
import { ComponentService } from '../service/component.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UsernameAuthGuard } from 'src/auth/guard/username-auth.guard';
import { Interface } from '../domain/interface';
import { InterfaceDto } from '../dto/interface.dto';

/**
 * Controller for 'components' API.
 * Offers Endpoints to CRUD components.
 */
@Controller('projects/:projectName/components')
@UseGuards(JwtAuthGuard)
export class ComponentController {

    constructor(private readonly componentService: ComponentService) { }

    /**
     * Creates a new component.
     * @param projectName The project that should contain the component.
     * @param component The component that should be created.
     * @returns The component that is created.
     */
    @Post()
    @UseGuards(UsernameAuthGuard)
    async create(@Param('projectName') projectName: string, @Body() component: ComponentDto) {
        return await this.componentService.create({
            name: component.name,
            displayName: component.displayName,
            projectName: projectName,
            providedInterfacesNames: []
        });
    }

    /**
     * Gets the component with the given name.
     * @param componentName The component's name.
     * @param projectName The project's name which contains the component.
     * @returns The component with given name.
     */
    @Get(':componentName')
    @UseGuards(UsernameAuthGuard)
    async getComponentByName(@Param('componentName') componentName: string, @Param('projectName') projectName: string): Promise<Component> {
        return await this.componentService.findOne(projectName, componentName);
    }

    /**
     * Gets all components of a given project.
     * @param projectName The project's name.
     * @returns List of components of the project.
     */
    @Get()
    @UseGuards(UsernameAuthGuard)
    async getAll(@Param('projectName') projectName: string): Promise<Component[]> {
        return await this.componentService.getAll(projectName);
    }

    /**
     * Creates an interface for a given component.
     * @param projectName The project's name which contains the component that provides the interface.
     * @param componentName The component's name that provides the interface.
     * @param componentInterface The interface which should be created.
     */
    @Post(':componentName/interfaces')
    @UseGuards(UsernameAuthGuard)
    async createInterface(@Param('projectName') projectName: string, @Param('componentName') componentName: string, @Body() componentInterface: InterfaceDto): Promise<Interface> {
        return await this.componentService.createInterface(projectName, componentName, {
            name: componentInterface.name,
            displayName: componentInterface.displayName,
            type: componentInterface.type,
            componentName: componentName,
            projectName: projectName
        });
    }

    @Delete(':componentName/interfaces/:interfaceName')
    @UseGuards(UsernameAuthGuard)
    async deleteInterface(@Param('projectName') projectName: string, @Param('componentName') componentName: string, @Param('interfaceName') interfaceID: string) {
        return this.componentService.deleteInterface(projectName, componentName, interfaceID);
    }
}
