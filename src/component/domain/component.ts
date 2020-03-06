import { Entity, ObjectIdColumn, Column } from "typeorm";

@Entity()
export class Component {

    @ObjectIdColumn()
    _id?: string;

    @Column()
    name: string;

    @Column()
    displayName: string;

    @Column()
    projectName: string;
}