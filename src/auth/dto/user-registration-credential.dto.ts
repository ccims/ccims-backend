import { IsEmail, IsNotEmpty, MinLength, IsAlphanumeric } from 'class-validator';

export class UserRegistrationCredentialDto {
    @IsNotEmpty()
    @IsAlphanumeric()
    username: string;

    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @IsEmail()
    email: string;
}