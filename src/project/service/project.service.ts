import { Injectable } from '@nestjs/common';
import { Project } from '../domain/project';

@Injectable()
export class ProjectService {

    private readonly projects: Project[] = [];
    create(project: Project) {
        this.projects.push(project);
    }
}
