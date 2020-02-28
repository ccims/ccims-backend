import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ProjectService } from 'src/project/service/project.service';
import { Project } from 'src/project/domain/project';
import { User } from 'src/user/domain/user';

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
        } else if (request.route.path === '/projects/:name') {
            const project: Project = await this.projectService.findOne(request.params.name);
            if (request.method === 'DELETE') {
                return request.user.username === project.owner.username;
            } else {
                return this.isContributor(request.user.username, project.contributors);
            }
        }
        return false;
    }

    /**
     * Checks whether a list of contributors of a project contains a user with given username or not.
     * @param contributorName The contributor's name to be checked.
     * @param contributors List of all contributors of a project.
     * @returns true if the user is a contributor, else false.
     */
    private isContributor(contributorName: string, contributors: User[]) {
        for (const c of contributors) {
            if (contributorName === c.username) {
                return true;
            }
        }
        return false;
    }
}