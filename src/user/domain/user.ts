import { Entity, ObjectIdColumn, Column } from "typeorm";

@Entity()
export class User {
    @Column()
    username: string;
    @Column()
    password: string;
    @Column()
    email: string;
    @ObjectIdColumn()
    _id?: string;



    // ownedProjectsNames: string[];
    // contributedProjectsNames: string[];
}