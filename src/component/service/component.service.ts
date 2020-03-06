import { Injectable, BadRequestException } from '@nestjs/common';
import { Component } from '../domain/component';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ComponentService {

    constructor(
        @InjectRepository(Component)
        private readonly componentRepository: MongoRepository<Component>
    ) { };

    /**
     * Creates a new component for a project in the database if it does not already exists.
     * @param component The component which should be added to the database.
     * @returns The component object created in the database.
     * @throws BadRequestException if component already exists.
     */
    async create(component: Component): Promise<Component> {
        const number = await this.componentRepository.count({ name: component.name, projectName: component.projectName });
        if (number > 0) {
            throw new BadRequestException('Component already exists for this project');
        }
        return await this.componentRepository.save(component);
    }

    /**
     * Finds the first entity with the given component in the db.
     * @param componentName The component's name.
     * @param projectName The project's name the component belongs to.
     * @returns The component with the given name if exists.
     * @throws BadRequestException if the component does not exists.
     */
    async findOne(projectName: string, componentName: string) {
        const component: Component = await this.componentRepository.findOne({ name: componentName, projectName: projectName });
        if (!component) {
            throw new BadRequestException(`Component ${componentName} of project ${projectName} does not exist`);
        }
        return component;
    }

    async getAll(projectName: string): Promise<Component[]> {
        return await this.componentRepository.find({ projectName: projectName });
    }
}
