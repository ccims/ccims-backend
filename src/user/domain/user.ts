import { Entity, ObjectIdColumn, Column } from "typeorm";
import { Project } from "src/project/domain/project";

/**
 * A user of the system.
 */
@Entity()
export class User {

    /**
     * The mongoDb id for the user entity.
     */
    @ObjectIdColumn()
    _id?: string;

    /**
     * The user's name.
     */
    @Column()
    username: string;

    /**
     * The user's password.
     */
    @Column()
    password: string;

    /**
     * The user's email.
     */
    @Column()
    email: string;

    /**
     * Projects the user contributes to.
     */
    @Column()
    projects: Project[];

}