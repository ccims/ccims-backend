import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { UserService } from 'src/user/service/user.service';
import { ProjectService } from '../service/project.service';

/**
 * Pipe to check if a given contributor exists as user and if a given project exists.
 * If both exist, the pipe will return the value untransformed.
 */
@Injectable()
export class ProjectContributorPipe implements PipeTransform {

    constructor(private readonly userService: UserService,
        private readonly projectService: ProjectService) { }


    /**
     * Checks if the contributor and project exist.
     * @param value The contributor's data or project name depending on the metadata type.
     * @param metadata Metadata of the request object.
     * @returns The untransformed contributor if contributor and project exist.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type === 'param') {
            await this.projectService.findOne(value);
        } else {
            await this.userService.findOne(value.username);
        }
        return value;
    }
}
