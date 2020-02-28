import { IsNotEmpty, Matches } from "class-validator";

export class ContributorDto {

    @IsNotEmpty()
    @Matches(/^([a-zA-z]+[0-9]*)+$/)
    username: string;

}