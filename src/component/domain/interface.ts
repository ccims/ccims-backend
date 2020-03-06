import { Entity, ObjectIdColumn, Column } from "typeorm";

@Entity()
export class Interface {

    @ObjectIdColumn()
    _id?: string;

    @Column()
    name: string;

    @Column()
    displayName: string;

    @Column()
    type: string;

    @Column()
    componentName: string;

    @Column()
    projectName: string;

}