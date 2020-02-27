import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class UserRegistrationCredentialDto {
    @IsNotEmpty()
    @Matches(/^([a-zA-z]+[0-9]*)+$/)
    username: string;

    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @IsEmail()
    email: string;
}