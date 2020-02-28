import { Entity, Column, ObjectIdColumn } from "typeorm";
import { User } from "src/user/domain/user";
import { Contributor } from "src/user/domain/contributor";

/**
 * Multi-component project.
 * 
 * Project contains multiple components which representing e.g. microservices in a microservice architecture.
 */
@Entity()
export class Project {

    /**
     * The unique id given by mongoDB to the project
     */
    @ObjectIdColumn()
    _id?: string;

    /**
     * The name of the project
     */
    @Column()
    name: string;

    /**
     * The display name of the project
     */
    @Column()
    displayName: string;

    /**
     * The owner of the project
     */
    @Column()
    owner: User;

    /**
     * All contributors of the project
     */
    @Column()
    contributors: Contributor[];
}