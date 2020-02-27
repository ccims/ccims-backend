import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/service/user.service';
import { ProjectService } from 'src/project/service/project.service';
import { Project } from 'src/project/domain/project';

@Injectable()
export class UsernameAuthGuard implements CanActivate {

    constructor(private readonly projectService: ProjectService) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        // console.log(request);
        return this.validateUsername(request);
    }

    async validateUsername(request: any) {
        if (request.method === 'POST' && request.url === '/projects') {
            return request.user.username === request.body.owner;
        } else if (request.route.path === '/projects/:name') {
            if (request.method === 'DELETE') {
                const project: Project = await this.projectService.findOne(request.params.name);
                return request.user.username === project.owner.username;
            } else {
                return false; // TODO check that user is contributor of the project
            }
        }
        return false;
    }
}