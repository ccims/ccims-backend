import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { User } from 'src/user/domain/user';
import { UserService } from 'src/user/service/user.service';

@Injectable()
export class ProjectOwnerPipe implements PipeTransform {

    constructor(private readonly userService: UserService) { }


    /**
     * Transforms the project's name to a user object.
     * @param value The project's data.
     * @param metadata Metadata of the request object.
     * @returns The transformed project.
     * @throws BadRequestException if the owner does not exists.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async transform(value: any, metadata: ArgumentMetadata) {
        const user: User = await this.userService.findOne(value.owner);
        value.owner = user;
        return value;
    }
}
