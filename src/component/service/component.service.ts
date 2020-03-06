import { Injectable, BadRequestException } from '@nestjs/common';
import { Component } from '../domain/component';
import { MongoRepository, getConnection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Interface } from '../domain/interface';

/**
 * Service for the component domain.
 */
@Injectable()
export class ComponentService {

    constructor(
        @InjectRepository(Component)
        private readonly componentRepository: MongoRepository<Component>,
        @InjectRepository(Interface)
        private readonly interfaceRepository: MongoRepository<Interface>
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
     * @param projectName The project's name the component belongs to.
     * @param componentName The component's name.
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

    /**
     * Gets all components of a given project.
     * @param projectName The project's name.
     * @returns List of components of the given project.
     */
    async getAll(projectName: string): Promise<Component[]> {
        return await this.componentRepository.find({ projectName: projectName });
    }

    async deleteComponent(projectName: string, componentName: string) {
        const component: Component = await this.findOne(projectName, componentName);
        await this.deleteComponentTransaction(componentName, projectName);
        return component;
    }


    /**
     * Creates a new interface for a given component in the database.
     * @param projectName The project's name which the component belongs to.
     * @param componentName The component's name for which the interface should be created.
     * @param componentInterface The interface which should be created.
     */
    async createInterface(projectName: string, componentName: string, componentInterface: Interface) {
        const number = await this.interfaceRepository.count({ name: componentInterface.name, componentName: componentInterface.componentName });
        if (number > 0) {
            throw new BadRequestException('Interface already exists for this component');
        }
        return await this.createInterfaceTransaction(componentInterface, componentName, projectName);
    }

    /**
     * Deletes an interface of a given component.
     * @param projectName The project's name which the component belongs to.
     * @param componentName The component's name for which the interface should be deleted.
     * @param interfaceName The name of the interface which should be deleted.
     */
    async deleteInterface(projectName: string, componentName: string, interfaceName: string) {
        const componentInterface: Interface = await this.interfaceRepository.findOne({ name: interfaceName, componentName: componentName, projectName: projectName });
        if (!componentInterface) {
            throw new BadRequestException('This interface does not exist');
        }
        await this.deleteInterfaceTransaction(interfaceName, componentName, projectName);
        return componentInterface;
    }

    /**
     * Database transaction to delete a component.
     * @param componentName The name of the component which should be deleted.
     * @param projectName The name of the project that contains the component.
     * @throws BadRequestException if some error happens during the transaction.
     */
    private async deleteComponentTransaction(componentName: string, projectName: string) {
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await this.componentRepository.deleteOne({ name: componentName, projectName: projectName });
            await this.interfaceRepository.deleteMany({ componentName: componentName, projectName: projectName });
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new BadRequestException(`The component could not be deleted`);
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * Database transaction to delete an interface from a component.
     * @param interfaceName The interface's id.
     * @param componentName The component's name.
     * @param projectName The project's name.
     * @throws BadRequestException if some error happens during the transaction.
     */
    private async deleteInterfaceTransaction(interfaceName: string, componentName: string, projectName: string) {
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await this.interfaceRepository.deleteOne({ name: interfaceName, componentName: componentName, projectName: projectName });
            await this.componentRepository.updateOne({ name: componentName, projectName: projectName }, { $pull: { providedInterfacesNames: interfaceName } });
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new BadRequestException(`The interface could not be deleted`);
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * Database transaction to create an interface.
     * @param componentInterface The interface which should be created.
     * @param componentName The component's name to which the interface belongs to.
     * @param projectName The project's name which contains the component.
     * @throws BadRequestException if some error happens during the transaction.
     */
    private async createInterfaceTransaction(componentInterface: Interface, componentName: string, projectName: string) {
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const createdInterface: Interface = await this.interfaceRepository.save(componentInterface);
            const component: Component = await this.findOne(projectName, componentName);
            component.providedInterfacesNames.push(createdInterface.name);
            await this.componentRepository.save(component);
            await queryRunner.commitTransaction();
            return createdInterface;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new BadRequestException(`The interface could not be created`);
        } finally {
            await queryRunner.release();
        }
    }
}
