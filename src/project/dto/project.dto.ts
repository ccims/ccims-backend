import { IsAlphanumeric, IsNotEmpty, Matches, IsString } from "class-validator";

export class ProjectDto {
    @IsNotEmpty()
    @Matches(/^[a-z]+(-[a-z]+)*$/)
    name: string;

    @IsNotEmpty()
    @IsAlphanumeric()
    @Matches(/^([a-zA-z]+[0-9]*)+$/)
    owner: string;

    @IsNotEmpty()
    @IsString()
    displayName: string;
}