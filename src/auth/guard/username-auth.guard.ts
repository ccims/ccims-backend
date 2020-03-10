import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ProjectService } from 'src/project/service/project.service';
import { Project } from 'src/project/domain/project';
import * as _ from "lodash";


/**
 * Checks if the user of the JWT is allowed to perform the actions, e.g. DELETE a project. 
 */
@Injectable()
export class UsernameAuthGuard implements CanActivate {

    constructor(private readonly projectService: ProjectService) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateUsername(request);
    }

    /**
     * Validates whether the user is allowed for the endpoint or not.
     * @param request The request object.
     * @returns true if he is allowed, otherwhise false.
     */
    private async validateUsername(request: any) {
        if (request.method === 'POST' && request.url === '/projects') {
            return request.user.username === request.body.owner;
        } else if ((request.route.path as string).includes('/projects/:projectName')) {
            const project: Project = await this.projectService.findOne(request.params.projectName);
            if (!(request.route.path as string).includes('components') && request.method !== 'GET') {
                return request.user.username === project.owner.username;
            } else {
                return _.some(project.contributors, { username: request.user.username });
            }
        }
        return false;
    }
}