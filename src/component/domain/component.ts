import { Entity, ObjectIdColumn, Column } from "typeorm";
import { ObjectId } from "mongodb";

/**
 * Entity of a component.
 */
@Entity()
export class Component {

    /**
     * MongoDB ID of the component.
     */
    @ObjectIdColumn()
    _id?: ObjectId;

    /**
     * The component's name.
     */
    @Column()
    name: string;

    /**
     * The component's display name.
     */
    @Column()
    displayName: string;

    /**
     * The name of the project which contains the component.
     */
    @Column()
    projectName: string;

    /**
     * List of the names of the interfaces which are provided by the component.
     */
    @Column()
    providedInterfacesNames: string[];
}