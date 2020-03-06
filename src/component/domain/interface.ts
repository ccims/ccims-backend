import { Entity, ObjectIdColumn, Column } from "typeorm";

/**
 * Entity of an interface.
 */
@Entity()
export class Interface {

    /**
     * The mongoDB ID of the interface.
     */
    @ObjectIdColumn()
    _id?: string;

    /**
     * The interface's name.
     */
    @Column()
    name: string;

    /**
     * The interface's display name.
     */
    @Column()
    displayName: string;

    /**
     * The type of the interface, e.g. REST or Messaging.
     */
    @Column()
    type: string;

    /**
     * The name of the component which provides the interface.
     */
    @Column()
    componentName: string;

    /**
     * The name of the project which contains the providing component.
     */
    @Column()
    projectName: string;

}